// src/screens/StylistScreens/ManageServicesScreen.jsx
import React, { useState, useEffect } from "react"
import ServiceCardCarousel from "../../components/ServicesVisualizer/ServiceCardCarousel"
import Button from "../../components/common/Button"
import { useNavigate } from "react-router-dom"
import ServiceCreationOverlay from "../../components/ServicesVisualizer/ServiceCreationOverlay.jsx"
import {
    PlusCircle,
    Search,
    Filter,
    Scissors,
    Hand,
    Eye,
    Tag,
    Clock,
    DollarSign,
    Check,
    X,
} from "lucide-react"
import catalogData, {
    categoryConfig,
} from "../../components/CatalogComponents/catalogData.js"

// Convertir datos del catálogo al formato de nuestra aplicación
const initialServices = [
    ...catalogData.hair.map((service, index) => ({
        serviceID: `hair-${index + 1}`,
        name: service.title,
        description: service.description,
        basePrice: parseFloat(service.price),
        duration: parseInt(service.duration),
        category: "Cabello",
        image: service.imageUrl,
        isActive: true,
    })),
    ...catalogData.nails.map((service, index) => ({
        serviceID: `nails-${index + 1}`,
        name: service.title,
        description: service.description,
        basePrice: parseFloat(service.price),
        duration: parseInt(service.duration),
        category: "Uñas",
        image: service.imageUrl,
        isActive: true,
    })),
    ...catalogData.eyebrows.map((service, index) => ({
        serviceID: `face-${index + 1}`,
        name: service.title,
        description: service.description,
        basePrice: parseFloat(service.price),
        duration: parseInt(service.duration),
        category: "Cara",
        image: service.imageUrl,
        isActive: index % 4 !== 0, // Algunos servicios inactivos para demo
    })),
]

const categoryIcons = {
    Cabello: <Scissors className="w-5 h-5" />,
    Uñas: <Hand className="w-5 h-5" />,
    Cara: <Eye className="w-5 h-5" />,
}

const ManageServicesScreen = () => {
    const [services, setServices] = useState(initialServices)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("Todos")
    const [showActiveOnly, setShowActiveOnly] = useState(false)
    const [sortBy, setSortBy] = useState("name") // default sort by name
    const [sortDirection, setSortDirection] = useState("asc") // asc or desc
    const [showAddOverlay, setShowAddOverlay] = useState(false)
    const [serviceToEdit, setServiceToEdit] = useState(null)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

    const navigate = useNavigate()

    // Obtener categorías únicas del array de servicios
    const categories = [
        "Todos",
        ...new Set(services.map((service) => service.category)),
    ]

    // Filtrar servicios según los criterios seleccionados
    const filteredServices = services.filter((service) => {
        const matchesSearch =
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory =
            selectedCategory === "Todos" ||
            service.category === selectedCategory
        const matchesActiveState = !showActiveOnly || service.isActive

        return matchesSearch && matchesCategory && matchesActiveState
    })

    // Ordenar servicios
    const sortedServices = [...filteredServices].sort((a, b) => {
        let valueA, valueB

        // Determinar los valores a comparar
        switch (sortBy) {
            case "price":
                valueA = a.basePrice
                valueB = b.basePrice
                break
            case "duration":
                valueA = a.duration
                valueB = b.duration
                break
            case "category":
                valueA = a.category
                valueB = b.category
                break
            default: // "name"
                valueA = a.name.toLowerCase()
                valueB = b.name.toLowerCase()
        }

        // Determinar la dirección del ordenamiento
        if (sortDirection === "asc") {
            return valueA > valueB ? 1 : -1
        } else {
            return valueA < valueB ? 1 : -1
        }
    })

    const handleSortChange = (criteria) => {
        if (sortBy === criteria) {
            // Si ya está ordenando por este criterio, cambiar la dirección
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            // Si es un nuevo criterio, establecerlo y ordenar ascendentemente
            setSortBy(criteria)
            setSortDirection("asc")
        }
    }

    const handleUpdateService = (updated) => {
        setServices((prev) =>
            prev.map((s) => (s.serviceID === updated.serviceID ? updated : s)),
        )
        showSuccess("Servicio actualizado correctamente")
        setServiceToEdit(null)
    }

    const handleDeleteService = (id) => {
        setServices((prev) => prev.filter((s) => s.serviceID !== id))
        showSuccess("Servicio eliminado correctamente")
    }

    const handleAddService = (newService) => {
        if (serviceToEdit) {
            // Si estamos editando un servicio existente
            handleUpdateService({
                ...serviceToEdit,
                ...newService,
                serviceID: serviceToEdit.serviceID,
            })
        } else {
            // Si es un nuevo servicio
            const newId = `new-${Date.now()}`
            setServices((prev) => [
                { ...newService, serviceID: newId, isActive: true },
                ...prev,
            ])
            showSuccess("Nuevo servicio añadido correctamente")
        }
        setShowAddOverlay(false)
        setServiceToEdit(null)
    }

    const handleEditService = (service) => {
        setServiceToEdit(service)
        setShowAddOverlay(true)
    }

    const handleCloseForm = () => {
        setShowAddOverlay(false)
        setServiceToEdit(null)
    }

    const handleToggleStatus = (id) => {
        setServices((prev) =>
            prev.map((s) =>
                s.serviceID === id ? { ...s, isActive: !s.isActive } : s,
            ),
        )
        showSuccess("Estado del servicio actualizado")
    }

    const showSuccess = (message) => {
        setSuccessMessage(message)
        setShowSuccessMessage(true)
        setTimeout(() => {
            setShowSuccessMessage(false)
        }, 3000)
    }

    return (
        <div className="p-6 min-h-screen bg-primaryLight">
            {/* Cabecera con título y botón de regreso */}
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

            {/* Mensaje de éxito */}
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

            {/* Controles y filtros */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    {/* Búsqueda */}
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar servicios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    {/* Botón para añadir nuevo servicio */}
                    <Button
                        type="dark"
                        onClick={() => setShowAddOverlay(true)}
                        className="flex items-center gap-2"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Nuevo servicio
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* Filtro por categoría */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${
                                    selectedCategory === category
                                        ? "bg-secondary text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {category !== "Todos" &&
                                    categoryIcons[category]}
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Mostrar solo activos */}
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={showActiveOnly}
                                onChange={() =>
                                    setShowActiveOnly(!showActiveOnly)
                                }
                                className="rounded text-secondary focus:ring-secondary"
                            />
                            Solo servicios activos
                        </label>

                        {/* Ordenamiento */}
                        <div className="relative">
                            <select
                                value={`${sortBy}-${sortDirection}`}
                                onChange={(e) => {
                                    const [newSortBy, newSortDirection] =
                                        e.target.value.split("-")
                                    setSortBy(newSortBy)
                                    setSortDirection(newSortDirection)
                                }}
                                className="pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="name-asc">Nombre (A-Z)</option>
                                <option value="name-desc">Nombre (Z-A)</option>
                                <option value="price-asc">
                                    Precio (menor a mayor)
                                </option>
                                <option value="price-desc">
                                    Precio (mayor a menor)
                                </option>
                                <option value="duration-asc">
                                    Duración (menor a mayor)
                                </option>
                                <option value="duration-desc">
                                    Duración (mayor a menor)
                                </option>
                                <option value="category-asc">
                                    Categoría (A-Z)
                                </option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <Filter className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de servicios */}
            {sortedServices.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 divide-y divide-gray-200">
                        {/* Encabezado de la tabla */}
                        <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-500">
                            <div className="md:col-span-5">Servicio</div>
                            <div className="md:col-span-2 flex items-center gap-1">
                                <Tag className="w-4 h-4" />
                                <span>Categoría</span>
                            </div>
                            <div className="md:col-span-1 flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>Precio</span>
                            </div>
                            <div className="md:col-span-1 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>Duración</span>
                            </div>
                            <div className="md:col-span-1 text-center">
                                Estado
                            </div>
                            <div className="md:col-span-2 text-right">
                                Acciones
                            </div>
                        </div>

                        {/* Filas de servicios */}
                        {sortedServices.map((service) => (
                            <div
                                key={service.serviceID}
                                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50"
                            >
                                {/* Servicio (nombre, imagen y descripción) */}
                                <div className="md:col-span-5 flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://via.placeholder.com/80?text=Imagen"
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-textMain">
                                            {service.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-2">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Categoría */}
                                <div className="md:col-span-2 flex items-center gap-1.5">
                                    <div className="bg-primary/20 text-secondary p-1.5 rounded-full">
                                        {categoryIcons[service.category]}
                                    </div>
                                    <span className="text-sm">
                                        {service.category}
                                    </span>
                                </div>

                                {/* Precio */}
                                <div className="md:col-span-1 text-sm">
                                    ${service.basePrice.toFixed(2)}
                                </div>

                                {/* Duración */}
                                <div className="md:col-span-1 text-sm">
                                    {service.duration} min
                                </div>

                                {/* Estado */}
                                <div className="md:col-span-1 flex justify-center">
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

                                {/* Acciones */}
                                <div className="md:col-span-2 flex justify-end gap-2">
                                    <Button
                                        type="transparent"
                                        className="text-xs px-2"
                                        onClick={() =>
                                            handleEditService(service)
                                        }
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        type="light"
                                        className="text-xs px-2 text-red-600 hover:text-red-700"
                                        onClick={() =>
                                            handleDeleteService(
                                                service.serviceID,
                                            )
                                        }
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="text-lg font-medium text-textMain mb-2">
                        No se encontraron servicios
                    </h3>
                    <p className="text-gray-500 mb-4">
                        No hay servicios que coincidan con tus criterios de
                        búsqueda.
                    </p>
                    <Button
                        type="dark"
                        onClick={() => {
                            setSearchTerm("")
                            setSelectedCategory("Todos")
                            setShowActiveOnly(false)
                        }}
                    >
                        Limpiar filtros
                    </Button>
                </div>
            )}

            {/* Overlay para crear/editar servicio */}
            {showAddOverlay && (
                <ServiceCreationOverlay
                    onAdd={handleAddService}
                    onClose={handleCloseForm}
                    categories={categories.filter((cat) => cat !== "Todos")}
                    initialData={serviceToEdit}
                    isEditing={!!serviceToEdit}
                />
            )}
        </div>
    )
}

export default ManageServicesScreen
