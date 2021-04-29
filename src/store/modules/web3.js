import Vue from 'vue'
import config from '@/config'
import { lsGet, lsRemove, lsSet } from '@/lib/localStorage'

import { ContractPromise } from '@polkadot/api-contract'
import { Option, Raw } from '@polkadot/types'
import abi from '../../abi/erc20_issue.json'
import { ApiPromise, WsProvider } from '@polkadot/api'
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
    balances: {},
    allowances: {},
    tokenMetadata: {},
    userInfo: lsGet('userInfo') || {},
}
const mutations = {
    LOGOUT(_state) {
        Vue.set(_state, 'injectedLoaded', false)
        Vue.set(_state, 'account', null)
        Vue.set(_state, 'name', null)
        Vue.set(_state, 'active', false)
        Vue.set(_state, 'balances', {})
        Vue.set(_state, 'allowances', {})
        lsSet('userInfo', {})
        console.debug('LOGOUT')
    },
    LOAD_TOKEN_METADATA_REQUEST() {
        console.debug('LOAD_TOKEN_METADATA_REQUEST')
    },
    LOAD_TOKEN_METADATA_SUCCESS(_state, payload) {
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
    LOAD_PROVIDER_SUCCESS(_state, payload) {
        Vue.set(_state, 'injectedLoaded', payload.injectedLoaded)
        Vue.set(_state, 'account', payload.account)
        Vue.set(_state, 'name', payload.name)
        Vue.set(_state, 'active', true)
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
        commit('LOGOUT')
    },
    initTokenMetadata: async ({ commit }) => {
        const metadata = Object.fromEntries(
          Object.entries(config.tokens).map(tokenEntry => {
            const { decimals, symbol, name } = tokenEntry[1];
            return [
              tokenEntry[0],
              {
                decimals,
                symbol,
                name,
                whitelisted: true
              }
            ];
          })
        );
        commit('LOAD_TOKEN_METADATA_SUCCESS', metadata);
      },
    loadTokenMetadata: async ({ commit }, tokens) => {
        commit('LOAD_TOKEN_METADATA_REQUEST')
        /*
         */
        const tokenMetadata = {}
        commit('LOAD_TOKEN_METADATA_SUCCESS', tokenMetadata)
        return tokenMetadata
    },
    loadWeb3: async ({ commit, dispatch }) => {
        commit('LOAD_WEB3_REQUEST')
        try {
            await dispatch('loadProvider')
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
    getPoolBalances: async (_state, { poolAddress, tokens }) => {},
    getBalances: async ({ commit }, tokens) => {
        commit('GET_BALANCES_REQUEST')
        const address = state.account
        // Construct
        const wsProvider = new WsProvider(config.polkadotUrl)
        // Create the instance
        const api = new ApiPromise({ provider: wsProvider })

        // Wait until we are ready and connected
        await api.isReady

        const tokensToFetch = tokens
            ? tokens
            : Object.keys(state.balances).filter((token) => token !== 'dot')
        console.log(tokensToFetch)

        const {
            data: { free },
        } = await api.query.system.account(address)

        const balances = {}
        balances.dot = free.toHuman()
        try {
            tokensToFetch.forEach((value) => {
                let contract = new ContractPromise(api, abi, value)
                contract
                    .read(
                        'iErc20,balanceOf',
                        { value: 0, gasLimit: -1 },
                        address
                    )
                    .send(address)
                    .then((result) => {
                        balances[value] =
                            result.output instanceof Raw
                                ? result.output.toString()
                                : result.output instanceof Option &&
                                  result.output.isNone
                                ? '0'
                                : result.output.toHuman()
                    })
            })
            commit('GET_BALANCES_SUCCESS', balances)
            console.log(balances)
            return balances
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
