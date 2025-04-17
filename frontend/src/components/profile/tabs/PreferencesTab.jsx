import React from "react"
import Button from "../../../components/common/Button"
import ToggleSwitch from "../ToggleSwitch"

const PreferencesTab = () => {
    return (
        <div>
            <h3 className="text-h4 font-heading font-semibold text-textMain mb-6">
                Preferencias
            </h3>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-100">
                    <h4 className="text-subtitle-m font-medium text-textMain mb-2">
                        Notificaciones
                    </h4>
                    <p className="text-sm text-gray-600">
                        Configura cómo quieres recibir notificaciones sobre tus
                        citas y promociones.
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    <ToggleSwitch
                        label="Recordatorios de cita"
                        description="Recibe un recordatorio 24 horas antes de tu cita"
                        defaultChecked={true}
                    />

                    <ToggleSwitch
                        label="Promociones y ofertas"
                        description="Recibe notificaciones sobre promociones especiales"
                        defaultChecked={false}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h4 className="text-subtitle-m font-medium text-textMain mb-2">
                        Preferencias de servicio
                    </h4>
                    <p className="text-sm text-gray-600">
                        Personaliza tus preferencias para mejorar tu experiencia
                        en cada visita.
                    </p>
                </div>

                <div className="p-6">
                    <label className="block text-sm font-medium text-textMain mb-2">
                        Estilista preferido
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                        <option value="">Cualquiera disponible</option>
                        <option value="stylist-a">Estilista A</option>
                        <option value="stylist-b">Estilista B</option>
                        <option value="stylist-c">Estilista C</option>
                    </select>

                    <div className="mt-6">
                        <Button type="dark">Guardar preferencias</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreferencesTab
