import Vue from 'vue'
import config from '@/config'
import { lsGet, lsRemove, lsSet } from '@/lib/localStorage'

import { ContractPromise } from '@polkadot/api-contract'
import { Option, Raw } from '@polkadot/types'
import abi from '../../abi/pat_standard.json'
import { useApi , useChainInfo  } from '../../helps'

import {
    isWeb3Injected,
    web3Accounts,
    web3Enable,
    web3FromAddress,
} from '@polkadot/extension-dapp'

const state = {
    injectedLoaded: false,
    blockNumber: 0,
    account: null,
    name: null,
    active: false,
    balances: lsGet('balances') || {},
    allowances: {},
    tokenMetadata: lsGet('tokenMetadata') || {},
    userInfo: lsGet('userInfo') || {},
    chain: null,
    genesisHash: null,
    metaCalls: null,
    specVersion: 0,
    ss58Format: 0,
    tokenDecimals: 10,
    tokenSymbol:null
}
let api
const mutations = {
    LOGOUT(_state) {
        Vue.set(_state, 'injectedLoaded', false)
        Vue.set(_state, 'account', null)
        Vue.set(_state, 'name', null)
        Vue.set(_state, 'active', false)
        Vue.set(_state, 'balances', {})
        lsSet('balances', {})
        Vue.set(_state, 'allowances', {})
        Vue.set(_state, 'userInfo', {})
        lsSet('userInfo', {})
        Vue.set(_state, 'chain', null)
        Vue.set(_state, 'genesisHash', null)
        Vue.set(_state, 'metaCalls', null)
        Vue.set(_state, 'specVersion', 0)
        Vue.set(_state, 'ss58Format', 0)
        Vue.set(_state, 'tokenDecimals', 10)
        Vue.set(_state, 'tokenSymbol', null)
        console.debug('LOGOUT')
        // lsRemove()
    },
    LOAD_TOKEN_METADATA_REQUEST() {
        console.debug('LOAD_TOKEN_METADATA_REQUEST')
    },
    LOAD_TOKEN_METADATA_SUCCESS(_state, payload) {
        for (const address in payload) {
            Vue.set(_state.tokenMetadata, address, payload[address])
            lsSet('tokenMetadata', payload)
        }
        console.debug('LOAD_TOKEN_METADATA_SUCCESS')
    },
    LOAD_TOKEN_METADATA_FAILURE(_state, payload) {
        console.debug('LOAD_TOKEN_METADATA_FAILURE', payload)
    },
    LOAD_WEB3_REQUEST() {
        console.debug('LOAD_WEB3_REQUEST')
    },
    LOAD_WEB3_SUCCESS() {
        console.debug('LOAD_WEB3_SUCCESS')
    },
    LOAD_WEB3_FAILURE(_state, payload) {
        console.debug('LOAD_WEB3_FAILURE', payload)
    },
    LOAD_PROVIDER_REQUEST() {
        console.debug('LOAD_PROVIDER_REQUEST')
    },
    LOAD_CHAININFO_SUCCESS(_state, info) {
        Vue.set(_state, 'chain', info.chain)
        Vue.set(_state, 'genesisHash', info.genesisHash)
        Vue.set(_state, 'metaCalls', info.metaCalls)
        Vue.set(_state, 'specVersion', info.specVersion)
        Vue.set(_state, 'ss58Format', info.ss58Format)
        Vue.set(_state, 'tokenDecimals', info.tokenDecimals)
        Vue.set(_state, 'tokenSymbol', info.tokenSymbol)
        console.debug('LOAD_CHAININFO_SUCCESS')
    },
    LOAD_CHAININFO_FAILURE(_state, info) {
        Vue.set(_state, 'chain', null)
        Vue.set(_state, 'genesisHash', null)
        Vue.set(_state, 'metaCalls', null)
        Vue.set(_state, 'specVersion', 0)
        Vue.set(_state, 'ss58Format', 0)
        Vue.set(_state, 'tokenDecimals', 10)
        Vue.set(_state, 'tokenSymbol', null)
        console.debug('LOAD_CHAININFO_FAILURE')
    },
    LOAD_PROVIDER_SUCCESS(_state, payload) {
        Vue.set(_state, 'injectedLoaded', payload.injectedLoaded)
        Vue.set(_state, 'account', payload.account)
        Vue.set(_state, 'name', payload.name)
        Vue.set(_state, 'active', true)
        Vue.set(_state, 'userInfo', payload)
        lsSet('userInfo', payload)
        console.debug('LOAD_PROVIDER_SUCCESS')
    },
    LOAD_PROVIDER_FAILURE(_state, payload) {
        Vue.set(_state, 'injectedLoaded', false)
        Vue.set(_state, 'account', null)
        Vue.set(_state, 'active', false)
        console.debug('LOAD_PROVIDER_FAILURE', payload)
    },
    GET_LATEST_BLOCK_REQUEST() {
        console.debug('GET_LATEST_BLOCK_REQUEST')
    },
    GET_LATEST_BLOCK_SUCCESS(_state, payload) {
        console.debug('GET_LATEST_BLOCK_SUCCESS', payload)
        Vue.set(_state, 'blockNumber', payload)
    },
    GET_LATEST_BLOCK_FAILURE() {
        console.debug('GET_LATEST_BLOCK_FAILURE')
    },
    HANDLE_CHAIN_CHANGED() {
        console.debug('HANDLE_CHAIN_CHANGED')
    },
    HANDLE_ACCOUNTS_CHANGED(_state, payload) {
        Vue.set(_state, 'account', payload)
        Vue.set(_state, 'name', null)
        console.debug('HANDLE_ACCOUNTS_CHANGED', payload)
    },
    HANDLE_NETWORK_CHANGED() {
        console.debug('HANDLE_NETWORK_CHANGED')
    },
    HANDLE_DISCONNECT() {
        console.debug('HANDLE_DISCONNECT')
    },
    GET_BALANCES_REQUEST() {
        console.debug('GET_BALANCES_REQUEST')
    },
    GET_BALANCES_SUCCESS(_state, payload) {
        console.log(109, payload)
        for (const address in payload) {
            Vue.set(_state.balances, address, payload[address])
            lsSet('balances', payload)
        }
        console.debug('GET_BALANCES_SUCCESS')
    },
    GET_BALANCES_FAILURE(_state, payload) {
        console.debug('GET_BALANCES_FAILURE', payload)
    },
    GET_ALLOWANCES_REQUEST() {
        console.debug('GET_ALLOWANCES_REQUEST')
    },
    GET_ALLOWANCES_SUCCESS(_state, payload) {
        console.debug('GET_ALLOWANCES_SUCCESS')
    },
    GET_ALLOWANCES_FAILURE(_state, payload) {
        console.debug('GET_ALLOWANCES_FAILURE', payload)
    },
    GET_BLOCK_SUCCESS(_state, blockNumber) {
        Vue.set(_state, 'blockNumber', blockNumber)
        console.debug('GET_BLOCK_SUCCESS', blockNumber)
    },
}

const actions = {
    login: async ({ dispatch, commit }) => {
        commit('SET', { authLoading: true })
        web3Enable('polkadot-js/apps')
        // if (!isWeb3Injected) {
        //     throw new Error(
        //         'Please install/unlock the polkadot{.js} extension first'
        //     )
        // }
        await dispatch('loadWeb3')
        commit('SET', { authLoading: false })
    },
    logout: async ({ commit }) => {
        /*

      */
        // lsRemove()
        commit('LOGOUT')
    },
    initTokenMetadata: async ({ commit }) => {
        const metadata = Object.fromEntries(
            Object.entries(config.tokens).map((tokenEntry) => {
                const { decimals, symbol, name } = tokenEntry[1]
                return [
                    tokenEntry[0],
                    {
                        decimals,
                        symbol,
                        name,
                        whitelisted: true,
                    },
                ]
            })
        )
        console.log(169, metadata)
        commit('LOAD_TOKEN_METADATA_SUCCESS', metadata)
    },
    loadTokenMetadata: async ({ commit }, tokens) => {
        commit('LOAD_TOKEN_METADATA_REQUEST')
        /*
         */
        // try {
        //        const keys = ['decimals', 'symbol', 'name']
        //        const calls = tokens
        //            .map((token) => keys.map((key) => [token, key, []]))
        //            .reduce((a, b) => [...a, ...b])
        //        const res = await multicall(provider, abi['TestToken'], calls)
        //        const tokenMetadata = Object.fromEntries(
        //            tokens.map((token, i) => [
        //                token,
        //                Object.fromEntries(
        //                    keys.map((key, keyIndex) => [
        //                        key,
        //                        ...res[keyIndex + i * keys.length],
        //                    ])
        //                ),
        //            ])
        //        )
        //        commit('LOAD_TOKEN_METADATA_SUCCESS', tokenMetadata)
        //        return tokenMetadata
        //    } catch (e) {
        //        commit('LOAD_TOKEN_METADATA_FAILURE', e)
        //        return Promise.reject()
        //    }
        const tokenMetadata = {}
        commit('LOAD_TOKEN_METADATA_SUCCESS', tokenMetadata)
        return tokenMetadata
    },
    loadWeb3: async ({ commit, dispatch }) => {
        commit('LOAD_WEB3_REQUEST')
        try {
            await dispatch('loadProvider')
            await dispatch('loadChainInfo')
            await dispatch('loadAccount')
            //await dispatch('checkPendingTransactions')
            commit('LOAD_WEB3_SUCCESS')
        } catch (e) {
            commit('LOAD_WEB3_FAILURE', e)
            return Promise.reject()
        }
    },
    loadProvider: async ({ commit, dispatch }) => {
        commit('LOAD_PROVIDER_REQUEST')
        try {
            await dispatch('clearUser')
            await dispatch('loadAccount')
            let allAccounts = await web3Accounts()
            let account = allAccounts.length > 0 ? allAccounts[0] : null
            console.log(account)
            allAccounts = allAccounts.map(({ address, meta }) => ({
                address,
                meta: {
                    ...meta,
                    name: `${meta.name} (${
                        meta.source === 'polkadot-js'
                            ? 'extension'
                            : meta.source
                    })`,
                },
            }))
            commit('LOAD_PROVIDER_SUCCESS', {
                injectedLoaded: true,
                account: account.address,
                name: account.meta.name,
            })
        } catch (e) {
            commit('LOAD_PROVIDER_FAILURE', e)
            return Promise.reject()
        }
    },
    loadAccount: async ({ dispatch }) => {
        if (!state.account) return
        const tokens = Object.entries(config.tokens).map(
            (token) => token[1].address
        )
        console.log(tokens)
        await Promise.all([
            dispatch('getBalances', tokens),
            dispatch('getAllowances', tokens),
            // dispatch('getUserPoolShares'),
        ])
    },
    loadChainInfo:async({ commit })=>{
        let chainInfo=await useChainInfo();
        if (chainInfo!=null){
            commit('LOAD_CHAININFO_SUCCESS',chainInfo);
        }
        else{
            commit('LOAD_CHAININFO_FAILURE','fail');
        }
        
    },
    getPoolBalances: async (_state, { poolAddress, tokens }) => {},
    getBalances: async ({ commit }, tokens) => {
        commit('GET_BALANCES_REQUEST')
        const address = state.account
        // Construct
        
        const api = useApi();

        // Wait until we are ready and connected
        await api.isReady
        const tokensToFetch = tokens
            ? tokens
            : Object.keys(state.balances).filter((token) => token !== 'plasm')
        console.log(tokensToFetch)

        const {
            data: { free },
        } = await api.query.system.account(address)

        const balances = {}
        balances.plasm = free.toHuman().replace(state.tokenSymbol, '')
        try {
            tokensToFetch.forEach((value) => {
                let contract = new ContractPromise(api, abi, value)
                contract
                    .read(
                        'iPat,balanceOf',
                        { value: 0, gasLimit: -1 },
                        address
                    )
                    .send(address)
                    .then((result) => {
                        balances[value] =
                            result.output instanceof Raw
                                ? result.output.toString().replace(state.tokenSymbol, '')
                                : result.output instanceof Option &&
                                  result.output.isNone
                                ? '0'
                                : result.output.toHuman().replace(state.tokenSymbol, '')

                        commit('GET_BALANCES_SUCCESS', balances)
                        return balances
                    })
            })
        } catch (e) {
            commit('GET_BALANCES_FAILURE', e)
            return Promise.reject()
        }
    },
    getAllowances: async ({ commit }, tokens) => {
        commit('GET_ALLOWANCES_REQUEST')
    },
}

export default {
    state,
    mutations,
    actions,
}
