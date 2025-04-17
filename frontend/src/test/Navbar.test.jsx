import { render, screen } from "@testing-library/react"
import Navbar from "../components/navbar/Navbar.jsx"

describe("Navbar", () => {
    it("renders without crashing", () => {
        render(<Navbar />)
    })

    it("renders the navigation menu with all items as links", () => {
        render(<Navbar />)

        const expectedItems = [
            "Inicio",
            "¿Quiénes somos?",
            "Nuestro catálogo",
            "Agendar una cita",
        ]

        expectedItems.forEach((label) => {
            const link = screen.getByRole("link", { name: label })
            expect(link).toBeInTheDocument()
        })
    })
})
