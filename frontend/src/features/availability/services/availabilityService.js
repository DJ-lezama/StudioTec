import { db } from "../../../../firebaseConfig"
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    Timestamp,
    where,
} from "firebase/firestore"
import { addMinutes, endOfDay, formatISO, startOfDay } from "date-fns"

/**
 * Determines the applicable working hours for a stylist on a specific date,
 * considering default hours and overrides.
 * @param {Date} targetDate - The date to check (JavaScript Date object).
 * @param {object} stylistProfile - The fetched stylist profile data.
 * @returns {Array|null} Array of working hour ranges ["HH:mm-HH:mm"] or null if OFF.
 */
const getApplicableWorkingHours = (targetDate, stylistProfile) => {
    const dateString = formatISO(targetDate, { representation: "date" }) // "YYYY-MM-DD"
    const dayOfWeek =
        formatISO(targetDate, { format: "basic" }).substring(0, 8) ===
        formatISO(new Date(), { format: "basic" }).substring(0, 8)
            ? formatISO(targetDate, { representation: "date" })
            : targetDate
                  .toLocaleDateString("en-US", { weekday: "long" })
                  .toLowerCase()

    const override = stylistProfile.availabilityOverrides?.[dateString]
    if (override) {
        if (override.type === "OFF") {
            return null
        }
        if (override.type === "CUSTOM_HOURS" && Array.isArray(override.hours)) {
            return override.hours
        }
    }

    const defaultHours = stylistProfile.workingHours?.[dayOfWeek]
    if (!defaultHours || defaultHours.length === 0) {
        return null
    }
    return defaultHours
}

/**
 * Checks if a specific time slot is available for a given stylist.
 * Considers working hours, overrides, buffer time, and existing appointments.
 *
 * @param {string} stylistId - The ID of the stylist.
 * @param {Date} requestedStartTime - The desired start time (JavaScript Date object).
 * @param {number} serviceDurationMinutes - The duration of the service in minutes.
 * @returns {Promise<{isAvailable: boolean, reason?: string}>} - Object indicating availability and optional reason.
 */
export const checkAvailability = async (
    stylistId,
    requestedStartTime,
    serviceDurationMinutes,
) => {
    if (
        !stylistId ||
        !requestedStartTime ||
        !serviceDurationMinutes ||
        isNaN(requestedStartTime.getTime())
    ) {
        console.error("Invalid parameters for checkAvailability", {
            stylistId,
            requestedStartTime,
            serviceDurationMinutes,
        })
        return { isAvailable: false, reason: "Invalid input data." }
    }

    try {
        //  1. Fetch Stylist Profile and Appointments Concurrently-
        const profileRef = doc(db, "stylist_profiles", stylistId)
        const dayStart = startOfDay(requestedStartTime)
        const dayEnd = endOfDay(requestedStartTime)
        const appointmentsQuery = query(
            collection(db, "appointments"),
            where("stylistId", "==", stylistId),
            where("status", "in", ["accepted", "pending", "suggestion_made"]),
            // TODO: Consider pending/suggested as potential blocking? Or just 'accepted'?
            // Let's start with accepted only for conflicts.
            // where("status", "==", "accepted"),
            where("requestedDateTime", ">=", Timestamp.fromDate(dayStart)),
            where("requestedDateTime", "<=", Timestamp.fromDate(dayEnd)),
        )

        const [profileSnap, appointmentsSnap] = await Promise.all([
            getDoc(profileRef),
            getDocs(appointmentsQuery),
        ])

        // 2. Validate Profile
        if (!profileSnap.exists()) {
            return { isAvailable: false, reason: "Stylist profile not found." }
        }
        const stylistProfile = profileSnap.data()
        const bufferTime = stylistProfile.bufferTime || 0

        // 3. Calculate Target Slot
        const requestedEndTime = addMinutes(
            requestedStartTime,
            serviceDurationMinutes,
        )
        const targetInterval = {
            start: requestedStartTime,
            end: requestedEndTime,
        }

        // 4. Check Working Hours / Overrides
        const workingHoursRanges = getApplicableWorkingHours(
            requestedStartTime,
            stylistProfile,
        )
        if (!workingHoursRanges) {
            return { isAvailable: false, reason: "Stylist is off on this day." }
        }

        let isInWorkingHours = false
        for (const range of workingHoursRanges) {
            const [startStr, endStr] = range.split("-")
            if (!startStr || !endStr) continue

            const workStart = new Date(requestedStartTime)
            const [startH, startM] = startStr.split(":").map(Number)
            workStart.setHours(startH, startM, 0, 0)

            const workEnd = new Date(requestedStartTime)
            const [endH, endM] = endStr.split(":").map(Number)
            workEnd.setHours(endH, endM, 0, 0)

            if (isNaN(workStart.getTime()) || isNaN(workEnd.getTime())) continue

            if (
                requestedStartTime >= workStart &&
                requestedEndTime <= workEnd
            ) {
                isInWorkingHours = true
                break
            }
        }

        if (!isInWorkingHours) {
            return {
                isAvailable: false,
                reason: "Time slot is outside working hours.",
            }
        }

        //  5. Check Conflicts with Existing Appointments
        const existingAppointments = appointmentsSnap.docs.map((doc) =>
            doc.data(),
        )

        for (const appt of existingAppointments) {
            if (!appt.requestedDateTime || typeof appt.duration !== "number")
                continue

            const existingStart = appt.requestedDateTime.toDate()
            const existingEnd = addMinutes(
                existingStart,
                appt.duration + bufferTime,
            )
            const existingInterval = { start: existingStart, end: existingEnd }

            const overlaps =
                targetInterval.start < existingInterval.end &&
                targetInterval.end > existingInterval.start

            if (overlaps) {
                return {
                    isAvailable: false,
                    reason: `Conflicts with existing appointment at ${formatISO(
                        existingStart,
                        {
                            format: "extended",
                            representation: "time",
                        },
                    )}.`,
                }
            }
        }

        // 6. Available!
        return { isAvailable: true }
    } catch (error) {
        console.error("Error checking availability:", error)
        return { isAvailable: false, reason: "Error checking availability." }
    }
}

/**
 * Generates potential time slots for a given day based on stylist's availability.
 *
 * @param {string} stylistId - The ID of the stylist.
 * @param {Date} targetDate - The date for which to generate slots.
 * @param {number} serviceDurationMinutes - The duration of the service.
 * @param {number} [slotIntervalMinutes=30] - The interval between potential slots (e.g., 30 or 60).
 * @returns {Promise<Array<{time: string, isAvailable: boolean, reason?: string}>>} - Array of potential slots with availability status.
 */
export const getAvailableSlotsForDay = async (
    stylistId,
    targetDate,
    serviceDurationMinutes,
    slotIntervalMinutes = 30,
) => {
    const slots = []
    if (
        !stylistId ||
        !targetDate ||
        !serviceDurationMinutes ||
        isNaN(targetDate.getTime())
    ) {
        console.error("Invalid parameters for getAvailableSlotsForDay")
        return []
    }

    try {
        const profileRef = doc(db, "stylist_profiles", stylistId)
        const profileSnap = await getDoc(profileRef)
        if (!profileSnap.exists()) {
            console.warn("Stylist profile not found for generating slots.")
            return []
        }
        const stylistProfile = profileSnap.data()
        const workingHoursRanges = getApplicableWorkingHours(
            targetDate,
            stylistProfile,
        )

        if (!workingHoursRanges) {
            console.log(
                "Stylist is off, no slots generated for",
                formatISO(targetDate, { representation: "date" }),
            )
            return []
        }

        const dayStart = startOfDay(targetDate)
        const dayEnd = endOfDay(targetDate)
        const appointmentsQuery = query(
            collection(db, "appointments"),
            where("stylistId", "==", stylistId),
            // where("status", "==", "accepted"), // TODO: Only check accepted for conflicts
            where("status", "in", ["accepted", "pending", "suggestion_made"]),
            where("requestedDateTime", ">=", Timestamp.fromDate(dayStart)),
            where("requestedDateTime", "<=", Timestamp.fromDate(dayEnd)),
        )
        const appointmentsSnap = await getDocs(appointmentsQuery)
        const existingAppointments = appointmentsSnap.docs.map((doc) =>
            doc.data(),
        )
        const bufferTime = stylistProfile.bufferTime || 0

        for (const range of workingHoursRanges) {
            const [startStr, endStr] = range.split("-")
            if (!startStr || !endStr) continue

            const workStart = new Date(targetDate)
            const [startH, startM] = startStr.split(":").map(Number)
            workStart.setHours(startH, startM, 0, 0)

            const workEnd = new Date(targetDate)
            const [endH, endM] = endStr.split(":").map(Number)
            workEnd.setHours(endH, endM, 0, 0)

            if (isNaN(workStart.getTime()) || isNaN(workEnd.getTime())) continue

            let currentSlotTime = new Date(workStart)
            while (
                addMinutes(currentSlotTime, serviceDurationMinutes) <= workEnd
            ) {
                const slotStartTime = new Date(currentSlotTime)
                const slotEndTime = addMinutes(
                    slotStartTime,
                    serviceDurationMinutes,
                )
                const slotString = formatISO(slotStartTime, {
                    representation: "time",
                }).substring(0, 5)

                let isAvailable = true
                let reason = undefined

                // 1. Check Conflicts (already fetched appointments)
                for (const appt of existingAppointments) {
                    if (
                        !appt.requestedDateTime ||
                        typeof appt.duration !== "number"
                    )
                        continue
                    const existingStart = appt.requestedDateTime.toDate()
                    const existingEnd = addMinutes(
                        existingStart,
                        appt.duration + bufferTime,
                    )

                    if (
                        slotStartTime < existingEnd &&
                        slotEndTime > existingStart
                    ) {
                        isAvailable = false
                        reason = `Conflict with appointment at ${formatISO(existingStart, { representation: "time" }).substring(0, 5)}`
                        break // No need to check further conflicts for this slot
                    }
                }

                // 2. TODO: Add check for minimum notice period if needed (e.g., cannot book less than 1 hour from now)
                // const now = new Date();
                // if (isAvailable && slotStartTime < addHours(now, 1)) {
                //     isAvailable = false;
                //     reason = "Booking too soon.";
                // }

                slots.push({ time: slotString, isAvailable, reason })

                currentSlotTime = addMinutes(
                    currentSlotTime,
                    slotIntervalMinutes,
                )
            }
        }

        slots.sort((a, b) => a.time.localeCompare(b.time))

        return slots
    } catch (error) {
        console.error("Error generating available slots:", error)
        return [] // Return empty on error
    }
}
