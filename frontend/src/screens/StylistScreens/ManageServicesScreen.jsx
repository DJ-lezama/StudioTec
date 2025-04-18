import React, { useEffect, useMemo, useState } from "react"
import Button from "../../components/common/Button"
import { useNavigate } from "react-router-dom"
import ServiceCreationOverlay from "../../components/services/ServiceCreationOverlay.jsx"
import {
    AlertTriangle,
    Check,
    Eye,
    Filter,
    Hand,
    Loader2,
    PlusCircle,
    Scissors,
    Search,
    Tag,
    X,
} from "lucide-react"
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore"
import { db } from "../../../firebaseConfig.js"
import { useServices } from "../../features/services/hooks/useServices.js"

const categoryIcons = {
    Hair: <Scissors className="w-5 h-5" />,
    Nails: <Hand className="w-5 h-5" />,
    Face: <Eye className="w-5 h-5" />,
}

const ManageServicesScreen = () => {
    const {
        services: allServices,
        isLoading: loading,
        error: fetchError,
    } = useServices()

    const [displayError, setDisplayError] = useState(null)
    const [formError, setFormError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("Todos")
    const [showActiveOnly, setShowActiveOnly] = useState(false)
    const [sortBy, setSortBy] = useState("name")
    const [sortDirection, setSortDirection] = useState("asc")
    const [showAddOverlay, setShowAddOverlay] = useState(false)
    const [serviceToEdit, setServiceToEdit] = useState(null)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        setDisplayError(fetchError ? fetchError.message : null)
    }, [fetchError])

    const categories = useMemo(() => {
        return [
            "Todos",
            ...new Set(
                allServices.map((service) => service.category).filter(Boolean),
            ),
        ]
    }, [allServices])

    const sortedServices = useMemo(() => {
        const filtered = allServices.filter((service) => {
            const nameMatch =
                service.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ?? false
            const descriptionMatch =
                service.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ?? false
            const matchesSearch = nameMatch || descriptionMatch
            const matchesCategory =
                selectedCategory === "Todos" ||
                service.category === selectedCategory
            const matchesActiveState =
                !showActiveOnly || service.isActive === true
            return matchesSearch && matchesCategory && matchesActiveState
        })

        return [...filtered].sort((a, b) => {
            let valueA, valueB
            const defaultString = ""
            const defaultNumber = 0
            switch (sortBy) {
                case "price":
                    valueA = a.basePrice ?? defaultNumber
                    valueB = b.basePrice ?? defaultNumber
                    break
                case "duration":
                    valueA = a.duration ?? defaultNumber
                    valueB = b.duration ?? defaultNumber
                    break
                case "category":
                    valueA = a.category ?? defaultString
                    valueB = b.category ?? defaultString
                    break
                default:
                    valueA = a.name?.toLowerCase() ?? defaultString
                    valueB = b.name?.toLowerCase() ?? defaultString
            }
            if (sortDirection === "asc") {
                return valueA > valueB ? 1 : valueA < valueB ? -1 : 0
            } else {
                return valueA < valueB ? 1 : valueA > valueB ? -1 : 0
            }
        })
    }, [
        allServices,
        searchTerm,
        selectedCategory,
        showActiveOnly,
        sortBy,
        sortDirection,
    ])

    const showMessage = (message, isSuccess = true) => {
        if (isSuccess) {
            setSuccessMessage(message)
            setShowSuccessMessage(true)
            setDisplayError(null)
            setFormError(null)
            setTimeout(() => setShowSuccessMessage(false), 3000)
        } else {
            if (showAddOverlay) {
                setFormError(message)
                setDisplayError(null)
            } else {
                setDisplayError(message)
                setFormError(null)
            }
            setShowSuccessMessage(false)
        }
    }

    const handleToggleStatus = async (id) => {
        if (isSubmitting) return
        const serviceToToggle = allServices.find((s) => s.serviceID === id)
        if (!serviceToToggle) return

        setIsSubmitting(true)

        const newStatus = !serviceToToggle.isActive

        try {
            const serviceDocRef = doc(db, "services", id)
            await updateDoc(serviceDocRef, {
                isActive: newStatus,
                updatedAt: serverTimestamp(),
            })
            showMessage("Estado del servicio actualizado.")
            // TODO: Implement a better way to refresh data without full page reload or remount.
            await fetchServices()
        } catch (err) {
            console.error("Error toggling service status:", err)
            showMessage("Error al actualizar el estado.", false)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteService = async (id) => {
        if (isSubmitting) return
        if (
            !window.confirm(
                "¿Estás seguro de que deseas eliminar este servicio de forma permanente?",
            )
        ) {
            return
        }

        setIsSubmitting(true)
        try {
            const serviceDocRef = doc(db, "services", id)
            await deleteDoc(serviceDocRef)
            showMessage("Servicio eliminado correctamente.")
            // TODO: Refresh logic needed here too.
            await fetchServices() // Temporary
        } catch (err) {
            console.error("Error deleting service:", err)
            showMessage("Error al eliminar el servicio.", false)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAddOrUpdateService = async (serviceData) => {
        setIsSubmitting(true)
        setFormError(null)

        const dataPayload = {
            ...serviceData,
            updatedAt: serverTimestamp(),
        }

        if (serviceToEdit) {
            try {
                const serviceDocRef = doc(
                    db,
                    "services",
                    serviceToEdit.serviceID,
                )
                await updateDoc(serviceDocRef, dataPayload)
                showMessage("Servicio actualizado correctamente.")
                handleCloseForm()
                // TODO: Refresh logic
                await fetchServices() // Temporary
            } catch (err) {
                console.error("Error updating service:", err)
                showMessage(`Error al actualizar: ${err.message}`, false)
            } finally {
                setIsSubmitting(false)
            }
        } else {
            try {
                const servicesCollectionRef = collection(db, "services")
                await addDoc(servicesCollectionRef, {
                    ...dataPayload,
                    isActive: true,
                    createdAt: serverTimestamp(),
                })
                showMessage("Nuevo servicio añadido correctamente.")
                handleCloseForm()
                // TODO: Refresh logic
                await fetchServices() // Temporary
            } catch (err) {
                console.error("Error adding service:", err)
                showMessage(`Error al añadir: ${err.message}`, false)
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    const handleEditService = (service) => {
        setServiceToEdit(service)
        setFormError(null)
        setShowAddOverlay(true)
    }

    const handleOpenAddForm = () => {
        setServiceToEdit(null)
        setFormError(null)
        setShowAddOverlay(true)
    }

    const handleCloseForm = () => {
        setShowAddOverlay(false)
        setServiceToEdit(null)
        setFormError(null)
    }

    const fetchServices = async () => {
        setLoading(true)
        setDisplayError(null)
        // setAllServices([]); // This would now come from the hook, cannot set directly
        try {
            // This duplicates the logic in the hook - ideally call a refresh function from the hook
            const servicesCollectionRef = collection(db, "services")
            const q = query(servicesCollectionRef, orderBy("createdAt", "desc"))
            const querySnapshot = await getDocs(q)
            const servicesData = querySnapshot.docs.map((doc) => ({
                serviceID: doc.id,
                ...doc.data(),
                basePrice:
                    typeof doc.data().basePrice === "number"
                        ? doc.data().basePrice
                        : parseFloat(doc.data().basePrice) || 0,
                duration:
                    typeof doc.data().duration === "number"
                        ? doc.data().duration
                        : parseInt(doc.data().duration, 10) || 0,
            }))
            console.warn(
                "Temporary fetchServices called in component. Ideally, use a hook refresh function.",
            )
        } catch (err) {
            console.error("Error fetching services:", err)
            setDisplayError(
                "No se pudieron cargar los servicios. Intenta recargar la página.",
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 min-h-screen bg-primaryLight">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-h3 font-heading font-bold text-textMain">
                    Gestión de Servicios
                </h1>
                <Button
                    type="dark"
                    onClick={() => navigate("/stylist/dashboard")}
                >
                    Volver al panel
                </Button>
            </div>

            {/* Global Error Display Area */}
            {displayError && !showAddOverlay && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        <span>{displayError}</span>
                    </div>
                    <button
                        onClick={() => setDisplayError(null)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Success Message */}
            {showSuccessMessage && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                        <Check className="w-5 h-5 mr-2" />
                        <span>{successMessage}</span>
                    </div>
                    <button
                        onClick={() => setShowSuccessMessage(false)}
                        className="text-green-500 hover:text-green-700"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Controls and filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                {/* Search and Add Button Row */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar servicios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                            disabled={loading}
                        />
                    </div>
                    <Button
                        type="dark"
                        onClick={handleOpenAddForm}
                        className="flex items-center gap-2"
                        disabled={loading || isSubmitting}
                    >
                        <PlusCircle className="w-5 h-5" />
                        Nuevo servicio
                    </Button>
                </div>
                {/* Filters and Sorting Row */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors ${
                                    selectedCategory === category
                                        ? "bg-secondary text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                                disabled={loading}
                            >
                                {category !== "Todos" &&
                                    categoryIcons[category]}{" "}
                                {category}{" "}
                            </button>
                        ))}
                    </div>
                    {/* Active Filter & Sorting */}
                    <div className="flex items-center flex-wrap gap-4">
                        <label
                            className={`flex items-center gap-2 text-sm ${
                                loading
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-gray-700 cursor-pointer"
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={showActiveOnly}
                                onChange={() =>
                                    setShowActiveOnly(!showActiveOnly)
                                }
                                className={`rounded text-secondary focus:ring-secondary ${
                                    loading
                                        ? "cursor-not-allowed"
                                        : "cursor-pointer"
                                }`}
                                disabled={loading}
                            />
                            Solo activos
                        </label>
                        <div className="relative">
                            <select
                                value={`${sortBy}-${sortDirection}`}
                                onChange={(e) => {
                                    const [newSortBy, newSortDirection] =
                                        e.target.value.split("-")
                                    setSortBy(newSortBy)
                                    setSortDirection(newSortDirection)
                                }}
                                className="pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-lg appearance-none focus:ring-1 focus:ring-primary focus:border-primary bg-white disabled:bg-gray-100 disabled:text-gray-400"
                                disabled={loading}
                            >
                                <option value="name-asc">Nombre (A-Z)</option>
                                <option value="name-desc">Nombre (Z-A)</option>
                                <option value="price-asc">
                                    Precio (menor)
                                </option>
                                <option value="price-desc">
                                    Precio (mayor)
                                </option>
                                <option value="duration-asc">
                                    Duración (menor)
                                </option>
                                <option value="duration-desc">
                                    Duración (mayor)
                                </option>
                                <option value="category-asc">
                                    Categoría (A-Z)
                                </option>
                                <option value="category-desc">
                                    Categoría (Z-A)
                                </option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <Filter className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center p-10">
                    <Loader2 className="w-8 h-8 text-secondary animate-spin" />{" "}
                    <span className="ml-3 text-gray-600">
                        Cargando servicios...
                    </span>
                </div>
            )}

            {/* Service List or Empty State */}
            {!loading &&
                (sortedServices.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 divide-y divide-gray-200">
                            {/* Table Header */}
                            <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="md:col-span-5">Servicio</div>
                                <div className="md:col-span-2">Categoría</div>
                                <div className="md:col-span-1">Precio</div>
                                <div className="md:col-span-1">Duración</div>
                                <div className="md:col-span-1 text-center">
                                    Estado
                                </div>
                                <div className="md:col-span-2 text-right">
                                    Acciones
                                </div>
                            </div>
                            {/* Service Rows */}
                            {sortedServices.map((service) => (
                                <div
                                    key={service.serviceID}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-y-3 gap-x-4 p-4 items-center hover:bg-gray-50 transition-colors duration-150"
                                >
                                    {/* Service Name & Image */}
                                    <div className="md:col-span-5 flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-50">
                                            <img
                                                src={
                                                    service.imageUrl ||
                                                    "https://i0.wp.com/port2flavors.com/wp-content/uploads/2022/07/placeholder-614.png?fit=1200%2C800&ssl=1"
                                                }
                                                alt={service.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src =
                                                        "https://i0.wp.com/port2flavors.com/wp-content/uploads/2022/07/placeholder-614.png?fit=1200%2C800&ssl=1"
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-textMain">
                                                {service.name}
                                            </h3>{" "}
                                            <p className="text-xs text-gray-500 line-clamp-2 md:line-clamp-none">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Category */}
                                    <div className="md:col-span-2 flex items-center gap-1.5 text-sm">
                                        {categoryIcons[service.category] ? (
                                            <div className="bg-primary/20 text-secondary p-1.5 rounded-full">
                                                {
                                                    categoryIcons[
                                                        service.category
                                                    ]
                                                }
                                            </div>
                                        ) : (
                                            <Tag className="w-4 h-4 text-gray-400" />
                                        )}
                                        <span>{service.category}</span>
                                    </div>
                                    {/* Price */}
                                    <div className="md:col-span-1 text-sm">
                                        $
                                        {service.basePrice?.toFixed(2) ?? "N/A"}
                                    </div>
                                    {/* Duration */}
                                    <div className="md:col-span-1 text-sm">
                                        {service.duration ?? "N/A"} min
                                    </div>
                                    {/* Status Toggle */}
                                    <div className="md:col-span-1 flex justify-start md:justify-center">
                                        <span className="md:hidden text-xs font-medium text-gray-500 mr-2">
                                            Estado:
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleToggleStatus(
                                                    service.serviceID,
                                                )
                                            }
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 ${
                                                service.isActive
                                                    ? "bg-secondary"
                                                    : "bg-gray-200"
                                            }`}
                                            aria-label={
                                                service.isActive
                                                    ? "Desactivar servicio"
                                                    : "Activar servicio"
                                            }
                                            disabled={isSubmitting}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    service.isActive
                                                        ? "translate-x-6"
                                                        : "translate-x-1"
                                                }`}
                                            />
                                        </button>
                                    </div>
                                    {/* Actions */}
                                    <div className="md:col-span-2 flex justify-end gap-2 mt-2 md:mt-0">
                                        <Button
                                            type="transparent"
                                            className="text-xs px-2 py-1"
                                            onClick={() =>
                                                handleEditService(service)
                                            }
                                            disabled={isSubmitting}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            type="light"
                                            className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                            onClick={() =>
                                                handleDeleteService(
                                                    service.serviceID,
                                                )
                                            }
                                            disabled={isSubmitting}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Empty State
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-secondary" />
                        </div>
                        <h3 className="text-lg font-medium text-textMain mb-2">
                            No se encontraron servicios
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Ajusta los filtros o añade un nuevo servicio.
                        </p>
                        <Button
                            type="dark"
                            onClick={() => {
                                setSearchTerm("")
                                setSelectedCategory("Todos")
                                setShowActiveOnly(false)
                            }}
                            disabled={loading || isSubmitting}
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                ))}

            {/* Service Creation/Edit Overlay */}
            {showAddOverlay && (
                <ServiceCreationOverlay
                    onAddOrUpdate={handleAddOrUpdateService}
                    onClose={handleCloseForm}
                    categoriesAvailable={categories.filter(
                        (cat) => cat !== "Todos",
                    )}
                    initialData={serviceToEdit}
                    isEditing={!!serviceToEdit}
                    isSubmitting={isSubmitting}
                    formError={formError}
                />
            )}
        </div>
    )
}

export default ManageServicesScreen
