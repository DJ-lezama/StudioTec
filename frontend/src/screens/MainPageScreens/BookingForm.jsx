import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
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
import { toast } from "react-toastify"

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

const findCategoryByServiceId = (serviceId) => {
    for (const categoryKey in catalogData) {
        if (
            catalogData[categoryKey].some((service) => service.id === serviceId)
        ) {
            return categoryKey
        }
    }
    return ""
}

const findServiceDetails = (serviceId) => {
    for (const categoryKey in catalogData) {
        const service = catalogData[categoryKey].find((s) => s.id === serviceId)
        if (service) {
            return service
        }
    }
    return null
}

function BookingForm() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState(initialFormData)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const location = useLocation()

    useEffect(() => {
        const prefillData = location.state
        if (prefillData?.serviceId && prefillData?.stylistId) {
            const category = findCategoryByServiceId(prefillData.serviceId)
            if (category) {
                console.log("Pre-filling form:", prefillData)
                setFormData((prevData) => ({
                    ...prevData,
                    serviceId: prefillData.serviceId,
                    stylistId: prefillData.stylistId,
                    category: category,
                    name: prevData.name || currentUser?.name || "",
                    email: prevData.email || currentUser?.email || "",
                    phone: prevData.phone || currentUser?.phone || "",
                }))
                setStep(3)
                toast.info(
                    "Servicio y estilista seleccionados desde tu historial.",
                )
            } else {
                console.warn(
                    "Could not find category for pre-filled serviceId:",
                    prefillData.serviceId,
                )
                setFormData((prevData) => ({
                    ...prevData,
                    name: prevData.name || currentUser?.name || "",
                    email: prevData.email || currentUser?.email || "",
                    phone: prevData.phone || currentUser?.phone || "",
                }))
            }
        } else {
            if (currentUser && step === 1) {
                setFormData((prevData) => ({
                    ...prevData,
                    name: prevData.name || currentUser.name || "",
                    email: prevData.email || currentUser.email || "",
                    phone: prevData.phone || currentUser.phone || "",
                }))
            }
        }
    }, [location.state, currentUser, step])

    const nextStep = () => setStep(step + 1)
    const prevStep = () => setStep(step - 1)
    const handleFormUpdate = (newData) => setFormData(newData)
    const formatDate = (dateString) => {
        if (!dateString) return ""
        try {
            const dateParts = dateString
                .split("-")
                .map((part) => parseInt(part, 10))
            const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
            return format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
        } catch (e) {
            console.error("Error formatting date string:", dateString, e)
            return "Fecha inválida"
        }
    }

    const selectedServiceDetails = findServiceDetails(formData.serviceId)
    const selectedService = selectedServiceDetails?.title || ""
    const selectedStylist =
        stylists.find((s) => s.id === formData.stylistId)?.name || ""

    const handleSubmit = async (e) => {
        if (e) e.preventDefault()
        setSubmitError(null)

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
        if (!currentUser?.uid) {
            setSubmitError("Debes iniciar sesión para completar la reserva.")
            return
        }

        const serviceDuration = selectedServiceDetails?.duration
        if (typeof serviceDuration !== "number" || serviceDuration <= 0) {
            console.error(
                "Invalid or missing duration for service:",
                formData.serviceId,
                selectedServiceDetails,
            )
            setSubmitError(
                "No se pudo determinar la duración del servicio seleccionado.",
            )
            toast.error("Error: Duración del servicio inválida.")
            return
        }

        setIsSubmitting(true)
        const [year, month, day] = formData.date.split("-").map(Number)
        const [hours, minutes] = formData.time.split(":").map(Number)
        const requestedDate = new Date(year, month - 1, day, hours, minutes)

        if (isNaN(requestedDate.getTime())) {
            throw new Error("Fecha u hora inválida.")
        }
        try {
            const appointmentData = {
                clientId: currentUser.uid,
                clientName: formData.name,
                clientEmail: formData.email,
                clientPhone: formData.phone,
                stylistId: formData.stylistId,
                stylistName: selectedStylist,
                serviceId: formData.serviceId,
                serviceName: selectedService,
                duration: serviceDuration,
                requestedDateTime: Timestamp.fromDate(requestedDate),
                status: "pending",
                clientNotes: formData.comments || "",
                inspirationImageUrl: formData.inspirationImageUrl || "",
            }

            await createAppointmentRequest(appointmentData)

            navigate("/confirmacion", {
                state: {
                    appointmentDetails: {
                        service: selectedService,
                        stylist: selectedStylist,
                        date: formatDate(formData.date),
                        time: formData.time,
                    },
                },
            })
            setFormData(initialFormData)
            setStep(1)
        } catch (error) {
            console.error("Booking submission error:", error)
            setSubmitError(
                `Error al enviar la solicitud: ${error.message || "Inténtalo de nuevo."}`,
            )
            toast.error(
                `Error al enviar la solicitud: ${error.message || "Inténtalo de nuevo."}`,
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
                        submitError={submitError}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-16 bg-primaryLight">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h1 className="text-h2 font-heading font-bold text-textMain mb-6 text-center md:text-left">
                    Agenda tu cita
                </h1>
                <ProgressSteps currentStep={step} totalSteps={5} />
                <div className="mt-8">{renderStepContent()}</div>
            </div>
        </div>
    )
}

export default BookingForm
