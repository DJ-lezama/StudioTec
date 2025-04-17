/**
 * Datos de muestra para el catálogo de servicios
 * En un entorno real, estos datos vendrían de una API o base de datos
 */

// TODO: Delete this file when we finish removing their usage and transitioning to API
const catalogData = {
    hair: [
        {
            id: "h1",
            title: "Corte de cabello",
            description:
                "Corte personalizado según la forma de tu rostro y tipo de cabello",
            price: "350",
            duration: "45 min",
            imageUrl:
                "https://images.unsplash.com/photo-1560869713-7d82c7c64868?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
        },
        {
            id: "h2",
            title: "Peinado",
            description:
                "Peinados para eventos especiales, bodas y ocasiones importantes",
            price: "450",
            duration: "60 min",
            imageUrl:
                "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
        },
        {
            id: "h3",
            title: "Coloración",
            description:
                "Técnicas de color personalizadas para realzar tu belleza natural",
            price: "750",
            duration: "120 min",
            imageUrl:
                "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
        },
        {
            id: "h4",
            title: "Tratamiento capilar",
            description:
                "Tratamientos hidratantes y reparadores para todo tipo de cabello",
            price: "550",
            duration: "45 min",
            imageUrl:
                "https://images.unsplash.com/photo-1580618864527-0869fced739a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
        },
        {
            id: "h5",
            title: "Lavado y secado",
            description:
                "Lavado profesional con productos de alta calidad y secado con estilo",
            price: "280",
            duration: "30 min",
            imageUrl:
                "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80",
        },
        {
            id: "h6",
            title: "Balayage",
            description:
                "Técnica de coloración que crea un efecto degradado y natural",
            price: "850",
            duration: "150 min",
            imageUrl:
                "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
        },
    ],
    nails: [
        {
            id: "n1",
            title: "Manicure básico",
            description:
                "Cuidado completo para tus manos con los mejores productos",
            price: "250",
            duration: "40 min",
            imageUrl:
                "https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
        },
        {
            id: "n2",
            title: "Pedicure spa",
            description:
                "Tratamiento completo para pies cansados o maltratados con exfoliación",
            price: "300",
            duration: "50 min",
            imageUrl:
                "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        },
        {
            id: "n3",
            title: "Uñas acrílicas",
            description:
                "Extensiones de uñas acrílicas con diseño personalizado",
            price: "400",
            duration: "90 min",
            imageUrl:
                "https://images.unsplash.com/photo-1632344499878-a4a24f702944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        },
        {
            id: "n4",
            title: "Uñas de gel",
            description:
                "Manicure con esmalte de gel para una duración de hasta 3 semanas",
            price: "350",
            duration: "60 min",
            imageUrl:
                "https://images.unsplash.com/photo-1607779097040-f06bad5de669?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
        },
        {
            id: "n5",
            title: "Nail art",
            description:
                "Diseños artísticos y decoración detallada para tus uñas",
            price: "150",
            duration: "40 min",
            imageUrl:
                "https://images.unsplash.com/photo-1631731908417-a8b2ee3c245c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
        },
    ],
    eyebrows: [
        {
            id: "e1",
            title: "Depilación de cejas",
            description: "Diseño de cejas con hilo para una forma perfecta",
            price: "180",
            duration: "25 min",
            imageUrl:
                "https://images.unsplash.com/photo-1594641976175-5d1255afef16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
        },
        {
            id: "e2",
            title: "Tinte de cejas",
            description:
                "Tinte profesional para dar definición y color a tus cejas",
            price: "220",
            duration: "30 min",
            imageUrl:
                "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        },
        {
            id: "e3",
            title: "Laminado de cejas",
            description:
                "Tratamiento para fijar y dar forma natural a las cejas rebeldes",
            price: "350",
            duration: "45 min",
            imageUrl:
                "https://images.unsplash.com/photo-1572872202671-dc8bd60080ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        },
        {
            id: "e4",
            title: "Limpieza facial",
            description:
                "Tratamiento completo para purificar y revitalizar tu piel",
            price: "480",
            duration: "60 min",
            imageUrl:
                "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        },
        {
            id: "e5",
            title: "Extensiones de pestañas",
            description:
                "Aplicación profesional de pestañas pelo a pelo para una mirada intensa",
            price: "650",
            duration: "90 min",
            imageUrl:
                "https://images.unsplash.com/photo-1516914589923-f105f1535f88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        },
        {
            id: "e6",
            title: "Lifting de pestañas",
            description:
                "Tratamiento que da curvatura y volumen a tus pestañas naturales",
            price: "400",
            duration: "50 min",
            imageUrl:
                "https://images.unsplash.com/photo-1568653480918-d3a00ed1dacc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        },
    ],
}

// Configuración de categorías
export const categoryConfig = {
    hair: { label: "Cabello", icon: "Scissors" },
    nails: { label: "Uñas", icon: "Hand" },
    eyebrows: { label: "Cara", icon: "Eye" },
}

export default catalogData
