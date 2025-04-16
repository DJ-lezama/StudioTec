import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import marker from "../../assets/marker.svg";
import studioFoto from "../../assets/NombreStudioTec.png";
import Button from "../../components/common/Button.jsx";
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para la redirección
delete L.Icon.Default.prototype._getIconUrl;

const customIcon = new L.Icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: 'text-textMain',
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
});

const MapView = () => {
    const position = [19.0597991, -98.3090179];
    // Utilizamos el hook useNavigate para obtener la función de navegación
    const navigate = useNavigate();

    // Función para manejar la redirección a la página de agendar cita
    const handleBookingClick = () => {
        navigate('/agendar');
    };
    return (
        <section className="w-full bg-white relative z-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-5">
                <div className="text-center mb-8">
                    <h2 className="text-h2 font-bold text-textMain mb-3">Encuéntranos</h2>
                    <h3 className={"font-regular text-textMain mb-3"}>
                        Estamos ubicados en una zona accesible de Cholula, con estacionamiento disponible y múltiples rutas de acceso.
                    </h3>
                </div>

                <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden mb-16 relative">
                    <div className="w-full relative">
                        <MapContainer
                            center={position}
                            zoom={18}
                            scrollWheelZoom={false}
                            style={{ height: '400px', width: '100%' }}
                            className="z-0"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={position} icon={customIcon}>
                                <Popup className="custom-popup">
                                    <div className="text-center">
                                        <strong className="text-textMain">Studio Tec</strong><br />
                                        <span className="text-gray-600 text-sm">
                                            Av 7 Pte 107A<br />
                                            Barrio de Sta. María Xixitla
                                        </span>
                                        <div className="mt-2">
                                            <a
                                                href="https://www.google.com/maps/search/?api=1&query=19.0597991,-98.3090179"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-textMain hover:text-opacity-80 text-sm font-medium"
                                            >
                                                Ver en Google Maps
                                            </a>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-100">
                            <h3 className="text-xl font-semibold text-textMain mb-4">Información de contacto</h3>
                            <div className="mb-6 overflow-hidden rounded-lg">
                                <img
                                    src={studioFoto}
                                    alt="Fachada de Studio Tec"
                                    className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 p-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-textMain">Dirección</h4>
                                    <p className="text-gray-600">
                                        Av 7 Pte 107A<br />
                                        Barrio de Sta. María Xixitla, 72760<br />
                                        Cholula de Rivadavia, Puebla
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-textMain">Horario</h4>
                                    <p className="text-gray-600">
                                        Lunes a Viernes: 9:00 - 19:00<br />
                                        Sábados: 9:00 - 14:00<br />
                                        Domingos: Cerrado
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-textMain">Contacto</h4>
                                    <p className="text-gray-600">
                                        Teléfono: (222) 123-4567<br />
                                        Email: info@studiotec.mx
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botón actualizado con tu componente */}
                    <div className="p-4 border-t flex justify-end">
                        <Button
                            type="rounded"
                            icon={<ArrowRight size={16} />}
                            className="px-6 py-3 font-semibold"
                            onClick={handleBookingClick}
                        >
                            Reservar tu cita
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MapView;
