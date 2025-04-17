import React from "react"

const SelectionCard = ({
    isSelected,
    onClick,
    primary,
    secondary = null,
    className = "",
}) => {
    return (
        <div
            className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                isSelected
                    ? "border-secondary bg-background"
                    : "border-gray-300 hover:border-secondary hover:bg-primary/10"
            } ${className}`}
            onClick={onClick}
        >
            <p className="font-medium text-textMain">{primary}</p>
            {secondary && <p className="text-sm text-gray-500">{secondary}</p>}
        </div>
    )
}

export default SelectionCard
