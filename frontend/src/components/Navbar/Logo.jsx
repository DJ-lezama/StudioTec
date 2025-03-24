import React from "react";

function Logo() {
    return (
        <div className="flex items-center gap-2 text-textMain">
            <div className="w-6 h-6">
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/6dd2e31ac8a97bfc1acc25dc2ebb448d10378a81?placeholderIfAbsent=true"
                    alt="Studio Tec Logo"
                    className="object-contain w-full h-full"
                />
            </div>
            <div className="flex flex-col">
                <h1 className="text-h4 font-heading font-bold leading-tight">Studio Tec</h1>
                <p className="text-subtitle-m font-body font-normal leading-tight">Belleza que inspira</p>
            </div>
        </div>
    );
}

export default Logo;
