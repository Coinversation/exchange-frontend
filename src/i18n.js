import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '@/locales'

Vue.use(VueI18n)

const locale = 'en-US'

// const messages = {
//     en: {
//         menu: {
//             dashboard: 'Dashboard',
//             explorePools: 'Explore pools',
//             createPool: 'Create a pool',
//             exchange: 'Exchange',
//         },
//     },
//     es: {
//         menu: {
//             dashboard: 'Tablero',
//         },
//     },
//     pl: {
//         menu: {
//             dashboard: 'Tablica',
//         },
//     },
// }

export default new VueI18n({
    locale,
    fallbackLocale: 'en',
    messages,
    dateTimeFormats: {
        'en-US': {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
            },
            long: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            },
        },
    },
})

// function getBrowserLocale() {
//     const navigatorLocale =
//         navigator.languages !== undefined
//             ? navigator.languages[0]
//             : navigator.language

//     if (!navigatorLocale) {
//         return undefined
//     }

//     return navigatorLocale.trim().split(/-|_/)[0]
// }
