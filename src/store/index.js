import Vue from 'vue'
import Vuex from 'vuex'
import backgrounds from "./modules/backgrounds";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      username: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username
    },
    backgrounds: backgrounds
  },
  mutations: {
    login (state, user) {
      state.user = user
      window.localStorage.setItem('user', JSON.stringify(user))
    }
  },
  actions: {
  },
  modules: {
    backgrounds
  }
})
