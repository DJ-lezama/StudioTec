// src/components/Calendar/AlternativeTimesCalendar.jsx
import React, { useState } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const AlternativeTimesCalendar = ({ onSelectAlternative, onCancel }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [step, setStep] = useState(1); // 1: seleccionar fecha, 2: seleccionar hora

    // Horarios disponibles
    const availableTimes = [
        '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00',
        '17:00', '18:00'
    ];

    // Función para generar los días del mes actual
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Función para obtener el día de la semana del primer día del mes (0-6, donde 0 es domingo)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Configuración de nombres de meses y días en español
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const days = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

    // Navegación entre meses
    const prevMonth = () => {
        setCurrentMonth(prev => {
            const prevMonth = new Date(prev);
            prevMonth.setMonth(prev.getMonth() - 1);
            return prevMonth;
        });
    };

    const nextMonth = () => {
        setCurrentMonth(prev => {
            const nextMonth = new Date(prev);
            nextMonth.setMonth(prev.getMonth() + 1);
            return nextMonth;
        });
    };

    // Formatear fecha para español
    const formatDateToSpanish = (date) => {
        return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
    };

    // Manejar selección de fecha
    const handleDateSelect = (day) => {
        if (day) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            setSelectedDate(date);
            setStep(2);
        }
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
            const date = new Date(selectedDate);
            onSelectAlternative({
                date: date.toISOString().split('T')[0],
                time: selectedTime,
                formatted: `${formatDateToSpanish(date)} a las ${selectedTime}`
            });
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else {
            onCancel();
        }
    };

    // Renderizar el calendario
    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const today = new Date();
        const calendarDays = [];

        // Añadir celdas vacías para los días antes del primer día del mes
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="h-8 w-8" />);
        }

        // Añadir los días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();
            const isPast = date < new Date(today.setHours(0, 0, 0, 0));

            calendarDays.push(
                <button
                    key={day}
                    onClick={() => !isPast && handleDateSelect(day)}
                    disabled={isPast}
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm
            ${isPast ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-secondary/10'}
            ${isToday ? 'border border-secondary text-secondary' : ''}
            ${selectedDate &&
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === month &&
                    selectedDate.getFullYear() === year
                        ? 'bg-secondary text-white'
                        : ''
                    }`}
                >
                    {day}
                </button>
            );
        }

        return calendarDays;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full max-w-md">
            {/* Encabezado */}
            <div className="bg-secondary text-white p-2 flex items-center justify-between">
                <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <h3 className="text-sm font-medium">
                        {step === 1 ? 'Seleccionar fecha' : 'Seleccionar hora'}
                    </h3>
                </div>
                {step === 2 && (
                    <button
                        onClick={() => setStep(1)}
                        className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded"
                    >
                        Cambiar fecha
                    </button>
                )}
            </div>

            {/* Selector de fecha */}
            {step === 1 && (
                <div className="p-2">
                    {/* Navegación del mes */}
                    <div className="flex justify-between items-center mb-2">
                        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
                        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Días de la semana */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                        {days.map(day => (
                            <div key={day} className="h-8 w-8 flex items-center justify-center text-xs text-gray-500">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Días del mes */}
                    <div className="grid grid-cols-7 gap-1">
                        {renderCalendar()}
                    </div>
                </div>
            )}

            {/* Selector de hora */}
            {step === 2 && (
                <div className="p-3">
                    <div className="mb-3">
                        <p className="text-xs text-textMain/70">Fecha seleccionada:</p>
                        <p className="text-sm font-medium">
                            {formatDateToSpanish(selectedDate)}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {availableTimes.map((time) => (
                            <button
                                key={time}
                                onClick={() => handleTimeSelect(time)}
                                className={`py-2 px-1 rounded text-sm flex items-center justify-center transition-colors
                  ${selectedTime === time
                                    ? 'bg-secondary text-white'
                                    : 'hover:bg-secondary/10 border border-gray-200'}`}
                            >
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{time}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Botones de acción */}
            <div className="border-t p-2 flex justify-between">
                <button
                    onClick={handleBack}
                    className="px-3 py-1 text-xs text-textMain border border-gray-300 rounded hover:bg-gray-50"
                >
                    {step === 1 ? 'Cancelar' : 'Volver'}
                </button>

                {step === 2 && (
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedTime}
                        className={`px-3 py-1 text-xs text-white rounded
              ${selectedTime
                            ? 'bg-secondary hover:bg-secondary/90'
                            : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                        Confirmar
                    </button>
                )}
            </div>
        </div>
    );
};

export default AlternativeTimesCalendar;