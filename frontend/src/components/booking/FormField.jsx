import React from "react"

const FormField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder = "",
    required = false,
    readOnly = false,
    className = "",
    min,
    max,
    rows,
}) => {
    const readOnlyClasses = readOnly
        ? "bg-gray-100 text-gray-500 cursor-not-allowed focus:ring-0"
        : "focus:ring-2 focus:ring-secondary"
    const inputClasses = `w-full p-3 border border-gray-300 rounded-lg focus:outline-none ${readOnlyClasses}`

    return (
        <div className={className}>
            <label className="block text-textMain font-medium mb-2">
                {label}{" "}
                {required && !readOnly && (
                    <span className="text-red-500">*</span>
                )}
            </label>
            {type === "textarea" ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={inputClasses}
                    placeholder={placeholder}
                    required={required && !readOnly}
                    rows={rows || 3}
                    readOnly={readOnly}
                    tabIndex={readOnly ? -1 : 0}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={inputClasses}
                    placeholder={placeholder}
                    required={required && !readOnly}
                    min={min}
                    max={max}
                    readOnly={readOnly}
                    tabIndex={readOnly ? -1 : 0}
                />
            )}
        </div>
    )
}

export default FormField
