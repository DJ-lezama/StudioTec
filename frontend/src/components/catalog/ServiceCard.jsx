import React from "react"

function ServiceCard({ title, description, price, duration, imageUrl }) {
    const PLACEHOLDER_IMAGE =
        "https://i0.wp.com/port2flavors.com/wp-content/uploads/2022/07/placeholder-614.png?fit=1200%2C800&ssl=1"

    return (
        <div className="bg-primaryLight rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <div className="relative overflow-hidden h-48">
                <img
                    src={imageUrl || PLACEHOLDER_IMAGE}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-textMain/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-5">
                <h3 className="text-lg font-bold text-textMain mb-1">
                    {title}
                </h3>

                {duration && (
                    <div className="flex items-center text-body-xs text-textMain/60 mb-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>{duration}</span>
                    </div>
                )}

                <p className="text-sm text-textMain/70 mb-4 line-clamp-2">
                    {description}
                </p>

                <div className="flex justify-between items-center">
                    <span className="text-secondary font-bold">
                        ${price} MXN
                    </span>
                    <button className="text-sm bg-textMain text-white rounded-full px-4 py-1.5 hover:bg-secondary transition-colors duration-300">
                        Reservar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ServiceCard
