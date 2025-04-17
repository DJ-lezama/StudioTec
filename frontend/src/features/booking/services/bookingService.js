import {
    addDoc,
    collection,
    deleteField,
    doc,
    getDoc,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore"
import { db } from "../../../../firebaseConfig.js"

/**
 * Creates a new appointment request document in Firestore.
 * @param {object} appointmentData - The data for the new appointment.
 * Must include all fields for the /appointments document
 * except createdAt, which will be added.
 * @returns {Promise<DocumentReference>} A promise that resolves with the DocumentReference of the newly created document.
 * @throws {Error} Throws an error if the Firestore operation fails.
 */
export const createAppointmentRequest = async (appointmentData) => {
    try {
        const dataToSave = {
            ...appointmentData,
            createdAt: serverTimestamp(),
        }
        const appointmentsCollectionRef = collection(db, "appointments")
        const docRef = await addDoc(appointmentsCollectionRef, dataToSave)
        console.log("Appointment request created with ID: ", docRef.id)
        return docRef
    } catch (error) {
        console.error("Error creating appointment request: ", error)
        throw new Error("Failed to create appointment request in Firestore.")
    }
}

/**
 * Updates the status of a specific appointment document in Firestore.
 * @param {string} appointmentId - The ID of the appointment document to update.
 * @param {"accepted" | "rejected" | "completed" | "cancelled"} status - The new status value.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 * @throws {Error} Throws an error if the Firestore operation fails.
 */
export const updateAppointmentStatus = async (appointmentId, status) => {
    if (!appointmentId || !status) {
        throw new Error("Appointment ID and new status are required.")
    }
    try {
        const appointmentDocRef = doc(db, "appointments", appointmentId)
        await updateDoc(appointmentDocRef, {
            status: status,
            updatedAt: serverTimestamp(),
        })
        console.log(`Appointment ${appointmentId} status updated to: ${status}`)
    } catch (error) {
        console.error(
            `Error updating appointment ${appointmentId} status:`,
            error,
        )
        throw new Error(`Failed to update appointment status to ${status}.`)
    }
}

/**
 * Adds or updates a suggestion (comment and alternative time) for an appointment.
 * Sets the appointment status to 'suggestion_made'.
 * @param {string} appointmentId - The ID of the appointment document.
 * @param {Date} suggestedDateTime - The suggested date and time as a JavaScript Date object.
 * @param {string} suggestionComment - The comment from the stylist.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 * @throws {Error} Throws an error if required parameters are missing or the Firestore operation fails.
 */
export const updateAppointmentSuggestion = async (
    appointmentId,
    suggestedDateTime,
    suggestionComment,
) => {
    if (!appointmentId || !suggestedDateTime || !suggestionComment) {
        throw new Error(
            "Appointment ID, suggested date/time, and comment are required.",
        )
    }

    if (
        !(suggestedDateTime instanceof Date) ||
        isNaN(suggestedDateTime.getTime())
    ) {
        throw new Error("Invalid Date object provided for suggestedDateTime.")
    }
    if (
        typeof suggestionComment !== "string" ||
        suggestionComment.trim() === ""
    ) {
        throw new Error("Suggestion comment cannot be empty.")
    }
    try {
        const appointmentDocRef = doc(db, "appointments", appointmentId)
        await updateDoc(appointmentDocRef, {
            suggestedDateTime: Timestamp.fromDate(suggestedDateTime),
            suggestionComment: suggestionComment.trim(),
            status: "suggestion_made",
            updatedAt: serverTimestamp(),
        })
        console.log(`Suggestion added/updated for appointment ${appointmentId}`)
    } catch (error) {
        console.error(
            `Error adding/updating suggestion for appointment ${appointmentId}:`,
            error,
        )
        throw new Error(
            "Failed to add or update appointment suggestion in Firestore.",
        )
    }
}

/**
 * Accepts a stylist's suggested time for an appointment.
 * Updates status to 'accepted', sets requestedDateTime to suggestedDateTime,
 * and removes suggestion fields.
 * @param {string} appointmentId - The ID of the appointment to update.
 * @returns {Promise<void>}
 * @throws {Error} If appointment or suggestion data is missing, or update fails.
 */
export const acceptAppointmentSuggestion = async (appointmentId) => {
    if (!appointmentId) {
        throw new Error("Appointment ID is required.")
    }

    const appointmentDocRef = doc(db, "appointments", appointmentId)

    const docSnap = await getDoc(appointmentDocRef)

    if (!docSnap.exists()) {
        throw new Error("Appointment not found.")
    }

    const data = docSnap.data()
    if (data.status !== "suggestion_made" || !data.suggestedDateTime) {
        throw new Error("No valid suggestion found to accept.")
    }

    try {
        await updateDoc(appointmentDocRef, {
            status: "accepted",
            requestedDateTime: data.suggestedDateTime,
            suggestedDateTime: deleteField(),
            suggestionComment: deleteField(),
            updatedAt: serverTimestamp(),
        })

        console.log(`Suggestion accepted for appointment ${appointmentId}`)
    } catch (error) {
        console.error(`Error accepting suggestion for ${appointmentId}:`, error)
        throw new Error(`Failed to accept suggestion: ${error.message}`)
    }
}

/**
 * Declines a stylist's suggested time for an appointment.
 * Reverts status to 'pending' and removes suggestion fields.
 * @param {string} appointmentId - The ID of the appointment to update.
 * @returns {Promise<void>}
 * @throws {Error} If update fails.
 */
export const declineAppointmentSuggestion = async (appointmentId) => {
    if (!appointmentId) {
        throw new Error("Appointment ID is required.")
    }
    const appointmentDocRef = doc(db, "appointments", appointmentId)

    try {
        await updateDoc(appointmentDocRef, {
            status: "pending",
            suggestedDateTime: deleteField(),
            suggestionComment: deleteField(),
            updatedAt: serverTimestamp(),
        })
        console.log(`Suggestion declined for appointment ${appointmentId}`)
    } catch (error) {
        console.error(`Error declining suggestion for ${appointmentId}:`, error)
        throw new Error(`Failed to decline suggestion: ${error.message}`)
    }
}
