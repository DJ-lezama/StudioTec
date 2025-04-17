import React from "react"

const ProgressSteps = ({ currentStep, totalSteps }) => {
    return (
        <div className="flex mb-8">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex-1 flex flex-col items-center">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                            currentStep === step
                                ? "bg-secondary text-white"
                                : "bg-gray-200 text-gray-500"
                        }`}
                    >
                        {step}
                    </div>
                    <div
                        className={`h-1 ${step < totalSteps ? "w-full" : "w-0"} ${
                            step <= currentStep ? "bg-secondary" : "bg-gray-200"
                        }`}
                    />
                </div>
            ))}
        </div>
    )
}

export default ProgressSteps
