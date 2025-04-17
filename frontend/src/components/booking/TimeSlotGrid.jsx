import React from "react"

const TimeSlotGrid = ({ times, selectedTime, onSelectTime }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {times.map((time) => (
                <div
                    key={time}
                    className={`p-2 text-center border rounded-lg cursor-pointer transition-colors duration-200 ${
                        selectedTime === time
                            ? "border-secondary bg-background"
                            : "border-gray-200 hover:border-secondary hover:bg-primary/30"
                    }`}
                    onClick={() => onSelectTime(time)}
                >
                    {time}
                </div>
            ))}
        </div>
    )
}

export default TimeSlotGrid
