// src/components/ServicesVisualizer/ServiceCreationOverlay.jsx
import React, { useState, useEffect } from "react";
import Button from "../common/Button";
import { Check, X, Camera, Upload, AlertCircle } from "lucide-react";

const ServiceCreationOverlay = ({
                                    onAdd,
                                    onClose,
                                    categories = ["Cabello", "Uñas", "Cara"],
                                    initialData = null,
                                    isEditing = false
                                }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        basePrice: "",
        duration: "",
        category: categories[0] || "",
        image: ""
    });

    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Cargar datos iniciales si estamos editando
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
                basePrice: initialData.basePrice?.toString() || "",
                duration: initialData.duration?.toString() || "",
                category: initialData.category || categories[0] || "",
                image: initialData.image || ""
            });

            if (initialData.image) {
                setImagePreview(initialData.image);
            }
        }
    }, [initialData, categories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Limpiar error cuando el usuario comienza a corregir
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "El nombre es obligatorio";
        }

        if (!formData.description.trim()) {
            newErrors.description = "La descripción es obligatoria";
        }

        if (!formData.basePrice) {
            newErrors.basePrice = "El precio es obligatorio";
        } else if (isNaN(formData.basePrice) || parseFloat(formData.basePrice) <= 0) {
            newErrors.basePrice = "Ingresa un precio válido";
        }

        if (!formData.duration) {
            newErrors.duration = "La duración es obligatoria";
        } else if (isNaN(formData.duration) || parseInt(formData.duration) <= 0) {
            newErrors.duration = "Ingresa una duración válida en minutos";
        }

        if (!formData.image) {
            newErrors.image = "La URL de la imagen es obligatoria";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e) => {
        const url = e.target.value;
        setFormData({
            ...formData,
            image: url
        });
        setImagePreview(url);

        if (errors.image) {
            setErrors({
                ...errors,
                image: null
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        // Simulando una carga para dar feedback visual
        setTimeout(() => {
            const newService = {
                name: formData.name,
                description: formData.description,
                basePrice: parseFloat(formData.basePrice),
                duration: parseInt(formData.duration),
                category: formData.category,
                image: formData.image
            };

            onAdd(newService);
            setIsLoading(false);
        }, 600);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
            <div className="w-full sm:w-[500px] h-full bg-white shadow-lg flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-h5 font-heading font-semibold text-textMain">
                        {isEditing ? "Editar servicio" : "Nuevo servicio"}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-textMain">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto px-4 py-5">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-textMain mb-1">
                                Nombre del servicio*
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg ${
                                    errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-primary'
                                } focus:ring-2 focus:border-transparent`}
                                placeholder="Ej. Corte de cabello"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className="block text-sm font-medium text-textMain mb-1">
                                Categoría*
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-medium text-textMain mb-1">
                                Descripción*
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg ${
                                    errors.description ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-primary'
                                } focus:ring-2 focus:border-transparent resize-none`}
                                placeholder="Describe brevemente el servicio"
                                rows="3"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Fila de precio y duración */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Precio */}
                            <div>
                                <label className="block text-sm font-medium text-textMain mb-1">
                                    Precio (MXN)*
                                </label>
                                <input
                                    type="number"
                                    name="basePrice"
                                    value={formData.basePrice}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className={`w-full p-3 border rounded-lg ${
                                        errors.basePrice ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-primary'
                                    } focus:ring-2 focus:border-transparent`}
                                    placeholder="Ej. 250.00"
                                />
                                {errors.basePrice && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center">
                                        <AlertCircle size={14} className="mr-1" />
                                        {errors.basePrice}
                                    </p>
                                )}
                            </div>

                            {/* Duración */}
                            <div>
                                <label className="block text-sm font-medium text-textMain mb-1">
                                    Duración (min)*
                                </label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    min="1"
                                    className={`w-full p-3 border rounded-lg ${
                                        errors.duration ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-primary'
                                    } focus:ring-2 focus:border-transparent`}
                                    placeholder="Ej. 60"
                                />
                                {errors.duration && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center">
                                        <AlertCircle size={14} className="mr-1" />
                                        {errors.duration}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Imagen */}
                        <div>
                            <label className="block text-sm font-medium text-textMain mb-1">
                                URL de la imagen*
                            </label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleImageChange}
                                className={`w-full p-3 border rounded-lg ${
                                    errors.image ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-primary'
                                } focus:ring-2 focus:border-transparent`}
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                            {errors.image && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {errors.image}
                                </p>
                            )}

                            {/* Vista previa de imagen */}
                            {imagePreview && (
                                <div className="mt-3 relative">
                                    <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                                        <img
                                            src={imagePreview}
                                            alt="Vista previa"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/300x200?text=Error+de+imagen";
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <p className="text-xs text-gray-500 italic">* Campos obligatorios</p>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
                    <Button
                        type="transparent"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="dark"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex items-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isEditing ? "Actualizando..." : "Guardando..."}
                            </>
                        ) : (
                            <>
                                <Check size={18} className="mr-2" />
                                {isEditing ? "Actualizar servicio" : "Guardar servicio"}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ServiceCreationOverlay;