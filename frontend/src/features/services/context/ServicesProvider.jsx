import React, { useMemo } from "react"
import ServicesContext from "./ServicesContext"
import { useServices } from "../hooks/useServices"

const ServicesProvider = ({ children }) => {
    const { services, isLoading, error, refetchServices } = useServices()

    const contextValue = useMemo(
        () => ({
            services,
            isLoading,
            error,
            refetchServices,
        }),
        [services, isLoading, error, refetchServices],
    )

    return (
        <ServicesContext.Provider value={contextValue}>
            {children}
        </ServicesContext.Provider>
    )
}

export default ServicesProvider
