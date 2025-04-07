import React from "react";
import Button from "../common/Button.jsx";

const StatWidget = ({ title, value, subtitle, buttonText, onClick }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-h4 font-heading">{title}</h3>
        <p className="text-h2 text-primaryDark font-bold">{value}</p>
        <p className="text-body-m text-textMain/70">{subtitle}</p>
      </div>
      <Button type="dark" onClick={onClick} className="mt-4">
        {buttonText}
      </Button>
    </div>
  );
};

export default StatWidget;
