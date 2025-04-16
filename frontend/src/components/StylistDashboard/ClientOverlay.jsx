import React from "react";
import { X } from "lucide-react";

const ClientOverlay = ({ client, onClose }) => {
  if (!client) return null;

  return (
      <div className="fixed inset-0 z-50 bg-black/30 flex justify-end">
        <div className="w-full sm:max-w-md bg-white h-full shadow-lg p-6 overflow-y-auto relative">
          <button
              onClick={onClose}
              className="absolute top-4 right-4 text-textMain hover:text-primary transition"
              aria-label="Cerrar panel de cliente"
          >
            <X size={20} />
          </button>

          <h2 className="text-h3 font-heading font-bold mb-4">{client.name}</h2>

          <div className="space-y-2 mb-6">
            <p>
              <span className="font-bold">Email:</span> {client.email}
            </p>
            <p>
              <span className="font-bold">Teléfono:</span> {client.phone}
            </p>
            <p>
              <span className="font-bold">Cumpleaños:</span> {client.birthday}
            </p>
          </div>

          <div>
            <h3 className="text-h5 font-semibold mb-2">Historial de citas</h3>
            {client.history && client.history.length > 0 ? (
                <ul className="space-y-3">
                  {client.history.map((appt, i) => (
                      <li key={i} className="border rounded-lg p-3 bg-primary/10">
                        <p>
                          <strong>Servicio:</strong> {appt.service}
                        </p>
                        <p>
                          <strong>Fecha:</strong> {appt.date}
                        </p>
                        <p>
                          <strong>Estilista:</strong> {appt.stylist}
                        </p>
                      </li>
                  ))}
                </ul>
            ) : (
                <p className="text-sm text-textMain/60">
                  No hay citas anteriores registradas.
                </p>
            )}
          </div>
        </div>
      </div>
  );
};

export default ClientOverlay;