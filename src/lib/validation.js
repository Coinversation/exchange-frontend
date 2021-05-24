import i18n from '@/i18n'

const ValidationError = { NONE: 1, EMPTY: 2, NOT_A_NUMBER: 3, NOT_POSITIVE: 4 }

export function validateNumberInput(input) {
    if (!input) {
        return ValidationError.EMPTY
    }
    const number = parseFloat(input)
    if (!number) {
        return ValidationError.NOT_A_NUMBER
    }
    if (number <= 0) {
        return ValidationError.NOT_POSITIVE
    }
    return ValidationError.NONE
}

export function formatError(error, name = i18n.tc('value')) {
    if (error === ValidationError.EMPTY)
        return `${name} ${i18n.tc('cannotBeEmpty')}`
    if (error === ValidationError.NOT_A_NUMBER)
        return `${name} ${i18n.tc('shouldBeNumber')}`
    if (error === ValidationError.NOT_POSITIVE)
        return `${name} ${i18n.tc('shouldBePositive')}`
    return ''
}
