import React, { useState } from "react"
import { Check, Edit3, Loader2, X } from "lucide-react"
import Button from "../../../components/common/Button"
import FormField from "../FormField"
import InfoField from "../InfoField"
import { updateUserProfile } from "../../../features/auth/services/authService"
import { toast } from "react-toastify"

const ProfileTab = ({ user, onUserUpdate }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        if (!form.name.trim()) {
            toast.warn("El nombre no puede estar vacío.")
            return
        }

        setIsLoading(true)

        try {
            const dataToUpdate = {
                name: form.name.trim(),
                phone: form.phone.trim() || "",
            }

            await updateUserProfile(user.uid, dataToUpdate)

            const updatedUser = {
                ...user,
                ...dataToUpdate,
            }

            if (onUserUpdate) {
                onUserUpdate(updatedUser)
            }

            setIsEditing(false)
            toast.success("¡Perfil actualizado correctamente!")
        } catch (error) {
            console.error("Error saving profile:", error)
            toast.error(`Error al guardar: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        setForm({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
        })
        setIsEditing(false)
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

            {isEditing ? (
                <form
                    className="space-y-5"
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSave().then((r) => r)
                    }}
                >
                    <FormField
                        label="Nombre completo"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={isLoading}
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
                        disabled={isLoading}
                    />

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="dark"
                            buttonType="submit"
                            className="flex items-center justify-center min-w-[150px]" // Added centering and min-width
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
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
                            onClick={handleCancel}
                            className="flex items-center"
                            disabled={isLoading}
                        >
                            <X size={16} className="mr-2" />
                            Cancelar
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 divide-y divide-gray-100">
                        <InfoField
                            label="Nombre completo"
                            value={user.name || "-"}
                        />
                        <InfoField
                            label="Correo electrónico"
                            value={user.email || "-"}
                        />
                        <InfoField
                            label="Teléfono"
                            value={user.phone || "No especificado"}
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
