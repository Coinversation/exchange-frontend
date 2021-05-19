import config from '@/config'
import BigNumber from '@/plugin/bignumber'

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

export function bnum(val) {
    const number = typeof val === 'string' ? val : val ? val.toString() : '0'
    return new BigNumber(number)
}

export function scale(input, decimalPlaces) {
    const scalePow = new BigNumber(decimalPlaces.toString())
    const scaleMul = new BigNumber(10).pow(scalePow)
    return input.times(scaleMul)
}

export function normalizeBalance(amount, tokenDecimals) {
    return scale(bnum(amount), -tokenDecimals)
}
