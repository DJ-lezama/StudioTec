// src/components/DashboardWidgets.jsx
import React from "react";
import Button from "../common/Button.jsx";

function DashboardWidget({ title, value, subtitle, buttonText, onClick }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between border border-gray-200 min-h-[150px]">
      <div className="space-y-1">
        <h4 className="text-body-s text-textMain/60 uppercase tracking-wide font-semibold">
          {title}
        </h4>
        <p className="text-h2 font-heading text-primaryDark">{value}</p>
        <p className="text-body-m text-textMain/70">{subtitle}</p>
      </div>
      {buttonText && (
        <div className="pt-4">
          <Button type="dark" onClick={onClick}>
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}

export default DashboardWidget;
