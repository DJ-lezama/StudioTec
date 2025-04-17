// src/components/Services/ServiceCard.jsx
import React, { useState } from "react"
import Button from "../common/Button"
import { Pencil, Trash2, Check, X } from "lucide-react"

const ServiceCard = ({ service, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState(service)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        onUpdate(formData)
        setIsEditing(false)
    }

    return (
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col space-y-4 border border-gray-200">
            <div className="flex justify-between items-start">
                <img
                    src={formData.image}
                    alt={formData.name}
                    className="w-32 h-32 object-cover rounded-lg border"
                />
                <div className="space-x-2">
                    {isEditing ? (
                        <>
                            <Button type="dark" onClick={handleSave}>
                                <Check size={16} />
                            </Button>
                            <Button
                                type="light"
                                onClick={() => setIsEditing(false)}
                            >
                                <X size={16} />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                type="dark"
                                onClick={() => setIsEditing(true)}
                            >
                                <Pencil size={16} />
                            </Button>
                            <Button
                                type="light"
                                onClick={() => onDelete(service.serviceID)}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <input
                    type="text"
                    name="name"
                    className="text-h4 font-heading font-semibold w-full bg-transparent border-b"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
                <textarea
                    name="description"
                    className="text-body-m w-full resize-none bg-transparent border rounded-md p-2"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
                <div className="flex flex-wrap gap-4 text-body-s text-textMain/80">
                    <label>
                        Precio: $
                        <input
                            type="number"
                            name="basePrice"
                            className="w-20 bg-transparent border-b"
                            value={formData.basePrice}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </label>
                    <label>
                        Duración:
                        <input
                            type="number"
                            name="duration"
                            className="w-12 bg-transparent border-b"
                            value={formData.duration}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />{" "}
                        min
                    </label>
                    <label>
                        Categoría:
                        <input
                            type="text"
                            name="category"
                            className="w-24 bg-transparent border-b"
                            value={formData.category}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </label>
                </div>
                {isEditing && (
                    <input
                        type="text"
                        name="image"
                        placeholder="URL de imagen"
                        className="w-full text-sm bg-transparent border rounded-md p-1"
                        value={formData.image}
                        onChange={handleChange}
                    />
                )}
            </div>
        </div>
    )
}

export default ServiceCard
