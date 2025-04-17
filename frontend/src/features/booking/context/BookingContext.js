import React, { createContext, useContext, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const BookingContext = createContext()

export const useBooking = () => useContext(BookingContext)

export const BookingProvider = ({
    children,
    initialFormData,
    stylists,
    catalogData,
}) => {
    const [formData, setFormData] = useState(initialFormData)

    const updateFormData = (newData) => {
        setFormData(newData)
    }

    const resetFormData = () => {
        setFormData(initialFormData)
    }

    const formatDate = (dateString) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
    }

    const selectedService =
        formData.category && catalogData[formData.category]
            ? catalogData[formData.category].find(
                  (s) => s.id === formData.serviceId,
              )?.title
            : ""

    const selectedStylist =
        stylists.find((s) => s.id === formData.stylistId)?.name || ""

    const validateStep = (step) => {
        switch (step) {
            case 1:
                return !!formData.serviceId
            case 2:
                return !!formData.stylistId
            case 3:
                return !!formData.date && !!formData.time
            case 4:
                return !!formData.name && !!formData.email && !!formData.phone
            default:
                return true
        }
    }

    return (
        <BookingContext.Provider
            value={{
                formData,
                updateFormData,
                resetFormData,
                formatDate,
                selectedService,
                selectedStylist,
                validateStep,
            }}
        >
            {children}
        </BookingContext.Provider>
    )
}
