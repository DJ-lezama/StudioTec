import React from "react";
import Button from "../Button";

function RequestCard({ id, service, stylist, time, date, client }) {
    return (
        <div className="relative bg-white rounded-xl shadow-md p-6 flex justify-between items-center border border-gray-200 overflow-hidden">
            {/* Left stripe */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-secondary rounded-l-xl" />

            <div className="space-y-2 font-body text-textMain max-w-[70%] pl-2">
                <h3 className="font-heading font-semibold text-h5 text-primaryDark">
                    Solicitud {id}
                </h3>
                <p className="text-body-m font-semibold text-secondaryDark">
                    {service}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-body-s text-textMain/80">
                    <span>Estilista: {stylist}</span>
                    <span>{time}</span>
                    <span>{date}</span>
                </div>
                <p className="text-body-s text-textMain/70">Cliente: {client}</p>
            </div>
            <div className="ml-4">
                <Button type="dark">Revisar solicitud</Button>
            </div>
        </div>
    );
}

export default RequestCard;
