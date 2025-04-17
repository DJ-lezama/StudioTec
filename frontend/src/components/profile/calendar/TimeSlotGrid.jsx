import React from "react"

const TimeSlotGrid = ({ availableTimes, selectedTime, onTimeSelect }) => {
    return (
        <div className="grid grid-cols-3 gap-2">
            {availableTimes.map((time) => (
                <button
                    key={time}
                    onClick={() => onTimeSelect(time)}
                    className={`p-2 rounded border text-sm ${
                        selectedTime === time
                            ? "bg-secondary text-white border-secondary"
                            : "border-gray-300 hover:border-primary hover:bg-primary/10"
                    }`}
                >
                    {time}
                </button>
            ))}
        </div>
    )
}

export default TimeSlotGrid
