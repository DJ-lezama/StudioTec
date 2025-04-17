import { useEffect, useState } from "react"
import { db } from "../../../../firebaseConfig"
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore"

/**
 * Custom hook to fetch and listen for real-time updates on accepted appointment requests
 * for a specific stylist.
 * Fetches appointments from the 'appointments' collection where status is 'accepted'
 * and stylistId matches, ordered by requestedDateTime.
 *
 * @param {string} stylistId - The UID of the stylist whose appointments to fetch.
 * @returns {{ acceptedAppointments: Array, isLoading: boolean, error: Error|null }} An object containing:
 * - acceptedAppointments: An array of accepted appointment objects, each including its Firestore document ID.
 * - isLoading: Boolean indicating if the initial data fetch is in progress.
 * - error: An error object if fetching failed, otherwise null.
 */
export const useAcceptedAppointments = (stylistId) => {
    const [acceptedAppointments, setAcceptedAppointments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!stylistId) {
            setIsLoading(false)
            setAcceptedAppointments([])
            return
        }

        setIsLoading(true)
        setError(null)

        const q = query(
            collection(db, "appointments"),
            where("status", "==", "accepted"),
            where("stylistId", "==", stylistId),
            orderBy("requestedDateTime", "asc"),
        )

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const appointments = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                setAcceptedAppointments(appointments)
                setIsLoading(false)
            },
            (err) => {
                console.error(
                    `Error fetching accepted appointments for stylist ${stylistId}:`,
                    err,
                )
                setError(err)
                setAcceptedAppointments([])
                setIsLoading(false)
            },
        )

        return () => unsubscribe()
    }, [stylistId])

    return { acceptedAppointments, isLoading, error }
}
