import React from "react"

const InfoField = ({ label, value, isFullWidth = false }) => {
    return (
        <div
            className={`p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 ${isFullWidth ? "md:col-span-2" : ""}`}
        >
            <div className="sm:col-span-1">
                <h4 className="text-sm font-medium text-gray-500">{label}</h4>
            </div>
            <div className="sm:col-span-2">
                <p className="text-body-m text-textMain">{value}</p>
            </div>
        </div>
    )
}

export default InfoField
