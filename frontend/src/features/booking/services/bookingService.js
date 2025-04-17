import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
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
            // TODO: Optionally we could add an 'updatedAt: serverTimestamp()' field here if needed
            // Also, need to modify the data structure in Firestore to include this field
            // updatedAt: serverTimestamp(),
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
