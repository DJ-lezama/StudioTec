import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/common/Button"
import {
    Calendar,
    Check,
    ChevronLeft,
    ChevronRight,
    Edit3,
    LogOut,
    Settings,
    User,
    X,
} from "lucide-react"
import useAuth from "../../features/auth/hooks/useAuth.js"

function ProfileScreen() {
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()

    const [isEditing, setIsEditing] = useState(false)
    const [activeTab, setActiveTab] = useState("profile")
    const [form, setForm] = useState({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        phone: currentUser?.phone || "",
        address: currentUser?.address || "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showRescheduleModal, setShowRescheduleModal] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(new Date())

    // Simula citas para cliente, en un entorno real vendrían de una API
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

    // Para la simulación, filtramos las citas completadas y próximas
    const upcomingAppointments = appointments.filter(
        (apt) => apt.status === "upcoming",
    )
    const pastAppointments = appointments.filter(
        (apt) => apt.status === "completed",
    )

    // Redireccionar si no hay usuario
    useEffect(() => {
        if (!currentUser) {
            navigate("/auth")
        }
    }, [currentUser, navigate])

    if (!currentUser) return null

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        setIsLoading(true)

        // Simular una llamada a la API
        setTimeout(() => {
            const updatedUser = {
                ...currentUser,
                name: form.name,
                phone: form.phone,
                address: form.address,
            }

            localStorage.setItem("studioTecUser", JSON.stringify(updatedUser))
            setIsLoading(false)
            setIsEditing(false)
            setShowSuccess(true)

            // Ocultar el mensaje de éxito después de 3 segundos
            setTimeout(() => {
                setShowSuccess(false)
            }, 3000)
        }, 800)
    }

    const handleLogout = () => {
        logout()
    }

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString("es-MX", options)
    }

    // Funciones para el calendario
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

    // Función para renderizar los menús según el rol
    const renderMenuItems = () => {
        const baseMenuItems = [
            {
                icon: <User size={20} />,
                label: "Información personal",
                action: () => {
                    setIsEditing(false)
                    setActiveTab("profile")
                },
                active: activeTab === "profile",
            },
        ]

        // Agregar opciones específicas para clientes
        if (currentUser.role === "client") {
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

        // Agregar opción para estilistas
        if (currentUser.role === "stylist") {
            baseMenuItems.push({
                icon: <ChevronRight size={20} />,
                label: "Panel de estilista",
                action: () => navigate("/stylist/dashboard"),
                active: false,
            })
        }

        return baseMenuItems
    }

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-16 bg-primaryLight">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                    {/* Cabecera del perfil (visible en móvil) */}
                    <div className="md:hidden bg-primary/10 p-6 flex items-center space-x-4 border-b border-gray-100">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-white text-xl font-bold">
                            {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-textMain">
                                {currentUser.name}
                            </h2>
                            <p className="text-sm text-textMain/70">
                                {currentUser.email}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="md:w-80 bg-secondary text-white p-6 md:p-8">
                        {/* Info de perfil (visible en desktop) */}
                        <div className="hidden md:flex md:flex-col md:items-center text-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-primary shadow-lg flex items-center justify-center text-textMain text-3xl font-bold mb-4">
                                {currentUser.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-semibold">
                                {currentUser.name}
                            </h2>
                            <p className="text-white/80 text-sm mt-1">
                                {currentUser.email}
                            </p>
                            <div className="mt-2 px-4 py-1 bg-white/20 rounded-full text-xs font-medium capitalize">
                                {currentUser.role === "stylist"
                                    ? "Estilista"
                                    : "Cliente"}
                            </div>
                        </div>

                        {/* Menú de navegación */}
                        <nav className="mt-6 space-y-1">
                            {renderMenuItems().map((item, index) => (
                                <button
                                    key={index}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                        item.active
                                            ? "bg-white/20 text-white"
                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                                    onClick={item.action}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ))}

                            {/* Botón de cerrar sesión */}
                            <button
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:bg-textMain hover:text-white transition-colors mt-6"
                                onClick={handleLogout}
                            >
                                <LogOut size={20} />
                                <span>Cerrar sesión</span>
                            </button>
                        </nav>
                    </aside>

                    {/* Contenido principal */}
                    <main className="flex-1 p-6 md:p-8">
                        {activeTab === "profile" && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-h4 font-heading font-semibold text-textMain">
                                        {isEditing
                                            ? "Editar perfil"
                                            : "Información personal"}
                                    </h3>
                                    {!isEditing && (
                                        <Button
                                            type="transparent"
                                            className="flex items-center gap-2"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <Edit3 size={16} />
                                            Editar
                                        </Button>
                                    )}
                                </div>

                                {showSuccess && (
                                    <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-lg flex items-center">
                                        <Check size={20} className="mr-2" />
                                        Información actualizada correctamente
                                    </div>
                                )}

                                {isEditing ? (
                                    <form
                                        className="space-y-5"
                                        onSubmit={(e) => {
                                            e.preventDefault()
                                            handleSave()
                                        }}
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-textMain mb-2">
                                                Nombre completo
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-textMain mb-2">
                                                Correo electrónico
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                disabled
                                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                El correo electrónico no se
                                                puede modificar
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-textMain mb-2">
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                placeholder="Ej. 222 123 4567"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-textMain mb-2">
                                                Dirección
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={form.address}
                                                onChange={handleChange}
                                                placeholder="Tu dirección (opcional)"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                            />
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                type="dark"
                                                onClick={handleSave}
                                                className="flex items-center"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <svg
                                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            ></circle>
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            ></path>
                                                        </svg>
                                                        Guardando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check
                                                            size={16}
                                                            className="mr-2"
                                                        />
                                                        Guardar cambios
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                type="transparent"
                                                onClick={() =>
                                                    setIsEditing(false)
                                                }
                                                className="flex items-center"
                                            >
                                                <X size={16} className="mr-2" />
                                                Cancelar
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="grid grid-cols-1 divide-y divide-gray-100">
                                            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="sm:col-span-1">
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Nombre completo
                                                    </h4>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <p className="text-body-m text-textMain">
                                                        {currentUser.name}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="sm:col-span-1">
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Correo electrónico
                                                    </h4>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <p className="text-body-m text-textMain">
                                                        {currentUser.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="sm:col-span-1">
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Teléfono
                                                    </h4>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <p className="text-body-m text-textMain">
                                                        {currentUser.phone ||
                                                            "No especificado"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="sm:col-span-1">
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Dirección
                                                    </h4>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <p className="text-body-m text-textMain">
                                                        {currentUser.address ||
                                                            "No especificada"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="sm:col-span-1">
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Rol
                                                    </h4>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-secondary capitalize">
                                                        {currentUser.role ===
                                                        "stylist"
                                                            ? "Estilista"
                                                            : "Cliente"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "appointments" &&
                            currentUser.role === "client" && (
                                <div>
                                    <h3 className="text-h4 font-heading font-semibold text-textMain mb-6">
                                        Mis citas
                                    </h3>

                                    {upcomingAppointments.length > 0 ? (
                                        <div className="mb-8">
                                            <h4 className="text-subtitle-m font-medium text-textMain mb-4">
                                                Próximas citas
                                            </h4>
                                            <div className="grid gap-4">
                                                {upcomingAppointments.map(
                                                    (appointment) => (
                                                        <div
                                                            key={appointment.id}
                                                            className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between"
                                                        >
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-textMain">
                                                                    {
                                                                        appointment.service
                                                                    }
                                                                </p>
                                                                <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-textMain/70">
                                                                    <span>
                                                                        {formatDate(
                                                                            appointment.date,
                                                                        )}{" "}
                                                                        -{" "}
                                                                        {
                                                                            appointment.time
                                                                        }
                                                                    </span>
                                                                    <span>
                                                                        •{" "}
                                                                        {
                                                                            appointment.stylist
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="mt-4 sm:mt-0 flex space-x-2">
                                                                <Button
                                                                    type="transparent"
                                                                    className="text-sm"
                                                                >
                                                                    Ver detalles
                                                                </Button>
                                                                <Button
                                                                    type="dark"
                                                                    className="text-sm"
                                                                    onClick={() =>
                                                                        handleReschedule(
                                                                            appointment,
                                                                        )
                                                                    }
                                                                >
                                                                    Reprogramar
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-primary/5 rounded-lg p-6 text-center mb-8">
                                            <p className="text-gray-600 mb-4">
                                                No tienes citas próximas
                                                programadas
                                            </p>
                                            <Button
                                                type="dark"
                                                onClick={() =>
                                                    navigate("/agendar")
                                                }
                                                className="flex items-center mx-auto"
                                            >
                                                <Calendar
                                                    size={16}
                                                    className="mr-2"
                                                />
                                                Agendar una cita
                                            </Button>
                                        </div>
                                    )}

                                    {pastAppointments.length > 0 && (
                                        <div>
                                            <h4 className="text-subtitle-m font-medium text-textMain mb-4">
                                                Historial de citas
                                            </h4>
                                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Servicio
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Fecha
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Estilista
                                                            </th>
                                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Acciones
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {pastAppointments.map(
                                                            (appointment) => (
                                                                <tr
                                                                    key={
                                                                        appointment.id
                                                                    }
                                                                >
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="text-sm font-medium text-textMain">
                                                                            {
                                                                                appointment.service
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="text-sm text-gray-600">
                                                                            {formatDate(
                                                                                appointment.date,
                                                                            )}{" "}
                                                                            -{" "}
                                                                            {
                                                                                appointment.time
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="text-sm text-gray-600">
                                                                            {
                                                                                appointment.stylist
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                        <Button
                                                                            type="transparent"
                                                                            className="text-xs"
                                                                        >
                                                                            Reservar
                                                                            similar
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        {activeTab === "preferences" &&
                            currentUser.role === "client" && (
                                <div>
                                    <h3 className="text-h4 font-heading font-semibold text-textMain mb-6">
                                        Preferencias
                                    </h3>

                                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                                        <div className="p-6 border-b border-gray-100">
                                            <h4 className="text-subtitle-m font-medium text-textMain mb-2">
                                                Notificaciones
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Configura cómo quieres recibir
                                                notificaciones sobre tus citas y
                                                promociones.
                                            </p>
                                        </div>

                                        <div className="p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h5 className="text-sm font-medium text-textMain">
                                                        Recordatorios de cita
                                                    </h5>
                                                    <p className="text-xs text-gray-500">
                                                        Recibe un recordatorio
                                                        24 horas antes de tu
                                                        cita
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        defaultChecked
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h5 className="text-sm font-medium text-textMain">
                                                        Promociones y ofertas
                                                    </h5>
                                                    <p className="text-xs text-gray-500">
                                                        Recibe notificaciones
                                                        sobre promociones
                                                        especiales
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="p-6 border-b border-gray-100">
                                            <h4 className="text-subtitle-m font-medium text-textMain mb-2">
                                                Preferencias de servicio
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Personaliza tus preferencias
                                                para mejorar tu experiencia en
                                                cada visita.
                                            </p>
                                        </div>

                                        <div className="p-6">
                                            <label className="block text-sm font-medium text-textMain mb-2">
                                                Estilista preferido
                                            </label>
                                            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                                                <option value="">
                                                    Cualquiera disponible
                                                </option>
                                                <option value="stylist-a">
                                                    Estilista A
                                                </option>
                                                <option value="stylist-b">
                                                    Estilista B
                                                </option>
                                                <option value="stylist-c">
                                                    Estilista C
                                                </option>
                                            </select>

                                            <div className="mt-6">
                                                <Button type="dark">
                                                    Guardar preferencias
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </main>
                </div>
            </div>

            {/* Modal de reprogramación de cita */}
            {showRescheduleModal && selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 relative max-h-[90vh] overflow-y-auto">
                        {/* Cabecera del modal */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-h5 font-heading font-semibold text-textMain">
                                Reprogramar cita
                            </h3>
                            <button
                                onClick={() => setShowRescheduleModal(false)}
                                className="text-gray-500 hover:text-textMain"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Detalles de la cita actual */}
                        <div className="mb-6 bg-primary/10 p-4 rounded-lg">
                            <p className="font-medium text-textMain">
                                {selectedAppointment.service}
                            </p>
                            <p className="text-sm text-textMain/70">
                                <span>
                                    Cita actual:{" "}
                                    {formatDate(selectedAppointment.date)} -{" "}
                                    {selectedAppointment.time}
                                </span>
                            </p>
                            <p className="text-sm text-textMain/70">
                                Estilista: {selectedAppointment.stylist}
                            </p>
                        </div>

                        {/* Selector de nueva fecha */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-subtitle-s font-medium text-textMain">
                                    Selecciona nueva fecha
                                </h4>
                            </div>

                            {/* Navegación entre meses */}
                            <div className="flex justify-between items-center mb-4">
                                <button
                                    onClick={prevMonth}
                                    className="p-1 rounded-full hover:bg-gray-100"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <span className="text-textMain font-medium">
                                    {currentMonth.toLocaleDateString("es-MX", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>

                                <button
                                    onClick={nextMonth}
                                    className="p-1 rounded-full hover:bg-gray-100"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            {/* Días de la semana */}
                            <div className="grid grid-cols-7 mb-2 text-center">
                                {["D", "L", "M", "M", "J", "V", "S"].map(
                                    (day, i) => (
                                        <div
                                            key={i}
                                            className="text-xs font-medium text-gray-500"
                                        >
                                            {day}
                                        </div>
                                    ),
                                )}
                            </div>

                            {/* Calendario */}
                            <div className="grid grid-cols-7 gap-1">
                                {(() => {
                                    const year = currentMonth.getFullYear()
                                    const month = currentMonth.getMonth()
                                    const daysInMonth = getDaysInMonth(
                                        year,
                                        month,
                                    )
                                    const firstDay = getFirstDayOfMonth(
                                        year,
                                        month,
                                    )

                                    // Array para todos los días (incluyendo espacios en blanco al inicio)
                                    const days = []

                                    // Espacios en blanco para los días anteriores al primer día del mes
                                    for (let i = 0; i < firstDay; i++) {
                                        days.push(
                                            <div
                                                key={`empty-${i}`}
                                                className="h-9"
                                            ></div>,
                                        )
                                    }

                                    // Días del mes actual
                                    for (
                                        let day = 1;
                                        day <= daysInMonth;
                                        day++
                                    ) {
                                        const date = new Date(year, month, day)
                                        const isSelectedDate =
                                            selectedDate &&
                                            date.getDate() ===
                                                selectedDate.getDate() &&
                                            date.getMonth() ===
                                                selectedDate.getMonth() &&
                                            date.getFullYear() ===
                                                selectedDate.getFullYear()

                                        const isCurrentDay = isToday(date)
                                        const isPast = isPastDate(date)

                                        days.push(
                                            <button
                                                key={day}
                                                onClick={() =>
                                                    !isPast &&
                                                    handleDateClick(date)
                                                }
                                                disabled={isPast}
                                                className={`h-9 rounded-full flex items-center justify-center text-sm transition-colors ${
                                                    isSelectedDate
                                                        ? "bg-secondary text-white"
                                                        : isCurrentDay
                                                          ? "bg-primary text-textMain"
                                                          : isPast
                                                            ? "text-gray-300 cursor-not-allowed"
                                                            : "hover:bg-gray-100 text-textMain"
                                                }`}
                                            >
                                                {day}
                                            </button>,
                                        )
                                    }

                                    return days
                                })()}
                            </div>
                        </div>

                        {/* Selector de hora */}
                        {selectedDate && (
                            <div className="mb-6">
                                <h4 className="text-subtitle-s font-medium text-textMain mb-3">
                                    Horarios disponibles para{" "}
                                    {selectedDate.toLocaleDateString("es-MX", {
                                        day: "numeric",
                                        month: "long",
                                    })}
                                </h4>

                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        "09:00",
                                        "10:00",
                                        "11:00",
                                        "12:00",
                                        "13:00",
                                        "14:00",
                                        "16:00",
                                        "17:00",
                                        "18:00",
                                    ].map((time) => (
                                        <button
                                            key={time}
                                            onClick={() =>
                                                handleTimeSelect(time)
                                            }
                                            className={`p-2 rounded border text-sm ${
                                                selectedTime === time
                                                    ? "bg-secondary text-white border-secondary"
                                                    : "border-gray-300 hover:border-primary hover:bg-primary/10"
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Botones de acción */}
                        <div className="flex justify-end gap-3 mt-4">
                            <Button
                                type="transparent"
                                onClick={() => setShowRescheduleModal(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="dark"
                                onClick={saveReschedule}
                                disabled={!selectedDate || !selectedTime}
                                className="flex items-center"
                            >
                                <Calendar size={16} className="mr-2" />
                                Confirmar cambio
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileScreen
