import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    sidebarShow: 'responsive',
    sidebarMinimize: false,
    asideShow: false,
    // darkMode: false,
    darkMode: true,
    injectedLoaded: false,
    injectedChainId: null,
    blockNumber: 0,
    account: null,
    name: null,
    active: false,
    balances: {},
    allowances: {},
    tokenMetadata: {}
}


const mutations = {
    toggleSidebarDesktop(state) {
        const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
        state.sidebarShow = sidebarOpened ? false : 'responsive'
    },
    toggleSidebarMobile(state) {
        const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
        state.sidebarShow = sidebarClosed ? true : 'responsive'
    },
    set(state, [variable, value]) {
        state[variable] = value
    },
    toggle(state, variable) {
        state[variable] = !state[variable]
    },
    LOGOUT(_state) {
        Vue.set(_state, 'injectedLoaded', false);
        Vue.set(_state, 'injectedChainId', null);
        Vue.set(_state, 'account', null);
        Vue.set(_state, 'name', null);
        Vue.set(_state, 'active', false);
        Vue.set(_state, 'balances', {});
        Vue.set(_state, 'allowances', {});
        console.debug('LOGOUT');
    },
    LOAD_TOKEN_METADATA_REQUEST() {
        console.debug('LOAD_TOKEN_METADATA_REQUEST');
    },
    LOAD_TOKEN_METADATA_SUCCESS(_state, payload) {
        console.debug('LOAD_TOKEN_METADATA_SUCCESS');
    },
    LOAD_TOKEN_METADATA_FAILURE(_state, payload) {
        console.debug('LOAD_TOKEN_METADATA_FAILURE', payload);
    },
    LOAD_WEB3_REQUEST() {
        console.debug('LOAD_WEB3_REQUEST');
    },
    LOAD_WEB3_SUCCESS() {
        console.debug('LOAD_WEB3_SUCCESS');
    },
    LOAD_WEB3_FAILURE(_state, payload) {
        console.debug('LOAD_WEB3_FAILURE', payload);
    },
    LOAD_PROVIDER_REQUEST() {
        console.debug('LOAD_PROVIDER_REQUEST');
    },
    LOAD_PROVIDER_SUCCESS(_state, payload) {
        console.debug('LOAD_PROVIDER_SUCCESS');
    },
    LOAD_PROVIDER_FAILURE(_state, payload) {
        Vue.set(_state, 'injectedLoaded', false);
        Vue.set(_state, 'injectedChainId', null);
        Vue.set(_state, 'account', null);
        Vue.set(_state, 'active', false);
        console.debug('LOAD_PROVIDER_FAILURE', payload);
    },
    GET_LATEST_BLOCK_REQUEST() {
        console.debug('GET_LATEST_BLOCK_REQUEST');
    },
    GET_LATEST_BLOCK_SUCCESS(_state, payload) {
        console.debug('GET_LATEST_BLOCK_SUCCESS', payload);
        Vue.set(_state, 'blockNumber', payload);
    },
    GET_LATEST_BLOCK_FAILURE() {
        console.debug('GET_LATEST_BLOCK_FAILURE');
    },
    HANDLE_CHAIN_CHANGED() {
        console.debug('HANDLE_CHAIN_CHANGED');
    },
    HANDLE_ACCOUNTS_CHANGED(_state, payload) {
        Vue.set(_state, 'account', payload);
        Vue.set(_state, 'name', null);
        console.debug('HANDLE_ACCOUNTS_CHANGED', payload);
    },
    HANDLE_NETWORK_CHANGED() {
        console.debug('HANDLE_NETWORK_CHANGED');
    },
    HANDLE_DISCONNECT() {
        console.debug('HANDLE_DISCONNECT');
    },
    GET_BALANCES_REQUEST() {
        console.debug('GET_BALANCES_REQUEST');
    },
    GET_BALANCES_SUCCESS(_state, payload) {
        console.debug('GET_BALANCES_SUCCESS');
    },
    GET_BALANCES_FAILURE(_state, payload) {
        console.debug('GET_BALANCES_FAILURE', payload);
    },
    GET_ALLOWANCES_REQUEST() {
        console.debug('GET_ALLOWANCES_REQUEST');
    },
    GET_ALLOWANCES_SUCCESS(_state, payload) {
        console.debug('GET_ALLOWANCES_SUCCESS');
    },
    GET_ALLOWANCES_FAILURE(_state, payload) {
        console.debug('GET_ALLOWANCES_FAILURE', payload);
    },
    GET_BLOCK_SUCCESS(_state, blockNumber) {
        Vue.set(_state, 'blockNumber', blockNumber);
        console.debug('GET_BLOCK_SUCCESS', blockNumber);
    }
    };

const actions={
    login: async ({ dispatch, commit }, connector = 'injected') => {
      commit('SET', { authLoading: true });
      /*
      */
      commit('SET', { authLoading: false });
    },
    logout: async ({ commit }) => {
      /*

      */
      commit('LOGOUT');
    },
    
    loadTokenMetadata: async ({ commit }, tokens) => {
        commit('LOAD_TOKEN_METADATA_REQUEST');
      /*
      */
        const tokenMetadata={}
        commit('LOAD_TOKEN_METADATA_SUCCESS', tokenMetadata);
        return tokenMetadata;
    },
    loadWeb3: async ({ commit, dispatch }) => {
      commit('LOAD_WEB3_REQUEST');
    },
    loadProvider: async ({ commit, dispatch }) => {
      commit('LOAD_PROVIDER_REQUEST');
    },
    loadAccount: async ({ dispatch }) => {
      if (!state.account) return;
    },
    getPoolBalances: async (_state, { poolAddress, tokens }) => {
      
    },
    getBalances: async ({ commit }, tokens) => {
      commit('GET_BALANCES_REQUEST');
    },
    getAllowances: async ({ commit }, tokens) => {
      commit('GET_ALLOWANCES_REQUEST');
      
    }
  };

export default new Vuex.Store({
    state,
    actions,
    mutations,
})
