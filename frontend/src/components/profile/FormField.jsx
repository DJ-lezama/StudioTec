import React from "react"

const FormField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    disabled = false,
    placeholder = "",
    helpText = "",
}) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-textMain mb-2">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full p-3 border border-gray-300 rounded-lg ${
                    disabled
                        ? "bg-gray-50"
                        : "focus:ring-2 focus:ring-primary focus:border-primary"
                }`}
            />
            {helpText && (
                <p className="text-xs text-gray-500 mt-1">{helpText}</p>
            )}
        </div>
    )
}

export default FormField
