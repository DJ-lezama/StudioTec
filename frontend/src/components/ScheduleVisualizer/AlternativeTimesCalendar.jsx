import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

const AlternativeTimesCalendar = ({ onSelectAlternative, onCancel }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [step, setStep] = useState(1); // 1: seleccionar fecha, 2: seleccionar hora

    // Función auxiliar para dar formato a las fechas en español
    const formatDateToSpanish = (date) => {
        const months = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];

        const days = [
            'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'
        ];

        return {
            dayName: days[date.getDay()],
            dayNumber: date.getDate(),
            month: months[date.getMonth()],
            fullDate: date.toISOString().split('T')[0],
            formattedFull: `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`
        };
    };

    // Generar fechas disponibles (próximos 14 días)
    const generateAvailableDates = () => {
        const today = new Date();
        const dates = [];

        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(formatDateToSpanish(date));
        }

        return dates;
    };

    const availableDates = generateAvailableDates();

    // Horarios disponibles (ejemplo)
    const availableTimes = [
        '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00',
        '17:00', '18:00'
    ];

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setStep(2);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
            onSelectAlternative({
                date: selectedDate.fullDate,
                time: selectedTime,
                formatted: `${selectedDate.formattedFull} a las ${selectedTime}`
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

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {/* Encabezado */}
            <div className="bg-secondary text-white p-4 flex items-center">
                <Calendar className="mr-2 w-5 h-5" />
                <h3 className="font-medium">
                    {step === 1 ? 'Seleccionar fecha alternativa' : 'Seleccionar horario'}
                </h3>
            </div>

            {/* Selector de fecha */}
            {step === 1 && (
                <div className="p-4">
                    <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                        {availableDates.map((date) => (
                            <button
                                key={date.fullDate}
                                onClick={() => handleDateSelect(date)}
                                className={`p-2 rounded-lg text-center transition-colors
                  ${selectedDate?.fullDate === date.fullDate
                                    ? 'bg-secondary text-white'
                                    : 'hover:bg-secondary/10 border border-gray-200'}`}
                            >
                                <div className="text-xs uppercase">{date.dayName}</div>
                                <div className="text-xl font-bold">{date.dayNumber}</div>
                                <div className="text-xs">{date.month}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Selector de hora */}
            {step === 2 && (
                <div className="p-4">
                    <div className="mb-4">
                        <p className="text-sm text-textMain/70">Fecha seleccionada:</p>
                        <p className="font-semibold">
                            {selectedDate.formattedFull}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {availableTimes.map((time) => (
                            <button
                                key={time}
                                onClick={() => handleTimeSelect(time)}
                                className={`p-3 rounded-lg flex items-center justify-center transition-colors
                  ${selectedTime === time
                                    ? 'bg-secondary text-white'
                                    : 'hover:bg-secondary/10 border border-gray-200'}`}
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                <span>{time}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Botones de acción */}
            <div className="border-t p-4 flex justify-between">
                <button
                    onClick={handleBack}
                    className="px-4 py-2 text-sm font-medium text-textMain border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    {step === 1 ? 'Cancelar' : 'Volver'}
                </button>

                {step === 2 && (
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedTime}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md
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