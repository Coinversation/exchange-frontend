import Vue from 'vue'
import Vuex from 'vuex'
import modules from '@/store/modules'
// import { lsGet, lsSet } from '@/lib/localStorage'
import vettedTokenList from '@/config/vetted_tokenlist'

Vue.use(Vuex)

const state = {
    sidebarShow: 'responsive',
    sidebarMinimize: false,
    asideShow: false,
    // darkMode: false,
    darkMode: true,
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
}

const store = new Vuex.Store({
    state,
    modules,
    // strict: process.env.NODE_ENV !== 'production',
    mutations,
})

export default store
