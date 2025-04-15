import React from "react";
import Button from "../common/Button.jsx";

const SchedulePreview = ({ appointments, onClick }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-h4 font-heading font-semibold text-textMain">
        Próximas citas
      </h2>
      <div className="space-y-2 max-h-[44rem] overflow-y-auto pr-1">
        {appointments.map((appt, index) => (
          <div key={index} className="bg-secondary text-white p-3 rounded-md">
            <p className="font-bold">{appt.service}</p>
            <p>Hora - {appt.stylist}</p>
            <p>Clienta {appt.client}</p>
            <p>
              {new Date(appt.date).toLocaleDateString("es-MX", {
                dateStyle: "long",
              })}
            </p>
          </div>
        ))}
      </div>
      <Button type="dark" onClick={onClick} className={"w-full"}>
        Ver agenda completa
      </Button>
    </div>
  );
};

export default SchedulePreview;
