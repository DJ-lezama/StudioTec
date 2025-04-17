import React from "react"

const CalendarGrid = ({
    currentMonth,
    selectedDate,
    onDateClick,
    getDaysInMonth,
    getFirstDayOfMonth,
    isToday,
    isPastDate,
}) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const renderDays = () => {
        const days = []

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-9"></div>)
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day)
            const isSelectedDay =
                selectedDate &&
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear()

            const isTodayDate = isToday(date)
            const isPast = isPastDate(date)

            days.push(
                <button
                    key={day}
                    onClick={() => !isPast && onDateClick(date)}
                    disabled={isPast}
                    className={`h-9 rounded-full flex items-center justify-center text-sm transition-colors ${
                        isSelectedDay
                            ? "bg-secondary text-white"
                            : isTodayDate
                              ? "bg-primary text-textMain"
                              : isPast
                                ? "text-gray-300 cursor-not-allowed"
                                : "hover:bg-gray-100 text-textMain"
                    }`}
                >
                    {day}
                </button>,
            )
        }

        return days
    }

    return (
        <div>
            {/* Days of the week */}
            <div className="grid grid-cols-7 mb-2 text-center">
                {["D", "L", "M", "M", "J", "V", "S"].map((day, i) => (
                    <div key={i} className="text-xs font-medium text-gray-500">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
        </div>
    )
}

export default CalendarGrid
