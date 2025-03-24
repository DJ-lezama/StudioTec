// src/components/Button.jsx
function Button({ type = "light", children }) {
    const base = "px-4 py-2 text-sm font-medium border transition-colors duration-200";

    const styles = {
        light: "bg-primary text-textMain border-transparent hover:bg-primary/90",
        dark: "bg-textMain text-white border-transparent hover:bg-textMain/90",
        transparent: "bg-transparent text-textMain border-textMain hover:bg-textMain hover:text-white",
    };

    return (
        <button className={`${base} ${styles[type]}`}>
            {children}
        </button>
    );
}

export default Button;
