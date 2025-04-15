// src/components/ServicesVisualizer/ServiceCreationOverlay.jsx
import React, { useState } from "react";
import Button from "../common/Button";

const ServiceCreationOverlay = ({ onAdd, onClose }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [basePrice, setBasePrice] = useState("");
    const [duration, setDuration] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");

    const handleSave = () => {
        const newService = {
            serviceID: Date.now(),
            name,
            description,
            basePrice: parseFloat(basePrice),
            duration: parseInt(duration),
            category,
            image,
            isActive: true,
        };
        onAdd(newService); // This also closes overlay in the parent
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
            <div className="w-full sm:w-[400px] h-full bg-white shadow-lg flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-subtitle-m font-heading font-semibold text-textMain">Nuevo servicio</h2>
                    <button onClick={onClose} className="text-xl font-bold">✕</button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-textMain">Nombre</label>
                        <input
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nombre del servicio"
                        />

                        <label className="block text-sm font-medium text-textMain">Descripción</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descripción del servicio"
                        />

                        <label className="block text-sm font-medium text-textMain">Precio base</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            value={basePrice}
                            onChange={(e) => setBasePrice(e.target.value)}
                            placeholder="$"
                        />

                        <label className="block text-sm font-medium text-textMain">Duración (min)</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="30"
                        />

                        <label className="block text-sm font-medium text-textMain">Categoría</label>
                        <input
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Cabello, uñas, etc."
                        />

                        <label className="block text-sm font-medium text-textMain">Imagen</label>
                        <input
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="URL de la imagen"
                        />
                    </div>

                    <div className="pt-4 flex justify-between gap-2">
                        <Button type="transparent" onClick={onClose}>Cancelar</Button>
                        <Button type="dark" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCreationOverlay;
