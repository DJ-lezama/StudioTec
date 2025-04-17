// src/components/profile/tabs/AvailabilityTab.jsx
import React, { useCallback, useEffect, useState } from "react"
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore"
import { db } from "../../../../firebaseConfig" // Adjust path if needed
import {
    AlertTriangle,
    CalendarDays,
    Clock,
    Loader2,
    Save,
    Settings,
} from "lucide-react"
import Button from "../../common/Button" // Adjust path if needed
import { toast } from "react-toastify"

// Import the child components
import WorkingHoursEditor from "./WorkingHoursEditor" // Adjust path if needed
import OverridesManager from "./OverridesManager" // Adjust path if needed
// Import utility functions
import { isValidTime, parseInterval } from "../../../utils/timeUtils" // Adjust path if needed

const AvailabilityTab = ({ stylistId }) => {
    const [profileData, setProfileData] = useState(null) // Holds the last known saved state
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isSaving, setIsSaving] = useState(false)

    // Holds the data currently being edited in the UI
    const [editableData, setEditableData] = useState(null)

    // Fetch profile data on initial load or when stylistId changes
    useEffect(() => {
        if (!stylistId) {
            setError("ID de estilista no proporcionado.")
            setIsLoading(false)
            setProfileData(null) // Clear previous data
            setEditableData(null) // Clear editable data
            return
        }

        const fetchProfile = async () => {
            setIsLoading(true)
            setError(null)
            setProfileData(null)
            setEditableData(null) // Clear editable data while loading
            const docRef = doc(db, "stylist_profiles", stylistId)
            try {
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    setProfileData(data) // Store the fetched data
                    // Initialize editableData with a deep copy AFTER data is fetched
                    setEditableData({
                        workingHours: JSON.parse(
                            JSON.stringify(data.workingHours || {}),
                        ),
                        availabilityOverrides: JSON.parse(
                            JSON.stringify(data.availabilityOverrides || {}),
                        ),
                        timeZone: data.timeZone || "",
                        bufferTime: data.bufferTime ?? 0, // Use nullish coalescing for 0 value
                    })
                } else {
                    setError(
                        "Perfil de estilista no encontrado. Contacta al administrador si crees que esto es un error.",
                    )
                    console.warn(
                        `Stylist profile document not found for ID: ${stylistId}`,
                    )
                }
            } catch (err) {
                console.error("Error fetching stylist profile:", err)
                setError(
                    "Error al cargar el perfil de disponibilidad. Intenta recargar.",
                )
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile().then((r) => r)
    }, [setProfileData, stylistId])

    // Callback for WorkingHoursEditor changes
    const handleWorkingHoursChange = useCallback((newHours) => {
        setEditableData((prev) => {
            if (!prev) return null
            return { ...prev, workingHours: newHours }
        })
    }, [])

    // Callback for OverridesManager changes
    const handleOverridesChange = useCallback((newOverrides) => {
        setEditableData((prev) => {
            if (!prev) return null
            return { ...prev, availabilityOverrides: newOverrides }
        })
    }, [])

    // Handler for general settings inputs (TimeZone, BufferTime)
    const handleSettingsChange = (e) => {
        const { name, value } = e.target
        setEditableData((prev) => {
            if (!prev) return null
            const processedValue =
                name === "bufferTime"
                    ? value === ""
                        ? 0
                        : Number(value)
                    : value // Ensure bufferTime is number or 0
            return { ...prev, [name]: processedValue }
        })
    }

    // Save Changes to Firestore
    const handleSaveChanges = async () => {
        if (!stylistId || !editableData) {
            toast.error(
                "No hay datos para guardar o el perfil no se cargó correctamente.",
            )
            return
        }

        // --- Validation before Saving ---
        let isValid = true
        let hasTimeErrors = false

        // Validate working hours format and logic
        if (editableData.workingHours) {
            Object.entries(editableData.workingHours).forEach(
                ([day, intervals]) => {
                    if (Array.isArray(intervals)) {
                        if (intervals.length === 0) {
                            // Decide if an empty array is valid (means working but no slots?) or invalid
                            // For now, let's consider it potentially valid but log a warning
                            console.warn(
                                `WorkingHours for ${day} is an empty array.`,
                            )
                        }
                        intervals.forEach((intervalStr) => {
                            const {
                                start,
                                end,
                                error: parseError,
                            } = parseInterval(intervalStr)
                            if (
                                parseError ||
                                !isValidTime(start) ||
                                !isValidTime(end) ||
                                end <= start
                            ) {
                                isValid = false
                                hasTimeErrors = true
                                console.error(
                                    `Invalid time interval detected in working hours for ${day}:`,
                                    intervalStr,
                                )
                            }
                        })
                    } else if (intervals !== null) {
                        // If not an array and not null, it's an invalid format
                        isValid = false
                        console.error(
                            `Invalid data type for working hours on ${day}:`,
                            intervals,
                        )
                        hasTimeErrors = true // Treat as a time error for messaging
                    }
                },
            )
        }

        // TODO: Validate availabilityOverrides (e.g., ensure custom hours are valid)

        if (!editableData.timeZone?.trim()) {
            isValid = false
            toast.warn("La Zona Horaria es obligatoria.")
        }
        if (
            typeof editableData.bufferTime !== "number" ||
            editableData.bufferTime < 0 ||
            !Number.isInteger(editableData.bufferTime)
        ) {
            isValid = false
            toast.warn(
                "El Tiempo de Descanso debe ser un número entero positivo o cero.",
            )
        }
        // --- End Validation ---

        if (!isValid) {
            if (hasTimeErrors) {
                toast.error(
                    "Hay errores en los intervalos de tiempo definidos. Por favor, corrígelos antes de guardar.",
                )
            } else {
                toast.error(
                    "Hay errores en la configuración. Por favor, revisa los campos marcados.",
                )
            }
            return // Don't save if validation fails
        }

        setIsSaving(true)
        const docRef = doc(db, "stylist_profiles", stylistId)
        try {
            const dataToSave = {
                workingHours: editableData.workingHours,
                availabilityOverrides: editableData.availabilityOverrides,
                timeZone: editableData.timeZone.trim(), // Trim timezone before saving
                bufferTime: editableData.bufferTime, // Already validated as number
                updatedAt: Timestamp.now(), // Use client-side timestamp for simplicity here
            }

            console.log("Saving availability data:", dataToSave)
            await updateDoc(docRef, dataToSave)

            // Update the 'read-only' profileData state to reflect saved changes
            setProfileData((prev) => ({
                ...prev,
                ...dataToSave, // Merge saved data
                updatedAt: new Date(), // Update local timestamp display immediately
            }))
            // Optionally reset editableData to match saved data if needed,
            // though keeping the current edited state might be fine too.
            // setEditableData({...dataToSave});

            toast.success("Disponibilidad actualizada correctamente.")
        } catch (err) {
            console.error("Error saving availability:", err)
            toast.error(`Error al guardar: ${err.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    // --- Render Logic ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-10 text-gray-600">
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                <span className="ml-3">Cargando disponibilidad...</span>
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

    // Show message if data hasn't loaded into editableData yet (e.g., profile existed but had no data initially)
    if (!editableData) {
        return (
            <div className="text-center p-6 text-gray-500">
                <p>Inicializando editor de disponibilidad...</p>
                <p className="text-xs mt-2">
                    (Si este mensaje persiste, puede que el perfil no exista o
                    haya un problema de carga).
                </p>
            </div>
        )
    }

    // --- Main Render ---
    return (
        <div className="space-y-8">
            <h3 className="text-h4 font-heading font-semibold text-textMain mb-6">
                Gestionar Mi Horario y Disponibilidad
            </h3>

            {/* Section 1: Default Weekly Schedule */}
            <div className="p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-subtitle-m font-medium text-textMain mb-4 flex items-center">
                    <Clock size={18} className="mr-2 text-secondary" /> Horario
                    Semanal Predeterminado
                </h4>
                {/* Render the WorkingHoursEditor component */}
                <WorkingHoursEditor
                    initialHours={editableData.workingHours}
                    onChange={handleWorkingHoursChange}
                />
            </div>

            {/* Section 2: Specific Date Overrides */}
            <div className="p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-subtitle-m font-medium text-textMain mb-4 flex items-center justify-between">
                    <span>
                        <CalendarDays
                            size={18}
                            className="mr-2 text-secondary inline"
                        />{" "}
                        Excepciones de Disponibilidad
                    </span>
                </h4>
                <OverridesManager
                    initialOverrides={editableData.availabilityOverrides}
                    onChange={handleOverridesChange}
                />
            </div>

            {/* Section 3: Settings */}
            <div className="p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-subtitle-m font-medium text-textMain mb-4 flex items-center">
                    <Settings size={18} className="mr-2 text-secondary" />{" "}
                    Configuración Adicional
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* TimeZone Input */}
                    <div>
                        <label
                            htmlFor="timeZone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Zona Horaria* (Ej: America/Mexico_City)
                        </label>
                        <input
                            type="text"
                            id="timeZone"
                            name="timeZone"
                            value={editableData.timeZone || ""}
                            onChange={handleSettingsChange}
                            placeholder="Escribe tu zona horaria IANA"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                            required
                            disabled={isSaving}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            <a
                                href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary hover:underline"
                            >
                                Lista de zonas horarias IANA
                            </a>
                        </p>
                    </div>
                    {/* Buffer Time Input */}
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
                            value={editableData.bufferTime ?? 0} // Ensure value is controlled
                            onChange={handleSettingsChange}
                            min="0"
                            step="5" // Suggest steps of 5 minutes
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                            disabled={isSaving}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Tiempo automático entre citas (0 por defecto). Se
                            recomienda usar múltiplos de 5.
                        </p>
                    </div>
                </div>
            </div>

            {/* Save Button Area */}
            <div className="flex justify-end mt-6 border-t pt-6 border-gray-200">
                <Button
                    type="dark"
                    onClick={handleSaveChanges}
                    // Disable button if loading, saving, or editable data isn't ready
                    disabled={isLoading || isSaving || !editableData}
                    className="flex items-center min-w-[150px] justify-center" // Ensure button has min width for consistent look
                    aria-label="Guardar cambios de disponibilidad"
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
