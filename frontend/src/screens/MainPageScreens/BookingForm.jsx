import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import catalogData, {
    categoryConfig,
} from "../../components/catalog/catalogData"
import ProgressSteps from "../../components/booking/ProgressSteps"
import ServiceSelectionStep from "../../components/booking/steps/ServiceSelectionStep"
import StylistSelectionStep from "../../components/booking/steps/StylistSelectionStep"
import DateTimeSelectionStep from "../../components/booking/steps/DateTimeSelectionStep"
import PersonalDetailsStep from "../../components/booking/steps/PersonalDetailsStep"
import ConfirmationStep from "../../components/booking/steps/ConfirmationStep"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Timestamp } from "firebase/firestore"
import useAuth from "../../features/auth/hooks/useAuth.js"
import { createAppointmentRequest } from "../../features/booking/services/bookingService.js"

// TODO Mock data - Replace with data fetched from Firestore eventually
const stylists = [
    { id: "stylistA", name: "Estilista A" },
    { id: "stylistB", name: "Estilista B" },
    { id: "stylistC", name: "Estilista C" },
]

const availableTimes = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
]

const initialFormData = {
    category: "",
    serviceId: "",
    stylistId: "",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    comments: "",
    inspirationImageUrl: "",
}

function BookingForm() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState(initialFormData)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const navigate = useNavigate()
    const { currentUser } = useAuth()

    const nextStep = () => setStep(step + 1)
    const prevStep = () => setStep(step - 1)

    useEffect(() => {
        if (currentUser) {
            setFormData((prevData) => ({
                ...prevData,
                name: prevData.name || currentUser.name || "",
                email: prevData.email || currentUser.email || "",
                phone: prevData.phone || currentUser.phone || "",
            }))
        } else {
            setFormData((prevData) => ({
                ...prevData,
                name: "",
                email: "",
                phone: "",
            }))
        }
    }, [currentUser])

    const handleFormUpdate = (newData) => {
        setFormData(newData)
    }

    const formatDate = (dateString) => {
        if (!dateString) return ""
        const dateParts = dateString
            .split("-")
            .map((part) => parseInt(part, 10))
        const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
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

    const handleSubmit = async (e) => {
        if (e) e.preventDefault()
        setSubmitError(null)

        // Basic check before final submission (can be enhanced)
        if (
            !formData.serviceId ||
            !formData.stylistId ||
            !formData.date ||
            !formData.time ||
            !formData.name ||
            !formData.email ||
            !formData.phone
        ) {
            setSubmitError(
                "Por favor completa todos los pasos y campos requeridos antes de confirmar.",
            )
            return
        }

        setIsSubmitting(true)
        try {
            const [hours, minutes] = formData.time
                .split(":")
                .map((part) => parseInt(part, 10))
            const dateParts = formData.date
                .split("-")
                .map((part) => parseInt(part, 10))
            const requestedDate = new Date(
                dateParts[0],
                dateParts[1] - 1,
                dateParts[2],
                hours,
                minutes,
            )

            const appointmentData = {
                clientId: currentUser.uid,
                clientName: currentUser.name,
                stylistId: formData.stylistId,
                stylistName: selectedStylist,
                serviceId: formData.serviceId,
                serviceName: selectedService,
                requestedDateTime: Timestamp.fromDate(requestedDate),
                status: "pending",
                clientNotes: formData.comments || "",
                inspirationImageUrl: formData.inspirationImageUrl || "",
            }

            await createAppointmentRequest(appointmentData)

            navigate("/confirmacion")
            setFormData(initialFormData)
            setStep(1)
        } catch (error) {
            console.error("Booking submission error:", error)
            setSubmitError(
                "Error al enviar la solicitud. Por favor, inténtalo de nuevo más tarde.",
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <ServiceSelectionStep
                        formData={formData}
                        onFormUpdate={handleFormUpdate}
                        onNext={nextStep}
                        categoryConfig={categoryConfig}
                        catalogData={catalogData}
                    />
                )
            case 2:
                return (
                    <StylistSelectionStep
                        formData={formData}
                        onFormUpdate={handleFormUpdate}
                        onNext={nextStep}
                        onPrev={prevStep}
                        stylists={stylists}
                    />
                )
            case 3:
                return (
                    <DateTimeSelectionStep
                        formData={formData}
                        onFormUpdate={handleFormUpdate}
                        onNext={nextStep}
                        onPrev={prevStep}
                        availableTimes={availableTimes}
                    />
                )
            case 4:
                return (
                    <PersonalDetailsStep
                        formData={formData}
                        onFormUpdate={handleFormUpdate}
                        onNext={nextStep}
                        onPrev={prevStep}
                        currentUser={currentUser}
                    />
                )
            case 5:
                return (
                    <ConfirmationStep
                        formData={formData}
                        onPrev={prevStep}
                        onSubmit={handleSubmit}
                        selectedService={selectedService}
                        selectedStylist={selectedStylist}
                        isSubmitting={isSubmitting}
                        formatDate={formatDate}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 sm:px-8 lg:px-16 bg-primaryLight">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
                <h1 className="text-h2 font-heading font-bold text-textMain mb-6 text-center md:text-left">
                    Agenda tu cita
                </h1>
                {submitError && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
                        role="alert"
                    >
                        <strong className="font-bold">¡Error! </strong>
                        <span className="block sm:inline">{submitError}</span>
                    </div>
                )}
                <ProgressSteps currentStep={step} totalSteps={5} />
                <div className="mt-8">{renderStepContent()}</div>
            </div>
        </div>
    )
}

export default BookingForm
