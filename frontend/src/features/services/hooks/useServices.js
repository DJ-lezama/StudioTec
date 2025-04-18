import { useEffect, useState } from "react"
import { fetchAllServices } from "../servicesService.js"

/**
 * Custom hook to fetch and manage the state for the full list of services.
 * @returns {{ services: Array<object>, isLoading: boolean, error: Error|null }} An object containing:
 * - services: An array of all service objects fetched from Firestore.
 * - isLoading: Boolean indicating if the fetch operation is in progress.
 * - error: An error object if fetching failed, otherwise null.
 */
export const useServices = () => {
    const [services, setServices] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadServices = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const fetchedServices = await fetchAllServices()
                setServices(fetchedServices)
            } catch (err) {
                console.error("useServices hook error:", err)
                setError(err)
                setServices([])
            } finally {
                setIsLoading(false)
            }
        }

        loadServices().then((r) => r)
    }, [])

    return { services, isLoading, error }
}
