export function saveState(key, state) {
    window.localStorage.setItem(key, JSON.stringify(state))
}

export function jsonParse(input, fallback) {
    try {
        return JSON.parse(input)
    } catch (err) {
        return fallback || undefined
    }
}
