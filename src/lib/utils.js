import config from '@/config'

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

export function getTokenBySymbol(symbol) {
    const tokenAddresses = Object.keys(config.tokens)
    const tokenAddress = tokenAddresses.find(
        (tokenAddress) => config.tokens[tokenAddress].symbol === symbol
    )
    return config.tokens[tokenAddress]
}
