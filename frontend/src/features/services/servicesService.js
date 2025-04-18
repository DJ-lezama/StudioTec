import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore"
import { db } from "../../../firebaseConfig.js"

/**
 * Fetches all service documents from the 'services' collection in Firestore.
 * Orders them by name by default.
 * Parses numeric fields and adds the document ID.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of service objects.
 * @throws {Error} Throws an error if the Firestore operation fails.
 */
export const fetchAllServices = async () => {
    try {
        const servicesCollectionRef = collection(db, "services")
        const q = query(servicesCollectionRef, orderBy("name", "asc"))
        const querySnapshot = await getDocs(q)

        return querySnapshot.docs.map((doc) => {
            const data = doc.data()
            return {
                serviceID: doc.id,
                ...data,
                basePrice:
                    typeof data.basePrice === "number"
                        ? data.basePrice
                        : parseFloat(data.basePrice) || 0,
                duration:
                    typeof data.duration === "number"
                        ? data.duration
                        : parseInt(data.duration, 10) || 0,
            }
        })
    } catch (err) {
        console.error("Error fetching all services:", err)
        throw new Error(
            "No se pudieron cargar los servicios desde la base de datos.",
        )
    }
}

/**
 * Adds a new service document to Firestore.
 * @param {object} serviceData - Data for the new service (name, description, etc.).
 * @returns {Promise<DocumentReference>} The reference to the newly created document.
 * @throws {Error} Throws an error if the operation fails.
 */
export const addService = async (serviceData) => {
    try {
        const servicesCollectionRef = collection(db, "services")
        const dataToAdd = {
            ...serviceData,
            isActive: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }
        const docRef = await addDoc(servicesCollectionRef, dataToAdd)
        console.log("Service added with ID:", docRef.id)
        return docRef
    } catch (err) {
        console.error("Error adding service:", err)
        throw new Error(`Error al añadir el servicio: ${err.message}`)
    }
}

/**
 * Updates an existing service document in Firestore.
 * @param {string} serviceId - The ID of the service document to update.
 * @param {object} serviceData - An object containing the fields to update.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the operation fails.
 */
export const updateService = async (serviceId, serviceData) => {
    try {
        const serviceDocRef = doc(db, "services", serviceId)
        const dataToUpdate = {
            ...serviceData,
            updatedAt: serverTimestamp(),
        }
        await updateDoc(serviceDocRef, dataToUpdate)
        console.log("Service updated:", serviceId)
    } catch (err) {
        console.error("Error updating service:", err)
        throw new Error(`Error al actualizar el servicio: ${err.message}`)
    }
}

/**
 * Deletes a service document from Firestore.
 * @param {string} serviceId - The ID of the service document to delete.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the operation fails.
 */
export const deleteService = async (serviceId) => {
    try {
        const serviceDocRef = doc(db, "services", serviceId)
        await deleteDoc(serviceDocRef)
        console.log("Service deleted:", serviceId)
    } catch (err) {
        console.error("Error deleting service:", err)
        throw new Error(`Error al eliminar el servicio: ${err.message}`)
    }
}

/**
 * Updates the isActive status of a service document.
 * @param {string} serviceId - The ID of the service document.
 * @param {boolean} newStatus - The new status (true for active, false for inactive).
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the operation fails.
 */
export const updateServiceStatus = async (serviceId, newStatus) => {
    try {
        const serviceDocRef = doc(db, "services", serviceId)
        await updateDoc(serviceDocRef, {
            isActive: newStatus,
            updatedAt: serverTimestamp(),
        })
        console.log("Service status updated:", serviceId, "to", newStatus)
    } catch (err) {
        console.error("Error updating service status:", err)
        throw new Error(
            `Error al actualizar el estado del servicio: ${err.message}`,
        )
    }
}
