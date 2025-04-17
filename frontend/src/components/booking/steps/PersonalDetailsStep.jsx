import React from "react"
import FormField from "../FormField"
import Button from "../../../components/common/Button"

const PersonalDetailsStep = ({
    formData,
    onFormUpdate,
    onNext,
    onPrev,
    currentUser,
}) => {
    const isLoggedIn = !!currentUser

    const handleInputChange = (e) => {
        const { name, value } = e.target
        onFormUpdate({ ...formData, [name]: value })
    }

    const isNextDisabled = !formData.name || !formData.email || !formData.phone

    return (
        <div className="space-y-6">
            <h2 className="text-h3 font-heading font-semibold text-textMain">
                Tus datos personales
            </h2>
            <div className="space-y-4">
                {/* Name Field */}
                <FormField
                    label="Nombre completo"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej. María González"
                    required
                    readOnly={isLoggedIn}
                    className="transition-colors duration-200"
                />
                {/* Email Field */}
                <FormField
                    label="Correo electrónico"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ej. maria@ejemplo.com"
                    required
                    readOnly={isLoggedIn}
                    className="transition-colors duration-200"
                />
                {/* Phone Field */}
                <FormField
                    label="Teléfono"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Ej. 222 123 4567"
                    required
                    readOnly={isLoggedIn}
                    className="transition-colors duration-200"
                />
                {/* Inspiration Image URL Field (New, Optional) */}
                <FormField
                    label="Enlace a imagen de inspiración (opcional)"
                    name="inspirationImageUrl"
                    type="url"
                    value={formData.inspirationImageUrl}
                    onChange={handleInputChange}
                    placeholder="Pega aquí un enlace a una imagen (Pinterest, Instagram, etc.)"
                    required={false}
                    readOnly={false}
                />
                {/* Comments Field */}
                <FormField
                    label="Comentarios adicionales (opcional)"
                    name="comments"
                    type="textarea"
                    value={formData.comments}
                    onChange={handleInputChange}
                    placeholder="Si tienes alguna solicitud especial, déjanos saber"
                    rows={3}
                    readOnly={false}
                />
            </div>
            {/* Navigation Buttons */}
            <div className="pt-4 flex justify-between">
                <Button type="transparent" onClick={onPrev}>
                    Atrás
                </Button>
                <Button type="dark" onClick={onNext} disabled={isNextDisabled}>
                    Revisar y confirmar
                </Button>
            </div>
        </div>
    )
}
export default PersonalDetailsStep
