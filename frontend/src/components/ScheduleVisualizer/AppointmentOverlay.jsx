// src/components/StylistDashboard/RequestReviewOverlay.jsx
import React, { useState } from "react";
import Button from "../../components/common/Button.jsx";
import AlternativeTimesCalendar from "./AlternativeTimesCalendar.jsx";

const AppointmentDetailsOverlay = ({ request, onClose, onRespond }) => {
  const [decision, setDecision] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [alternativeTime, setAlternativeTime] = useState(null);

  if (!request) return null;

  const handleSelectAlternative = (timeOption) => {
    setAlternativeTime(timeOption);
    setShowCalendar(false);
    setSuggestion(
        `Lamentamos no poder atenderte en el horario solicitado. ¿Te gustaría agendar para el ${timeOption.formatted}?`
    );
  };

  const handleSubmitDecision = () => {
    // Aquí iría la lógica para enviar la decisión al backend
    const responseData = {
      requestId: request.id,
      decision,
      suggestion: suggestion || null,
      alternativeTime: alternativeTime || null
    };

    console.log("Enviando respuesta:", responseData);

    // Si hay un callback de respuesta, lo llamamos con los datos
    if (typeof onRespond === 'function') {
      onRespond(responseData);
    }

    // Simulación de éxito
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
        <div className="w-full sm:w-[400px] h-full bg-white shadow-lg flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button onClick={onClose} className="text-xl font-bold">
              ←
            </button>
            <h2 className="text-subtitle-m font-heading font-semibold text-textMain">
              Revisar solicitud
            </h2>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            <div>
              <h3 className="text-body-m font-semibold text-textMain mb-1">
                Información de cita
              </h3>
              <p className="text-sm text-textMain">Servicio: {request.service}</p>
              <p className="text-sm text-textMain">Fecha: {request.date}</p>
              <p className="text-sm text-textMain">Hora: {request.time}</p>
              <p className="text-sm text-textMain">
                Estilista: {request.stylist}
              </p>
            </div>

            <div>
              <h4 className="text-body-m font-semibold text-textMain mb-2">
                Imágenes adjuntas
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {request.hairImage && (
                    <img
                        src={request.hairImage}
                        alt="Cabello actual"
                        className="rounded-lg w-full h-32 object-cover"
                    />
                )}
                {request.referenceImage && (
                    <img
                        src={request.referenceImage}
                        alt="Referencia"
                        className="rounded-lg w-full h-32 object-cover"
                    />
                )}
              </div>
            </div>

            {/* Sección del calendario (aparece al elegir "suggest") */}
            {showCalendar && (
                <div className="my-4">
                  <AlternativeTimesCalendar
                      onSelectAlternative={handleSelectAlternative}
                      onCancel={() => setShowCalendar(false)}
                  />
                </div>
            )}

            {!showCalendar && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-textMain">
                    Acción
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                          type="radio"
                          name="action"
                          checked={decision === "accept"}
                          onChange={() => {
                            setDecision("accept");
                            setSuggestion("");
                            setAlternativeTime(null);
                          }}
                      />{" "}
                      Aceptar
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                          type="radio"
                          name="action"
                          checked={decision === "reject"}
                          onChange={() => {
                            setDecision("reject");
                            setSuggestion("");
                            setAlternativeTime(null);
                          }}
                      />{" "}
                      Rechazar
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                          type="radio"
                          name="action"
                          checked={decision === "suggest"}
                          onChange={() => {
                            setDecision("suggest");
                            setAlternativeTime(null);
                          }}
                      />{" "}
                      Hacer sugerencias
                    </label>
                  </div>
                </div>
            )}

            {decision === "suggest" && !showCalendar && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-textMain">
                      Sugerencia
                    </label>
                    <Button
                        type="transparent"
                        className="text-xs"
                        onClick={() => setShowCalendar(true)}
                    >
                      Proponer horario alternativo
                    </Button>
                  </div>

                  {alternativeTime && (
                      <div className="bg-primary/20 p-3 rounded-lg text-sm">
                        <p className="font-medium">Horario alternativo propuesto:</p>
                        <p>{alternativeTime.formatted}</p>
                      </div>
                  )}

                  <textarea
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      placeholder="Escribe tus sugerencias aquí..."
                      value={suggestion}
                      onChange={(e) => setSuggestion(e.target.value)}
                      rows="4"
                  />
                </div>
            )}

            {!showCalendar && (
                <div className="pt-4 space-y-3">
                  {alternativeTime && (
                      <div className="flex justify-end">
                        <Button
                            type="transparent"
                            onClick={() => setShowCalendar(true)}
                            className="text-sm"
                        >
                          Cambiar horario propuesto
                        </Button>
                      </div>
                  )}

                  <Button
                      type="dark"
                      onClick={handleSubmitDecision}
                      disabled={!decision || (decision === "suggest" && !suggestion)}
                      className="w-full"
                  >
                    {decision === "accept" ? "Aceptar solicitud" :
                        decision === "reject" ? "Rechazar solicitud" :
                            alternativeTime ? "Enviar propuesta de horario" : "Enviar sugerencia"}
                  </Button>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default AppointmentDetailsOverlay;