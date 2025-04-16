import React from "react"

function Button({
    type = "light",
    children,
    className = "",
    icon,
    iconPosition = "right",
    ...props
}) {
    const base =
        "px-4 py-2 text-sm font-medium border transition-all duration-200 flex items-center justify-center"

    // Estilos base originales
    const styles = {
        // Estilos originales
        light: "bg-primary text-textMain border-transparent hover:bg-primary/90",
        dark: "bg-textMain text-white border-transparent hover:bg-textMain/90",
        transparent:
            "bg-transparent text-textMain border-textMain hover:bg-textMain hover:text-white",

        // Nuevas variantes
        rounded:
            "bg-textMain text-white border-transparent hover:bg-textMain/90 rounded-full",
        roundedLight:
            "bg-primary text-textMain border-transparent hover:bg-primary/90 rounded-full",
        roundedTransparent:
            "bg-transparent text-textMain border-textMain hover:bg-textMain hover:text-white rounded-full",

        // Botón CTA (Call to Action) con efecto de hover mejorado
        cta: "bg-relevantButton text-white border-transparent hover:brightness-110 shadow-md hover:shadow-lg hover:-translate-y-1 rounded-full",

        // Botón de formulario con efecto diferente
        form: "bg-textMain text-white border-transparent hover:bg-opacity-90 rounded-md shadow transition-colors",
    }

    return (
        <button className={`${base} ${styles[type]} ${className}`} {...props}>
            {icon && iconPosition === "left" && (
                <span className="mr-2">{icon}</span>
            )}
            {children}
            {icon && iconPosition === "right" && (
                <span className="ml-2">{icon}</span>
            )}
        </button>
    )
}

export default Button
