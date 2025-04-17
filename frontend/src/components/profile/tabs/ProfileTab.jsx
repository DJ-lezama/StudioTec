import React, { useState } from "react"
import { Check, Edit3, X } from "lucide-react"
import Button from "../../../components/common/Button"
import FormField from "../FormField"
import InfoField from "../InfoField"

const ProfileTab = ({ user, onUserUpdate }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        setIsLoading(true)

        // TODO: Implement API call to save user data
        // Simulate API call
        setTimeout(() => {
            const updatedUser = {
                ...user,
                name: form.name,
                phone: form.phone,
                address: form.address,
            }

            localStorage.setItem("studioTecUser", JSON.stringify(updatedUser))
            onUserUpdate(updatedUser)
            setIsLoading(false)
            setIsEditing(false)
            setShowSuccess(true)

            // Hide the success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(false)
            }, 3000)
        }, 800)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-h4 font-heading font-semibold text-textMain">
                    {isEditing ? "Editar perfil" : "Información personal"}
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
                    <FormField
                        label="Nombre completo"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <FormField
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        value={form.email}
                        disabled={true}
                        helpText="El correo electrónico no se puede modificar"
                    />

                    <FormField
                        label="Teléfono"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Ej. 222 123 4567"
                    />

                    <FormField
                        label="Dirección"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Tu dirección (opcional)"
                    />

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
                                    <Check size={16} className="mr-2" />
                                    Guardar cambios
                                </>
                            )}
                        </Button>
                        <Button
                            type="transparent"
                            onClick={() => setIsEditing(false)}
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
                        <InfoField label="Nombre completo" value={user.name} />
                        <InfoField
                            label="Correo electrónico"
                            value={user.email}
                        />
                        <InfoField
                            label="Teléfono"
                            value={user.phone || "No especificado"}
                        />
                        <InfoField
                            label="Dirección"
                            value={user.address || "No especificada"}
                        />
                        <InfoField
                            label="Rol"
                            value={
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-secondary capitalize">
                                    {user.role === "stylist"
                                        ? "Estilista"
                                        : "Cliente"}
                                </span>
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileTab
