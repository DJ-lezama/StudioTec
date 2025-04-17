import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CalendarHeader = ({ currentMonth, onPrevMonth, onNextMonth }) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <button
                onClick={onPrevMonth}
                className="p-1 rounded-full hover:bg-gray-100"
            >
                <ChevronLeft size={20} />
            </button>

            <span className="text-textMain font-medium">
                {currentMonth.toLocaleDateString("es-MX", {
                    month: "long",
                    year: "numeric",
                })}
            </span>

            <button
                onClick={onNextMonth}
                className="p-1 rounded-full hover:bg-gray-100"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    )
}

export default CalendarHeader
