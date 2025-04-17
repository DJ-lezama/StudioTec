import { useEffect, useState } from "react"
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore"
import { db } from "../../../../firebaseConfig"

/**
 * Custom hook to fetch and listen for real-time updates on actionable appointment requests.
 * Fetches appointments from the 'appointments' collection where status is 'pending' OR 'suggestion_made',
 * ordered by creation time.
 * These represent appointments requiring stylist or client action.
 *
 * @returns {{ pendingRequests: Array, isLoading: boolean, error: Error|null }} An object containing:
 * - pendingRequests: An array of pending or suggestion-made appointment objects,
 *                    each including its Firestore document ID.
 * - isLoading: Boolean indicating if the initial data fetch is in progress.
 * - error: An error object if fetching failed, otherwise null.
 */
export const usePendingRequests = () => {
    const [pendingRequests, setPendingRequests] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        const q = query(
            collection(db, "appointments"),
            where("status", "in", ["pending", "suggestion_made"]),
            orderBy("createdAt", "asc"),
        )

        // Set up the real-time listener
        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const requests = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                setPendingRequests(requests)
                setIsLoading(false)
                setError(null)
            },
            (err) => {
                console.error("Error fetching pending/suggested requests:", err)
                setError(err)
                setPendingRequests([])
                setIsLoading(false)
            },
        )

        return () => unsubscribe()
    }, [])

    return { pendingRequests, isLoading, error }
}
