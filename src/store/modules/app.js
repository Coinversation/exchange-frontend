import Vue from 'vue'
import { lsGet, lsSet } from '@/lib/localStorage'
import vettedTokenList from '@/config/vetted_tokenlist'

const state = {
    tokenFilterList: lsGet('tokenFilterList') || [],
    vettedTokenListData: vettedTokenList.tokens,
    unlockTokenList: [],
    tokenExFilterList: lsGet('tokenExFilterList') || [],
}

const mutations = {
    TOKEN_FILTER_LIST(_state, payload) {
        Vue.set(_state, 'tokenFilterList', payload)
        lsSet('tokenFilterList', payload)
    },
    TOKEN_EX_FILTER_LIST(_state, payload) {
        Vue.set(_state, 'tokenExFilterList', payload)
        lsSet('tokenExFilterList', payload)
    },

    // VETTED_TOKEN_LIST_DATA(_state, payload) {
    //     Vue.set(_state, 'vettedTokenListData', payload)
    // },
}
const actions = {}

export default {
    state,
    mutations,
    actions,
}
