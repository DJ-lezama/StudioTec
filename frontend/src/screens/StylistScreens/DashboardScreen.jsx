import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import SchedulePreview from "../../components/stylist_dashboard/SchedulePreview"
import StatWidget from "../../components/stylist_dashboard/StatWidget.jsx"
import ReviewPreview from "../../components/stylist_dashboard/ReviewPreview"
import { AlertTriangle, Loader2 } from "lucide-react"
import useAuth from "../../features/auth/hooks/useAuth"
import { usePendingRequests } from "../../features/booking/hooks/usePendingRequests"
import { useAcceptedAppointments } from "../../features/booking/hooks/useAcceptedAppointments"
import ServicesContext from "../../features/services/context/ServicesContext"
import { getClientCount } from "../../features/auth/services/authService"

const DashboardScreen = () => {
    const navigate = useNavigate()
    const { currentUser } = useAuth()

    const [clientCount, setClientCount] = useState(0)
    const [clientCountLoading, setClientCountLoading] = useState(true)
    const [clientCountError, setClientCountError] = useState(null)

    const {
        pendingRequests,
        isLoading: isLoadingRequests,
        error: errorRequests,
    } = usePendingRequests()

    const {
        acceptedAppointments,
        isLoading: isLoadingAppointments,
        error: errorAppointments,
    } = useAcceptedAppointments(currentUser?.uid)

    const {
        services: allServices,
        isLoading: isLoadingServices,
        error: errorServices,
    } = useContext(ServicesContext)

    useEffect(() => {
        const fetchCount = async () => {
            setClientCountLoading(true)
            setClientCountError(null)
            try {
                const count = await getClientCount()
                setClientCount(count)
            } catch (err) {
                console.error(err)
                setClientCountError(err.message || "Error al cargar clientes")
            } finally {
                setClientCountLoading(false)
            }
        }
        fetchCount().then((r) => r)
    }, [])

    const isLoading =
        isLoadingRequests ||
        isLoadingAppointments ||
        isLoadingServices ||
        clientCountLoading

    const combinedError =
        errorRequests?.message ||
        errorAppointments?.message ||
        errorServices?.message ||
        clientCountError

    const pendingRequestCount = pendingRequests?.length ?? 0
    const activeServicesCount =
        allServices?.filter((s) => s.isActive === true).length ?? 0

    const futureAppointments = acceptedAppointments
        .filter((appt) => {
            try {
                const todayStart = new Date()
                todayStart.setHours(0, 0, 0, 0)
                return appt.requestedDateTime?.toDate() >= todayStart
            } catch (e) {
                console.warn("Error filtering appointment date:", e, appt)
                return false // Exclude if date is invalid
            }
        })
        .sort(
            (a, b) =>
                a.requestedDateTime.toDate() - b.requestedDateTime.toDate(),
        )

    // TODO: Mock data for reviews (Final improvements)
    const reviews = [
        { id: 1, name: "María T.", review: "Excelente servicio..." },
        { id: 2, name: "Grecia G.", review: "¡Súper! Me hicieron..." },
        { id: 3, name: "Fernanda L.", review: "Quedé encantada..." },
        { id: 4, name: "Valentina M.", review: "El ambiente es súper..." },
    ]

    if (isLoading) {
        return (
            <div className="p-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
                <Loader2 className="w-10 h-10 text-secondary animate-spin" />
            </div>
        )
    }

    if (combinedError) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span>
                        Error al cargar datos del panel: {combinedError}
                    </span>
                </div>
            </div>
        )
    }

    const stats = [
        {
            title: "Solicitudes",
            value: pendingRequestCount,
            subtitle: "pendientes por revisar",
            buttonText: "Ver solicitudes",
            route: "/stylist/solicitudes",
        },
        {
            title: "Clientes",
            value: clientCount,
            subtitle: "registrados",
            buttonText: "Ver clientes",
            route: "/stylist/clientes",
        },
        {
            title: "Servicios",
            value: activeServicesCount,
            subtitle: "activos en catálogo",
            buttonText: "Gestionar servicios",
            route: "/stylist/servicios",
        },
    ]

    return (
        <div className="pt-6 p-8 space-y-8">
            <h1 className="text-h3 font-heading font-bold">Panel de control</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT: SchedulePreview */}
                <div className="lg:col-span-1">
                    <SchedulePreview
                        appointments={futureAppointments.slice(0, 6)}
                        onClick={() => navigate("/stylist/schedule")}
                    />
                </div>

                {/* RIGHT: Widgets */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                        <StatWidget
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            subtitle={stat.subtitle}
                            buttonText={stat.buttonText}
                            onClick={() => navigate(stat.route)}
                        />
                    ))}

                    {/* Fourth widget slot: reviews (still mock) */}
                    <ReviewPreview
                        reviews={reviews}
                        onClick={() => navigate("/stylist/reviews")}
                    />
                </div>
            </div>
        </div>
    )
}

export default DashboardScreen
