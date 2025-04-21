import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
    collection,
    getDocs,
    query,
    Timestamp,
    where,
} from "firebase/firestore"
import { db } from "../../../firebaseConfig"
import ProgressSteps from "../../components/booking/ProgressSteps"
import ServiceSelectionStep from "../../components/booking/steps/ServiceSelectionStep"
import StylistSelectionStep from "../../components/booking/steps/StylistSelectionStep"
import DateTimeSelectionStep from "../../components/booking/steps/DateTimeSelectionStep"
import PersonalDetailsStep from "../../components/booking/steps/PersonalDetailsStep"
import ConfirmationStep from "../../components/booking/steps/ConfirmationStep"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import useAuth from "../../features/auth/hooks/useAuth.js"
import { createAppointmentRequest } from "../../features/booking/services/bookingService.js"
import { toast } from "react-toastify"
import { AlertTriangle, Loader2 } from "lucide-react"
import ServicesContext from "../../features/services/context/ServicesContext.js"

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
    const prefillProcessedRef = useRef(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const location = useLocation()

    const [stylistsList, setStylistsList] = useState([])
    const [isLoadingStylists, setIsLoadingStylists] = useState(true)
    const [fetchStylistsError, setFetchStylistsError] = useState(null)

    const {
        services: allServices,
        isLoading: isLoadingServices,
        error: servicesError,
    } = useContext(ServicesContext)

    const selectedServiceDetails = useMemo(() => {
        if (!formData.serviceId || !allServices || allServices.length === 0) {
            return null
        }
        const service = allServices.find(
            (s) => s.serviceID === formData.serviceId,
        )
        return service || null
    }, [formData.serviceId, allServices])

    useEffect(() => {
        const fetchStylists = async () => {
            setIsLoadingStylists(true)
            setFetchStylistsError(null)
            try {
                const q = query(
                    collection(db, "users"),
                    where("role", "==", "stylist"),
                )
                const querySnapshot = await getDocs(q)
                const fetchedStylists = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name,
                }))
                fetchedStylists.sort((a, b) => a.name.localeCompare(b.name))
                setStylistsList(fetchedStylists)
            } catch (error) {
                console.error("Error fetching stylists:", error)
                setFetchStylistsError(
                    "No se pudieron cargar los estilistas. Intenta recargar.",
                )
                toast.error("Error al cargar estilistas.")
            } finally {
                setIsLoadingStylists(false)
            }
        }
        fetchStylists().then((r) => r)
    }, [])

    useEffect(() => {
        if (formData.serviceId) {
            setFormData((prev) => ({ ...prev, time: "" }))

            if (
                !isLoadingServices &&
                allServices.length > 0 &&
                !allServices.some((s) => s.serviceID === formData.serviceId)
            ) {
                console.warn(
                    "Selected serviceId not found in fetched services list:",
                    formData.serviceId,
                )
            }
        }
    }, [formData.serviceId, isLoadingServices, allServices])

    useEffect(() => {
        if (formData.stylistId) {
            setFormData((prev) => ({ ...prev, time: "" }))
        }
    }, [formData.stylistId])

    useEffect(() => {
        const prefillData = location.state
        const hasPrefillServiceId = prefillData?.serviceId

        if (hasPrefillServiceId && !prefillProcessedRef.current) {
            if (!isLoadingServices && allServices?.length > 0) {
                const service = allServices.find(
                    (s) => s.serviceID === prefillData.serviceId,
                )

                if (service?.category) {
                    console.log(
                        "Pre-filling form from location state (serviceId):",
                        prefillData,
                    )
                    setFormData((prevData) => ({
                        ...initialFormData,
                        category: service.category,
                        serviceId: prefillData.serviceId,
                        name: prevData.name || currentUser?.name || "",
                        email: prevData.email || currentUser?.email || "",
                        phone: prevData.phone || currentUser?.phone || "",
                    }))
                    setStep(2)
                    toast.info("Servicio seleccionado.")
                    prefillProcessedRef.current = true
                    navigate(location.pathname, { replace: true, state: {} })
                } else {
                    console.warn(
                        "Could not pre-fill: Service ID from state not found or missing category.",
                        { prefillData, service },
                    )
                    prefillProcessedRef.current = true
                    navigate(location.pathname, { replace: true, state: {} })
                }
            }
        }

        if (
            currentUser &&
            !formData.name &&
            !formData.email &&
            step === 1 &&
            !hasPrefillServiceId
        ) {
            console.log("Pre-filling user details for logged-in user.")
            setFormData((prevData) => ({
                ...prevData,
                name: currentUser.name || "",
                email: currentUser.email || "",
                phone: currentUser.phone || "",
            }))
        }
    }, [
        location.state,
        currentUser,
        isLoadingServices,
        allServices,
        navigate,
        location.pathname,
        step,
        formData.name,
        formData.email,
    ])

    const handleFormUpdate = useCallback((newData) => {
        setFormData(newData)
    }, [])

    const nextStep = () => setStep(step + 1)
    const prevStep = () => setStep(step - 1)

    const formatDate = (dateString) => {
        if (!dateString) return ""
        try {
            const dateParts = dateString
                .split("-")
                .map((part) => parseInt(part, 10))
            const date = new Date(
                Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]),
            )
            return format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
        } catch (e) {
            console.error("Error formatting date string:", dateString, e)
            return "Fecha inválida"
        }
    }

    const selectedService = useMemo(
        () => selectedServiceDetails?.name || "",
        [selectedServiceDetails],
    )
    const selectedStylist = useMemo(
        () => stylistsList.find((s) => s.id === formData.stylistId)?.name || "",
        [stylistsList, formData.stylistId],
    )

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
            toast.warn("Por favor completa todos los campos requeridos.")
            return
        }
        if (!currentUser?.uid) {
            setSubmitError("Debes iniciar sesión para completar la reserva.")
            toast.error("Inicio de sesión requerido.")
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
            setSubmitError("Fecha u hora seleccionada inválida.")
            toast.error("Error: Fecha u hora inválida.")
            setIsSubmitting(false)
            return
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

            toast.success("¡Solicitud de cita enviada!")

            navigate("/confirmacion", {
                state: {
                    appointmentDetails: {
                        service: selectedService,
                        stylist: selectedStylist,
                        date: formatDate(formData.date),
                        time: formData.time,
                    },
                },
                replace: true,
            })

            setFormData(initialFormData)
            setStep(1)
        } catch (error) {
            console.error("Booking submission error:", error)
            setSubmitError(
                `Error al enviar la solicitud: ${
                    error.message || "Inténtalo de nuevo."
                }`,
            )
            toast.error(
                `Error al enviar la solicitud: ${
                    error.message || "Inténtalo de nuevo."
                }`,
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderStepContent = () => {
        const isLoading = isLoadingStylists || isLoadingServices
        const fetchError = fetchStylistsError || servicesError?.message

        if (isLoading && step >= 1) {
            return (
                <div className="flex justify-center items-center p-10 text-gray-600">
                    <Loader2 className="w-6 h-6 text-secondary animate-spin mr-2" />
                    <span>
                        {isLoadingServices
                            ? "Cargando servicios..."
                            : "Cargando estilistas..."}
                    </span>
                </div>
            )
        }

        if (fetchError && step >= 1) {
            return (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>
                        {fetchError || "Ocurrió un error al cargar los datos."}
                    </span>
                </div>
            )
        }

        switch (step) {
            case 1:
                return (
                    <ServiceSelectionStep
                        formData={formData}
                        onFormUpdate={handleFormUpdate}
                        onNext={nextStep}
                    />
                )
            case 2:
                return (
                    <StylistSelectionStep
                        formData={formData}
                        onFormUpdate={handleFormUpdate}
                        onNext={nextStep}
                        onPrev={prevStep}
                        stylists={stylistsList}
                    />
                )
            case 3:
                return (
                    <DateTimeSelectionStep
                        formData={formData}
                        onFormUpdate={handleFormUpdate}
                        onNext={nextStep}
                        onPrev={prevStep}
                        serviceDuration={selectedServiceDetails?.duration}
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
