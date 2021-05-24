import numeral from 'numeral'
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

export function toWei(val) {
    return BigNumber(scale(bnum(val.toString()), 18).integerValue())
}

export function normalizeBalance(amount, tokenDecimals) {
    return scale(bnum(amount), -tokenDecimals)
}

// export function normalizeBalance(amount, tokenDecimals) {
//     BigNumber{}
//     return scale(bnum(amount), -tokenDecimals)
// }

export function formatNumber(number, key) {
    if (number === 0) return '-'

    if (number < 0.0001) number = 0

    let format = '0.[000]'
    if (number > 1000) format = '0.[0]a'
    if (number < 1) format = '0.[0000]'

    if (key === 'long') {
        format = '0,000.[00]'
        if (number < 1) format = '0.[0000]'
    }

    if (key === 'usd') {
        format = '$(0.[00])'
        if (number > 1000) format = '$(0.[0]a)'
        if (number < 1) format = '$(0.[0000])'
    }

    if (key === 'usd-long') {
        format = '$(0,000.[00])'
        if (number < 1) format = '$(0.[0000])'
    }

    if (key === 'percent') format = '(0.[00])%'
    if (key === 'percent-short') format = '(0)%'

    return numeral(number)
        .format(format)
        .toUpperCase()
}
