import React, { useState, useRef, useEffect } from "react"
import { Star, X, Upload, Camera } from "lucide-react"
import Button from "../../components/common/Button.jsx"

const ReviewForm = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        review: "",
        rating: 5,
        serviceType: "scissors", // Default service type
    })
    const [profileImage, setProfileImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState("")
    const [charCount, setCharCount] = useState(0)
    const fileInputRef = useRef(null)

    // Configuración de límites de caracteres
    const MIN_CHARS = 10
    const MAX_CHARS = 160

    // Opciones para el tipo de servicio con sus iconos correspondientes
    const serviceOptions = [
        { value: "scissors", label: "Corte y peinado" },
        { value: "brush", label: "Uñas y manicure" },
        { value: "eyebrow", label: "Cejas y pestañas" },
    ]

    useEffect(() => {
        // Contar caracteres en la reseña
        const chars = formData.review.trim().length
        setCharCount(chars)
    }, [formData.review])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleRatingChange = (newRating) => {
        setFormData((prev) => ({
            ...prev,
            rating: newRating,
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                // 5MB limit
                setError(
                    "La imagen es demasiado grande. El tamaño máximo es 5MB.",
                )
                return
            }

            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
            if (!allowedTypes.includes(file.type)) {
                setError(
                    "Solo se permiten imágenes en formato JPG, JPEG o PNG.",
                )
                return
            }

            setProfileImage(file)

            // Create image preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current.click()
    }

    const removeImage = () => {
        setProfileImage(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        // Validación básica
        if (!formData.name.trim()) {
            setError("Por favor ingresa tu nombre")
            return
        }

        if (!formData.review.trim()) {
            setError("Por favor escribe tu reseña")
            return
        }

        // Validación de límites de caracteres
        if (charCount < MIN_CHARS) {
            setError(`Tu reseña debe tener al menos ${MIN_CHARS} caracteres.`)
            return
        }

        if (charCount > MAX_CHARS) {
            setError(`Tu reseña no puede tener más de ${MAX_CHARS} caracteres.`)
            return
        }

        setIsSubmitting(true)

        try {
            // Aquí normalmente enviarías los datos a un servidor incluyendo la imagen
            // Simulando una llamada a API
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Crear un objeto con los datos y un ID generado
            const newReview = {
                ...formData,
                id: Date.now(), // ID simple basado en timestamp
                // Si hay una imagen cargada, usamos la URL de la preview, sino usamos una por defecto
                image:
                    imagePreview ||
                    "https://randomuser.me/api/portraits/women/45.jpg",
            }

            if (onSubmit) {
                onSubmit(newReview)
            }

            // Mostrar mensaje de éxito
            setShowSuccess(true)

            // Reiniciar el formulario después de 2 segundos y cerrarlo
            setTimeout(() => {
                setFormData({
                    name: "",
                    review: "",
                    rating: 5,
                    serviceType: "scissors",
                })
                setProfileImage(null)
                setImagePreview(null)
                setShowSuccess(false)
                setIsSubmitting(false)
                onClose()
            }, 1500)
        } catch (error) {
            console.error("Error al enviar reseña:", error)
            setError(
                "Ha ocurrido un error al enviar tu reseña. Por favor intenta de nuevo.",
            )
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
                {/* Botón de cierre */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-textMain transition-colors"
                    aria-label="Cerrar formulario"
                >
                    <X size={24} />
                </button>

                {/* Encabezado */}
                <div className="text-textMain px-6 py-5 border rounded-t-2xl">
                    <h3 className="text-h4 font-bold font-heading">
                        Cuéntanos tu experiencia
                    </h3>
                    <p className="text-body-m mt-1">
                        Nos encantaría saber tu opinión sobre nuestro servicio
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Nombre */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-body-m font-medium text-textMain mb-1"
                        >
                            Tu nombre
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ingresa tu nombre"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                            maxLength={30}
                        />
                    </div>

                    {/* Subir foto */}
                    <div>
                        <label className="block text-body-m font-medium text-textMain mb-3">
                            Tu foto (opcional)
                        </label>
                        <div className="flex items-start space-x-4">
                            {/* Área de preview */}
                            <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                                {imagePreview ? (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={imagePreview}
                                            alt="Vista previa"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-md text-red-500 hover:text-red-700 transition-colors"
                                            aria-label="Eliminar imagen"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <Camera
                                        size={28}
                                        className="text-gray-400"
                                    />
                                )}
                            </div>

                            {/* Botones de acción */}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/jpeg, image/png, image/jpg"
                                    className="hidden"
                                    id="profile-image"
                                />
                                <Button
                                    type="transparent"
                                    className="flex items-center mb-2 text-body-s"
                                    onClick={triggerFileInput}
                                >
                                    <Upload size={16} className="mr-2" />
                                    Subir foto
                                </Button>
                                <p className="text-gray-500 text-xs">
                                    Formatos: JPG, PNG. Máximo 5MB
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tipo de servicio */}
                    <div>
                        <label
                            htmlFor="serviceType"
                            className="block text-body-m font-medium text-textMain mb-1"
                        >
                            Tipo de servicio
                        </label>
                        <select
                            id="serviceType"
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors appearance-none bg-white"
                        >
                            {serviceOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Calificación con estrellas */}
                    <div>
                        <label className="block text-body-m font-medium text-textMain mb-1">
                            Tu calificación
                        </label>
                        <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRatingChange(star)}
                                    className="focus:outline-none"
                                    aria-label={`Calificar con ${star} ${star === 1 ? "estrella" : "estrellas"}`}
                                >
                                    <Star
                                        size={28}
                                        className={`${
                                            star <= formData.rating
                                                ? "text-secondary fill-secondary"
                                                : "text-gray-300"
                                        } transition-colors`}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-body-m font-medium text-textMain">
                                {formData.rating}/5
                            </span>
                        </div>
                    </div>

                    {/* Reseña */}
                    <div>
                        <label
                            htmlFor="review"
                            className="block text-body-m font-medium text-textMain mb-1"
                        >
                            Tu reseña{" "}
                            <span className="text-xs text-gray-500 ml-1">
                                (entre {MIN_CHARS} y {MAX_CHARS} caracteres)
                            </span>
                        </label>
                        <textarea
                            id="review"
                            name="review"
                            value={formData.review}
                            onChange={handleChange}
                            placeholder="Cuéntanos tu experiencia..."
                            rows="4"
                            maxLength={MAX_CHARS}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors resize-none ${
                                charCount > 0 &&
                                (charCount < MIN_CHARS || charCount > MAX_CHARS)
                                    ? "border-red-300 focus:ring-red-200 focus:border-red-300"
                                    : "border-gray-200 focus:ring-primary focus:border-primary"
                            }`}
                        ></textarea>

                        {/* Contador de caracteres */}
                        <div
                            className={`mt-1 text-right text-sm ${
                                charCount === 0
                                    ? "text-gray-400"
                                    : charCount < MIN_CHARS
                                      ? "text-red-500"
                                      : charCount > MAX_CHARS * 0.9
                                        ? "text-yellow-600"
                                        : "text-green-600"
                            }`}
                        >
                            {charCount} / {MAX_CHARS} caracteres
                        </div>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-body-s">
                            {error}
                        </div>
                    )}

                    {/* Mensaje de éxito */}
                    {showSuccess && (
                        <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-body-s">
                            ¡Gracias por tu reseña! Ha sido enviada
                            correctamente.
                        </div>
                    )}

                    {/* Botón de enviar */}
                    <div className="flex justify-end">
                        <Button
                            type="dark"
                            className={`px-6 py-3 rounded-full ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
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
                                    Enviando...
                                </div>
                            ) : (
                                "Enviar reseña"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ReviewForm
