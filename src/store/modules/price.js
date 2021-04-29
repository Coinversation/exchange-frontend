import Vue from 'vue'
// import { getAddress } from '@ethersproject/address'
import { addressEq } from '@polkadot/util-crypto'

import config from '@/config'

// const ENDPOINT = 'https://api.coingecko.com/api/v3'

const state = {
    values: {},
}

const mutations = {
    GET_PRICE_REQUEST() {
        console.debug('GET_PRICE_REQUEST')
    },
    GET_PRICE_SUCCESS(_state, payload) {
        for (const address in payload) {
            const price = payload[address]
            Vue.set(_state.values, address, price)
        }
        console.debug('GET_PRICE_SUCCESS')
    },
}

const actions = {
    loadPricesById: async ({ commit }, payload) => {
        console.log(26, payload)
        commit('GET_PRICE_REQUEST')
        let data = {
            '0x': {
                usd: 1.7,
            },
            havven: {
                usd: 16.99,
            },
            'usd-coin': {
                usd: 1,
            },
            'basic-attention-token': {
                usd: 1.2,
            },
            dai: {
                usd: 1,
            },
            'wrapped-bitcoin': {
                usd: 54494,
            },
            weth: {
                usd: 2723.35,
            },
            maker: {
                usd: 4340.71,
            },
            aragon: {
                usd: 9.16,
            },
            augur: {
                usd: 36.67,
            },
        }
        const idToAddressMap = {}
        for (const address in config.tokens) {
            const id = config.tokens[address].id
            if (!id) {
                continue
            }
            idToAddressMap[id] = address
        }
        const prices = {
            '0xccb0F4Cf5D3F97f4a55bb5f5cA321C3ED033f244': 1.7,
            '0x86436BcE20258a6DcfE48C9512d4d49A30C4d8c4': 16.99,
            '0x2F375e94FC336Cdec2Dc0cCB5277FE59CBf1cAe5': 1,
            '0x1f1f156E0317167c11Aa412E3d1435ea29Dc3cCE': 1.2,
            '0x1528F3FCc26d13F7079325Fb78D9442607781c8C': 1,
            '0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb': 54494,
            '0xd0A1E359811322d97991E03f863a0C30C2cF029C': 2723.35,
            '0xef13C0c8abcaf5767160018d268f9697aE4f5375': 4340.71,
            '0x37f03a12241E9FD3658ad6777d289c3fb8512Bc9': 9.16,
            '0x8c9e6c40d3402480ACE624730524fACC5482798c': 36.67,
        }
        for (const id in data) {
            const price = data[id].usd
            const address = idToAddressMap[id]
            prices[address] = price
        }
        commit('GET_PRICE_SUCCESS', prices)
    },
    loadPricesByAddress: async ({ commit }, payload) => {
        commit('GET_PRICE_REQUEST')
        // const contractString = payload.join('%2C')
        let data = {
            '0x': {
                usd: 1.7,
            },
            havven: {
                usd: 16.99,
            },
            'usd-coin': {
                usd: 1,
            },
            'basic-attention-token': {
                usd: 1.2,
            },
            dai: {
                usd: 1,
            },
            'wrapped-bitcoin': {
                usd: 54494,
            },
            weth: {
                usd: 2723.35,
            },
            maker: {
                usd: 4340.71,
            },
            aragon: {
                usd: 9.16,
            },
            augur: {
                usd: 36.67,
            },
        }
        const prices = {
            '0xccb0F4Cf5D3F97f4a55bb5f5cA321C3ED033f244': 1.7,
            '0x86436BcE20258a6DcfE48C9512d4d49A30C4d8c4': 16.99,
            '0x2F375e94FC336Cdec2Dc0cCB5277FE59CBf1cAe5': 1,
            '0x1f1f156E0317167c11Aa412E3d1435ea29Dc3cCE': 1.2,
            '0x1528F3FCc26d13F7079325Fb78D9442607781c8C': 1,
            '0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb': 54494,
            '0xd0A1E359811322d97991E03f863a0C30C2cF029C': 2723.35,
            '0xef13C0c8abcaf5767160018d268f9697aE4f5375': 4340.71,
            '0x37f03a12241E9FD3658ad6777d289c3fb8512Bc9': 9.16,
            '0x8c9e6c40d3402480ACE624730524fACC5482798c': 36.67,
        }
        for (const address in data) {
            const price = data[address].usd
            prices[addressEq(address)] = price
        }
        commit('GET_PRICE_SUCCESS', prices)
    },
}

export default {
    state,
    mutations,
    actions,
}
