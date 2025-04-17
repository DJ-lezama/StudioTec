import React from "react"

const ToggleSwitch = ({ label, description, defaultChecked = false }) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h5 className="text-sm font-medium text-textMain">{label}</h5>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={defaultChecked}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
            </label>
        </div>
    )
}

export default ToggleSwitch
