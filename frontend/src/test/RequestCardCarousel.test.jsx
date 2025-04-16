import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import RequestCardCarousel from "../components/RequestsVisualizer/RequestCardCarousel.jsx"

const mockRequests = [
    {
        id: "123456",
        title: "Limpieza de orzuela + Corte",
        stylist: "Estilista A",
        time: "16:40",
        date: "23 de Marzo de 2025",
        client: "Alina Porras",
    },
    {
        id: "234567",
        title: "Limpieza de orzuela + Corte",
        stylist: "Estilista A",
        time: "16:40",
        date: "23 de Marzo de 2025",
        client: "Alina Porras",
    },
]

describe("RequestCardCarousel", () => {
    it("renders all request cards passed in props", () => {
        render(<RequestCardCarousel requests={mockRequests} />)

        // Use regex or partial match
        expect(screen.getByText(/Solicitud\s+123456/)).toBeInTheDocument()
        expect(screen.getByText(/Solicitud\s+234567/)).toBeInTheDocument()
    })
})
