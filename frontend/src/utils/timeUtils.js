/**
 * Parses a time interval string "HH:mm-HH:mm" into start and end times.
 * Returns default values and an error message if parsing fails.
 * @param {string | null | undefined} intervalString - The interval string to parse.
 * @returns {{start: string, end: string, error: string | null}}
 */
export const parseInterval = (intervalString) => {
    const defaultStart = "09:00"
    const defaultEnd = "17:00"

    if (!intervalString || typeof intervalString !== "string") {
        return {
            start: defaultStart,
            end: defaultEnd,
            error: "Intervalo no proporcionado",
        }
    }
    const parts = intervalString.split("-")
    if (parts.length !== 2 || !parts[0]?.trim() || !parts[1]?.trim()) {
        console.warn(`Invalid interval format: ${intervalString}`)
        return {
            start: parts[0] || defaultStart,
            end: parts[1] || defaultEnd,
            error: "Formato debe ser HH:mm-HH:mm",
        }
    }
    const start = parts[0].trim()
    const end = parts[1].trim()

    if (!isValidTime(start) || !isValidTime(end)) {
        return { start, end, error: "Hora inválida en intervalo" }
    }
    if (end <= start) {
        return { start, end, error: "Fin debe ser posterior al inicio" }
    }

    return { start, end, error: null }
}

/**
 * Validates if a string is in "HH:mm" format.
 * @param {string} timeString - The time string to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
export const isValidTime = (timeString) => {
    if (!timeString || typeof timeString !== "string") return false
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeString)
}
