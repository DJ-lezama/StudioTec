import React, { useEffect, useState } from "react"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../../../firebaseConfig"
import {
    AlertTriangle,
    CalendarDays,
    Clock,
    Loader2,
    Save,
    Settings,
} from "lucide-react"
import Button from "../../common/Button"
import { toast } from "react-toastify"

// TODO: Define more specific components for editing hours and overrides later
// import WorkingHoursEditor from './WorkingHoursEditor';
// import OverridesManager from './OverridesManager';

const AvailabilityTab = ({ stylistId }) => {
    const [profileData, setProfileData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isSaving, setIsSaving] = useState(false)

    const [editableData, setEditableData] = useState({})

    useEffect(() => {
        if (!stylistId) {
            setError("ID de estilista no proporcionado.")
            setIsLoading(false)
            return
        }

        const fetchProfile = async () => {
            setIsLoading(true)
            setError(null)
            const docRef = doc(db, "stylist_profiles", stylistId)
            try {
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    setProfileData(data)
                    setEditableData({
                        workingHours: JSON.parse(
                            JSON.stringify(data.workingHours || {}),
                        ),
                        availabilityOverrides: JSON.parse(
                            JSON.stringify(data.availabilityOverrides || {}),
                        ),
                        timeZone: data.timeZone || "",
                        bufferTime: data.bufferTime || 0,
                    })
                } else {
                    setError(
                        "Perfil de estilista no encontrado. Contacta al administrador.",
                    )
                    console.warn(
                        `Stylist profile document not found for ID: ${stylistId}`,
                    )
                    setProfileData(null)
                    setEditableData({})
                }
            } catch (err) {
                console.error("Error fetching stylist profile:", err)
                setError("Error al cargar el perfil de disponibilidad.")
                setProfileData(null)
                setEditableData({})
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile().then((r) => r)
    }, [stylistId])

    // Placeholder save handler - will eventually update Firestore
    const handleSaveChanges = async () => {
        if (!stylistId || !profileData) {
            toast.error("No hay datos de perfil para guardar.")
            return
        }
        setIsSaving(true)
        const docRef = doc(db, "stylist_profiles", stylistId)
        try {
            // TODO: Add validation for editableData before saving
            console.log("Saving data:", editableData)
            await updateDoc(docRef, {
                workingHours: editableData.workingHours,
                availabilityOverrides: editableData.availabilityOverrides,
                timeZone: editableData.timeZone,
                bufferTime: Number(editableData.bufferTime) || 0,
                updatedAt: new Date(), // Use client time or serverTimestamp() if preferred
            })

            setProfileData((prev) => ({
                ...prev,
                ...editableData,
                updatedAt: new Date(),
            }))

            toast.success("Disponibilidad actualizada correctamente.")
        } catch (err) {
            console.error("Error saving availability:", err)
            toast.error(`Error al guardar: ${err.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    // Placeholder handlers for editing specific parts - to be implemented
    const handleWorkingHoursChange = (newHours) => {
        setEditableData((prev) => ({ ...prev, workingHours: newHours }))
    }
    const handleOverridesChange = (newOverrides) => {
        setEditableData((prev) => ({
            ...prev,
            availabilityOverrides: newOverrides,
        }))
    }
    const handleSettingsChange = (e) => {
        const { name, value } = e.target
        setEditableData((prev) => ({ ...prev, [name]: value }))
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-10">
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                <span className="ml-3 text-gray-600">
                    Cargando disponibilidad...
                </span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span>{error}</span>
            </div>
        )
    }

    if (!profileData) {
        return (
            <p className="text-center text-gray-500">
                No se pudo cargar el perfil de disponibilidad.
            </p>
        )
    }

    return (
        <div>
            <h3 className="text-h4 font-heading font-semibold text-textMain mb-6">
                Gestionar Mi Horario y Disponibilidad
            </h3>

            {/* Placeholder sections - TODO: Replace with actual editing components later */}

            {/* Section 1: Default Weekly Schedule */}
            <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-subtitle-m font-medium text-textMain mb-4 flex items-center">
                    <Clock size={18} className="mr-2 text-secondary" /> Horario
                    Semanal Predeterminado
                    <Button
                        type="transparent"
                        size="sm"
                        className="ml-auto !text-xs"
                        onClick={() => alert("Edit Working Hours UI needed")}
                    >
                        Editar
                    </Button>
                </h4>
                {/* TODO: Display editableData.workingHours nicely */}
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                    {JSON.stringify(editableData.workingHours, null, 2)}
                </pre>
                {/* Replace pre with actual WorkingHoursEditor component later */}
                {/* <WorkingHoursEditor hours={editableData.workingHours} onChange={handleWorkingHoursChange} /> */}
            </div>

            {/* Section 2: Specific Date Overrides */}
            <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-subtitle-m font-medium text-textMain mb-4 flex items-center">
                    <CalendarDays size={18} className="mr-2 text-secondary" />{" "}
                    Excepciones de Disponibilidad
                    <Button
                        type="secondary"
                        size="sm"
                        className="ml-auto !text-xs"
                        onClick={() => alert("Add/Edit Override UI needed")}
                    >
                        + Añadir Excepción
                    </Button>
                </h4>
                {/* TODO: Display editableData.availabilityOverrides nicely */}
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                    {JSON.stringify(
                        editableData.availabilityOverrides,
                        null,
                        2,
                    )}
                </pre>
                {/* Replace pre with actual OverridesManager component later */}
                {/* <OverridesManager overrides={editableData.availabilityOverrides} onChange={handleOverridesChange} /> */}
            </div>

            {/* Section 3: Settings */}
            <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-subtitle-m font-medium text-textMain mb-4 flex items-center">
                    <Settings size={18} className="mr-2 text-secondary" />{" "}
                    Configuración Adicional
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* TimeZone - Needs a proper dropdown later */}
                    <div>
                        <label
                            htmlFor="timeZone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Zona Horaria
                        </label>
                        <input
                            type="text"
                            id="timeZone"
                            name="timeZone"
                            value={editableData.timeZone || ""}
                            onChange={handleSettingsChange}
                            placeholder="Ej: America/Mexico_City"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Importante para la correcta visualización de
                            horarios.
                        </p>
                    </div>
                    {/* Buffer Time */}
                    <div>
                        <label
                            htmlFor="bufferTime"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Tiempo de Descanso (minutos)
                        </label>
                        <input
                            type="number"
                            id="bufferTime"
                            name="bufferTime"
                            value={editableData.bufferTime ?? 0}
                            onChange={handleSettingsChange}
                            min="0"
                            step="5"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Tiempo entre citas (0 por defecto).
                        </p>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-6">
                <Button
                    type="dark"
                    onClick={handleSaveChanges}
                    disabled={isLoading || isSaving}
                    className="flex items-center"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save size={16} className="mr-2" /> Guardar Cambios
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

export default AvailabilityTab
