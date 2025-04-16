// src/test/ReviewCarousel.test.jsx
import { render, screen } from "@testing-library/react"
import ReviewsCarousel from "../components/ReviewsVisualizer/ReviewsCarousel.jsx"

describe("ReviewsCarousel", () => {
    it("renders all reviews", () => {
        render(<ReviewsCarousel />)
        expect(screen.getByText("María Treviño")).toBeInTheDocument()
        expect(screen.getByText("Grecia González")).toBeInTheDocument()
    })
})
