import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, ChevronRight, Clock, Settings, User } from "lucide-react"
import { toast } from "react-toastify"
import useAuth from "../../features/auth/hooks/useAuth.js"
import { db } from "../../../firebaseConfig.js"
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import ProfileHeader from "../../components/profile/ProfileHeader"
import Sidebar from "../../components/profile/Sidebar"
import ProfileTab from "../../components/profile/tabs/ProfileTab"
import AppointmentsTab from "../../components/profile/tabs/AppointmentsTab"
import PreferencesTab from "../../components/profile/tabs/PreferencesTab"
import AvailabilityTab from "../../components/profile/tabs/AvailabilityTab"
import RescheduleModal from "../../components/profile/RescheduleModal"
import {
    acceptAppointmentSuggestion,
    declineAppointmentSuggestion,
    requestAppointmentReschedule,
} from "../../features/booking/services/bookingService"

function ProfileScreen() {
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState("profile")
    const [user, setUser] = useState(currentUser)

    const [appointments, setAppointments] = useState([])
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(true)
    const [fetchAppointmentsError, setFetchAppointmentsError] = useState(null)
    const [actionLoading, setActionLoading] = useState({ type: null, id: null })

    const [showRescheduleModal, setShowRescheduleModal] = useState(false)
    const [
        selectedAppointmentForReschedule,
        setSelectedAppointmentForReschedule,
    ] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(new Date())

    useEffect(() => {
        if (!currentUser) {
            navigate("/auth")
        }
    }, [currentUser, navigate])

    useEffect(() => {
        if (!currentUser?.uid) {
            setIsLoadingAppointments(false)
            setAppointments([])
            return
        }
        setIsLoadingAppointments(true)
        setFetchAppointmentsError(null)
        const q = query(
            collection(db, "appointments"),
            where("clientId", "==", currentUser.uid),
            orderBy("requestedDateTime", "desc"),
        )
        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const fetchedAppointments = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                setAppointments(fetchedAppointments)
                setIsLoadingAppointments(false)
            },
            (error) => {
                console.error("Error fetching appointments:", error)
                setFetchAppointmentsError(
                    "Error al cargar tus citas. Intenta recargar la página.",
                )
                setIsLoadingAppointments(false)
                setAppointments([])
            },
        )
        return () => unsubscribe()
    }, [currentUser?.uid])

    useEffect(() => {
        setUser(currentUser)
        if (currentUser && activeTab === "") {
            setActiveTab("profile")
        }
    }, [activeTab, currentUser])

    if (!currentUser) return null

    const handleAcceptSuggestion = async (appointmentId) => {
        if (!appointmentId) return
        setActionLoading({ type: "accept", id: appointmentId })
        try {
            await acceptAppointmentSuggestion(appointmentId)
            toast.success("¡Propuesta aceptada! Tu cita ha sido confirmada.")
        } catch (error) {
            console.error("Error accepting suggestion:", error)
            toast.error(`Error al aceptar: ${error.message}`)
        } finally {
            setActionLoading({ type: null, id: null })
        }
    }

    const handleDeclineSuggestion = async (appointmentId) => {
        if (!appointmentId) return
        setActionLoading({ type: "decline", id: appointmentId })
        try {
            await declineAppointmentSuggestion(appointmentId)
            toast.info(
                "Propuesta rechazada. La solicitud vuelve a estar pendiente para revisión del estilista.",
            )
        } catch (error) {
            console.error("Error declining suggestion:", error)
            toast.error(`Error al rechazar: ${error.message}`)
        } finally {
            setActionLoading({ type: null, id: null })
        }
    }

    const handleRescheduleClick = (appointment) => {
        setSelectedAppointmentForReschedule(appointment)
        try {
            const initialDate =
                appointment.requestedDateTime?.toDate() || new Date()
            setSelectedDate(
                initialDate instanceof Date
                    ? initialDate
                    : new Date(initialDate),
            )
            setSelectedTime(
                initialDate instanceof Date
                    ? format(initialDate, "HH:mm")
                    : null,
            )
            setCurrentMonth(
                initialDate instanceof Date ? initialDate : new Date(),
            )
        } catch (e) {
            console.warn(
                "Could not parse appointment date for reschedule modal",
                e,
            )
            const fallbackDate = new Date()
            setSelectedDate(fallbackDate)
            setSelectedTime(null)
            setCurrentMonth(fallbackDate)
        }
        setShowRescheduleModal(true)
    }

    const saveReschedule = async () => {
        if (
            !selectedAppointmentForReschedule ||
            !selectedDate ||
            !selectedTime
        ) {
            toast.warn("Por favor selecciona una nueva fecha y hora.")
            return
        }

        const appointmentId = selectedAppointmentForReschedule.id
        setActionLoading({ type: "reschedule", id: appointmentId })

        const [hours, minutes] = selectedTime.split(":").map(Number)
        const newDateTime = new Date(selectedDate)
        newDateTime.setHours(hours, minutes, 0, 0)

        if (isNaN(newDateTime)) {
            throw new Error("Fecha u hora inválida seleccionada.")
        }

        try {
            await requestAppointmentReschedule(appointmentId, newDateTime)

            toast.success(
                "Solicitud de reprogramación enviada. El estilista la revisará pronto.",
            )
            setShowRescheduleModal(false)
        } catch (error) {
            console.error("Error requesting reschedule:", error)
            toast.error(`Error al reprogramar: ${error.message}`)
        } finally {
            if (
                actionLoading.id === appointmentId &&
                actionLoading.type === "reschedule"
            ) {
                setActionLoading({ type: null, id: null })
            }
        }
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return "Fecha no especificada"
        try {
            const date = timestamp.toDate()
            return format(date, "EEEE d 'de' MMMM, yyyy 'a las' HH:mm 'hrs'", {
                locale: es,
            })
        } catch (e) {
            if (timestamp instanceof Date) {
                try {
                    return format(
                        timestamp,
                        "EEEE d 'de' MMMM, yyyy 'a las' HH:mm 'hrs'",
                        { locale: es },
                    )
                } catch (formatErr) {
                    console.warn("Error formatting JS Date:", formatErr)
                }
            }
            console.warn("Error formatting date:", e, timestamp)
            return "Fecha inválida"
        }
    }

    const getDaysInMonth = (year, month) =>
        new Date(year, month + 1, 0).getDate()
    const getFirstDayOfMonth = (year, month) =>
        new Date(year, month, 1).getDay()
    const isToday = (date) => {
        const today = new Date()
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        )
    }
    const isPastDate = (date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return date < today
    }
    const nextMonth = () =>
        setCurrentMonth(
            (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
        )
    const prevMonth = () =>
        setCurrentMonth(
            (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
        )
    const handleDateClick = (date) => setSelectedDate(date)
    const handleTimeSelect = (time) => setSelectedTime(time)

    const getMenuItems = () => {
        const baseMenuItems = [
            {
                icon: <User size={20} />,
                label: "Información personal",
                action: () => setActiveTab("profile"),
                active: activeTab === "profile",
            },
        ]

        if (user?.role === "client") {
            baseMenuItems.push({
                icon: <Calendar size={20} />,
                label: "Mis citas",
                action: () => setActiveTab("appointments"),
                active: activeTab === "appointments",
            })
            baseMenuItems.push({
                icon: <Settings size={20} />,
                label: "Preferencias",
                action: () => setActiveTab("preferences"),
                active: activeTab === "preferences",
            })
        }

        if (user?.role === "stylist") {
            baseMenuItems.push({
                icon: <Clock size={20} />,
                label: "Mi Horario",
                action: () => setActiveTab("availability"),
                active: activeTab === "availability",
            })
            baseMenuItems.push({
                icon: <ChevronRight size={20} />,
                label: "Panel de estilista",
                action: () => navigate("/stylist/dashboard"),
                active: false,
            })
        }
        return baseMenuItems
    }

    const handleUserUpdate = (updatedUser) => {
        setUser(updatedUser)
    }

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-16 bg-primaryLight">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                    {/* Mobile profile header */}
                    <ProfileHeader user={user} />

                    {/* Sidebar */}
                    <Sidebar
                        user={user}
                        menuItems={getMenuItems()}
                        onLogout={logout}
                    />

                    {/* Main content */}
                    <main className="flex-1 p-6 md:p-8 relative">
                        {/* Tab content */}
                        {activeTab === "profile" && (
                            <ProfileTab
                                user={user}
                                onUserUpdate={handleUserUpdate}
                            />
                        )}

                        {/* Client Tabs */}
                        {activeTab === "appointments" &&
                            user?.role === "client" && (
                                <AppointmentsTab
                                    allAppointments={appointments}
                                    isLoading={isLoadingAppointments}
                                    error={fetchAppointmentsError}
                                    formatDate={formatDate}
                                    onReschedule={handleRescheduleClick}
                                    onAcceptSuggestion={handleAcceptSuggestion}
                                    onDeclineSuggestion={
                                        handleDeclineSuggestion
                                    }
                                    actionLoading={actionLoading}
                                />
                            )}
                        {activeTab === "preferences" &&
                            user?.role === "client" && <PreferencesTab />}

                        {/* Stylist Tabs */}
                        {activeTab === "availability" &&
                            user?.role === "stylist" && (
                                <AvailabilityTab stylistId={user.uid} />
                            )}
                    </main>
                </div>
            </div>

            {/* Reschedule modal */}
            {showRescheduleModal && selectedAppointmentForReschedule && (
                <RescheduleModal
                    appointment={selectedAppointmentForReschedule}
                    onClose={() => setShowRescheduleModal(false)}
                    onSave={saveReschedule}
                    formatDate={formatDate}
                    currentMonth={currentMonth}
                    onPrevMonth={prevMonth}
                    onNextMonth={nextMonth}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onDateClick={handleDateClick}
                    onTimeSelect={handleTimeSelect}
                    getDaysInMonth={getDaysInMonth}
                    getFirstDayOfMonth={getFirstDayOfMonth}
                    isToday={isToday}
                    isPastDate={isPastDate}
                    isSaving={
                        actionLoading.type === "reschedule" &&
                        actionLoading.id === selectedAppointmentForReschedule.id
                    }
                />
            )}
        </div>
    )
}

export default ProfileScreen
