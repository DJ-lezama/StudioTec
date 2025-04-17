import React, { useEffect, useState } from "react"
import Button from "../common/Button"
import { AlertCircle, Check, Loader2, X } from "lucide-react"

const ServiceCreationOverlay = ({
    onAddOrUpdate,
    onClose,
    categoriesAvailable = ["Cabello", "Uñas", "Cara"],
    initialData = null,
    isEditing = false,
    isSubmitting = false,
    formError = null,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        basePrice: "",
        duration: "",
        category: categoriesAvailable[0] || "",
        imageUrl: "",
    })
    const [errors, setErrors] = useState({})
    const [imagePreview, setImagePreview] = useState("")

    useEffect(() => {
        if (isEditing && initialData) {
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
                basePrice: initialData.basePrice?.toString() || "",
                duration: initialData.duration?.toString() || "",
                category: initialData.category || categoriesAvailable[0] || "",
                imageUrl: initialData.imageUrl || initialData.image || "",
            })
            setImagePreview(initialData.imageUrl || initialData.image || "")
            setErrors({})
        } else {
            setFormData({
                name: "",
                description: "",
                basePrice: "",
                duration: "",
                category: categoriesAvailable[0] || "",
                imageUrl: "",
            })
            setImagePreview("")
            setErrors({})
        }
    }, [initialData, isEditing, categoriesAvailable])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
        // Clear validation error for the field being changed
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            })
        }
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.name.trim()) {
            newErrors.name = "El nombre es obligatorio"
        }
        if (!formData.description.trim()) {
            newErrors.description = "La descripción es obligatoria"
        } else if (formData.description.trim().length < 10) {
            newErrors.description =
                "La descripción debe tener al menos 10 caracteres."
        }

        if (!formData.basePrice) {
            newErrors.basePrice = "El precio es obligatorio"
        } else if (
            isNaN(formData.basePrice) ||
            parseFloat(formData.basePrice) <= 0
        ) {
            newErrors.basePrice = "Ingresa un precio válido (mayor que 0)"
        }

        if (!formData.duration) {
            newErrors.duration = "La duración es obligatoria"
        } else if (
            isNaN(formData.duration) ||
            parseInt(formData.duration) <= 0
        ) {
            newErrors.duration =
                "Ingresa una duración válida en minutos (mayor que 0)"
        }

        if (!formData.imageUrl) {
            newErrors.imageUrl = "La URL de la imagen es obligatoria"
        } else {
            try {
                new URL(formData.imageUrl)
            } catch (e) {
                console.warn(e)
                newErrors.imageUrl = "Ingresa una URL válida (ej. https://...)"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleImageChange = (e) => {
        const url = e.target.value
        setFormData({
            ...formData,
            imageUrl: url,
        })
        setImagePreview(url)

        if (errors.imageUrl) {
            setErrors({
                ...errors,
                imageUrl: null,
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validateForm()) {
            return
        }

        const serviceData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            basePrice: parseFloat(formData.basePrice),
            duration: parseInt(formData.duration),
            category: formData.category,
            imageUrl: formData.imageUrl.trim(),
        }

        onAddOrUpdate(serviceData)
    }

    return (
        // Overlay container
        <div
            className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
        >
            {/* Form Panel */}
            <div className="w-full sm:w-[500px] h-full bg-white shadow-lg flex flex-col overflow-hidden transition-transform transform duration-300 ease-out translate-x-0">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-h5 font-heading font-semibold text-textMain">
                        {isEditing ? "Editar servicio" : "Nuevo servicio"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-textMain disabled:opacity-50"
                        disabled={isSubmitting}
                        aria-label="Cerrar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto px-4 py-5">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Display error message from parent (e.g., Firestore error) */}
                        {formError && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center">
                                <AlertCircle size={16} className="mr-2" />
                                <span>{formError}</span>
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="service-name"
                                className="block text-sm font-medium text-textMain mb-1"
                            >
                                Nombre del servicio*
                            </label>
                            <input
                                id="service-name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg ${
                                    errors.name
                                        ? "border-red-300 ring-1 ring-red-200"
                                        : "border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary"
                                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                placeholder="Ej. Corte de cabello"
                                required
                                disabled={isSubmitting}
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label
                                htmlFor="service-category"
                                className="block text-sm font-medium text-textMain mb-1"
                            >
                                Categoría*
                            </label>
                            <select
                                id="service-category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                                disabled={isSubmitting}
                            >
                                {categoriesAvailable.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="service-description"
                                className="block text-sm font-medium text-textMain mb-1"
                            >
                                Descripción*
                            </label>
                            <textarea
                                id="service-description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg ${
                                    errors.description
                                        ? "border-red-300 ring-1 ring-red-200"
                                        : "border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary"
                                } resize-none disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                placeholder="Describe brevemente el servicio..."
                                rows="3"
                                required
                                disabled={isSubmitting}
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-red-500 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Price and Duration Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Price */}
                            <div>
                                <label
                                    htmlFor="service-price"
                                    className="block text-sm font-medium text-textMain mb-1"
                                >
                                    Precio (MXN)*
                                </label>
                                <input
                                    id="service-price"
                                    type="number"
                                    name="basePrice"
                                    value={formData.basePrice}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className={`w-full p-3 border rounded-lg ${
                                        errors.basePrice
                                            ? "border-red-300 ring-1 ring-red-200"
                                            : "border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary"
                                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                    placeholder="Ej. 250.00"
                                    required
                                    disabled={isSubmitting}
                                />
                                {errors.basePrice && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center">
                                        <AlertCircle
                                            size={14}
                                            className="mr-1"
                                        />
                                        {errors.basePrice}
                                    </p>
                                )}
                            </div>

                            {/* Duration */}
                            <div>
                                <label
                                    htmlFor="service-duration"
                                    className="block text-sm font-medium text-textMain mb-1"
                                >
                                    Duración (min)*
                                </label>
                                <input
                                    id="service-duration"
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    min="1"
                                    step="1"
                                    className={`w-full p-3 border rounded-lg ${
                                        errors.duration
                                            ? "border-red-300 ring-1 ring-red-200"
                                            : "border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary"
                                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                    placeholder="Ej. 60"
                                    required
                                    disabled={isSubmitting}
                                />
                                {errors.duration && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center">
                                        <AlertCircle
                                            size={14}
                                            className="mr-1"
                                        />
                                        {errors.duration}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Image URL */}
                        <div>
                            <label
                                htmlFor="service-image-url"
                                className="block text-sm font-medium text-textMain mb-1"
                            >
                                URL de la imagen*
                            </label>
                            <input
                                id="service-image-url"
                                type="text"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleImageChange}
                                className={`w-full p-3 border rounded-lg ${
                                    errors.imageUrl
                                        ? "border-red-300 ring-1 ring-red-200"
                                        : "border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary"
                                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                placeholder="https://ejemplo.com/imagen.jpg"
                                required
                                disabled={isSubmitting}
                            />
                            {errors.imageUrl && (
                                <p className="mt-1 text-xs text-red-500 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {errors.imageUrl}
                                </p>
                            )}

                            {/* Image Preview Area */}
                            {imagePreview && (
                                <div className="mt-3 relative">
                                    <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                        <img
                                            src={imagePreview}
                                            alt="Vista previa"
                                            className="w-full h-full object-cover"
                                            // Basic error handling for broken image links
                                            onError={(e) => {
                                                e.target.style.display = "none"
                                                e.target.nextSibling.style.display =
                                                    "flex"
                                            }}
                                        />
                                        {/* Fallback display if image fails to load */}
                                        <div className="w-full h-full items-center justify-center text-gray-400 text-sm hidden">
                                            Vista previa no disponible
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <p className="text-xs text-gray-500 italic">
                            * Campos obligatorios
                        </p>
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
                    <Button
                        type="transparent"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="dark"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center justify-center min-w-[120px]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                {isEditing ? "Actualizando..." : "Guardando..."}
                            </>
                        ) : (
                            <>
                                <Check size={18} className="mr-1.5" />
                                {isEditing ? "Actualizar" : "Guardar"}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ServiceCreationOverlay
