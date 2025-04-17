import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, ChevronRight, Settings, User } from "lucide-react"
import useAuth from "../../features/auth/hooks/useAuth.js"

import ProfileHeader from "../../components/profile/ProfileHeader"
import Sidebar from "../../components/profile/Sidebar"
import ProfileTab from "../../components/profile/tabs/ProfileTab"
import AppointmentsTab from "../../components/profile/tabs/AppointmentsTab"
import PreferencesTab from "../../components/profile/tabs/PreferencesTab"
import RescheduleModal from "../../components/profile/RescheduleModal"

function ProfileScreen() {
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState("profile")
    const [showSuccess, setShowSuccess] = useState(false)
    const [showRescheduleModal, setShowRescheduleModal] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [user, setUser] = useState(currentUser)

    // TODO: Fetch user data from the server
    // Sample appointments data
    const [appointments, setAppointments] = useState([
        {
            id: "apt1",
            service: "Corte de cabello",
            date: "2025-04-28",
            time: "14:30",
            stylist: "Estilista A",
            status: "upcoming",
        },
        {
            id: "apt2",
            service: "Manicure",
            date: "2025-03-15",
            time: "10:00",
            stylist: "Estilista B",
            status: "completed",
        },
    ])

    // Filtered appointments
    const upcomingAppointments = appointments.filter(
        (apt) => apt.status === "upcoming",
    )
    const pastAppointments = appointments.filter(
        (apt) => apt.status === "completed",
    )

    // Redirect if no user
    useEffect(() => {
        if (!currentUser) {
            navigate("/auth")
        }
    }, [currentUser, navigate])

    if (!currentUser) return null

    // Calendar utility functions
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay()
    }

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

    const nextMonth = () => {
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1,
            ),
        )
    }

    const prevMonth = () => {
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1,
            ),
        )
    }

    const handleDateClick = (date) => {
        setSelectedDate(date)
    }

    const handleTimeSelect = (time) => {
        setSelectedTime(time)
    }

    const handleReschedule = (appointment) => {
        setSelectedAppointment(appointment)
        setSelectedDate(new Date(appointment.date))
        setSelectedTime(appointment.time)
        setShowRescheduleModal(true)
    }

    const saveReschedule = () => {
        if (!selectedAppointment || !selectedDate || !selectedTime) return

        const updated = appointments.map((apt) =>
            apt.id === selectedAppointment.id
                ? {
                      ...apt,
                      date: selectedDate.toISOString().split("T")[0],
                      time: selectedTime,
                  }
                : apt,
        )

        setAppointments(updated)
        setShowRescheduleModal(false)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
    }

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString("es-MX", options)
    }

    const getMenuItems = () => {
        const baseMenuItems = [
            {
                icon: <User size={20} />,
                label: "Información personal",
                action: () => {
                    setActiveTab("profile")
                },
                active: activeTab === "profile",
            },
        ]

        if (user.role === "client") {
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

        if (user.role === "stylist") {
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
                        activeTab={activeTab}
                        menuItems={getMenuItems()}
                        onLogout={logout}
                    />

                    {/* Main content */}
                    <main className="flex-1 p-6 md:p-8">
                        {/* Success notification */}
                        {showSuccess && (
                            <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-lg flex items-center">
                                <Check size={20} className="mr-2" />
                                Información actualizada correctamente
                            </div>
                        )}

                        {/* Tab content */}
                        {activeTab === "profile" && (
                            <ProfileTab
                                user={user}
                                onUserUpdate={handleUserUpdate}
                            />
                        )}

                        {activeTab === "appointments" &&
                            user.role === "client" && (
                                <AppointmentsTab
                                    upcomingAppointments={upcomingAppointments}
                                    pastAppointments={pastAppointments}
                                    formatDate={formatDate}
                                    onReschedule={handleReschedule}
                                />
                            )}

                        {activeTab === "preferences" &&
                            user.role === "client" && <PreferencesTab />}
                    </main>
                </div>
            </div>

            {/* Reschedule modal */}
            {showRescheduleModal && selectedAppointment && (
                <RescheduleModal
                    appointment={selectedAppointment}
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
                />
            )}
        </div>
    )
}

export default ProfileScreen
