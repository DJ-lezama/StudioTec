import { collection, getDocs, orderBy, query } from "firebase/firestore"
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

        const servicesData = querySnapshot.docs.map((doc) => {
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
        console.log("Fetched all services:", servicesData)
        return servicesData
    } catch (err) {
        console.error("Error fetching all services:", err)
        throw new Error(
            "No se pudieron cargar los servicios desde la base de datos.",
        )
    }
}
