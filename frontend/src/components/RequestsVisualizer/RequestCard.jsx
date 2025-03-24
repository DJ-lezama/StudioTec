import React from "react";
import Button from "../Button";

function RequestCard({ id, service, stylist, time, date, client }) {
    return (
        <div className="bg-primary flex justify-between items-center p-6 shadow-md border-l-8 border-textMain">
            <div className="space-y-2 font-body text-textMain">
                <h3 className="font-heading font-semibold text-lg">
                    Solicitud {id}: {service}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm">
                    <span>Estilista: {stylist}</span>
                    <span>{time}</span>
                    <span>{date}</span>
                </div>
                <p className="text-sm">Cliente: {client}</p>
            </div>
            <div>
                <Button type="dark">Revisar solicitud</Button>
            </div>
        </div>
    );
}

export default RequestCard;
