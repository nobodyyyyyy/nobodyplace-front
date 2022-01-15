import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {
            username: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username
        },
        searchEngine: window.localStorage.getItem('searchEngine') == null ?
            'search_engine_google' : window.localStorage.getItem('searchEngine'),
        suggestionEngine: window.localStorage.getItem('suggestionEngine') == null ?
            'suggestion_engine_bing' : window.localStorage.getItem('suggestionEngine'),
    },
    // 同步
    mutations: {
        login (state, user) {
            state.user = user
            window.localStorage.setItem('user', JSON.stringify(user))
        },
        searchEngineChange(state, engine) {
            state.searchEngine = engine
            window.localStorage.setItem('searchEngine', engine)
        },
        suggestionEngineChange(state, engine) {
            state.suggestionEngine = engine;
            window.localStorage.setItem('suggestionEngine', engine)
        }
    },
    // 异步
    actions: {
    },
    modules: {
    }
})
