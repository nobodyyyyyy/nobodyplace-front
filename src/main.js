import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'

import './css/common.css'
import * as echarts from 'echarts'

// 设置反向代理，前端请求默认发送到 http://localhost:8080/api
const axios = require('axios');
axios.defaults.baseURL = 'http://localhost:8080/api'
axios.interceptors.request.use(config => {
  config.headers.token = localStorage.getItem("token")
  return config
})

// 全局注册
// this.$axios
Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts

// elementUI
Vue.use(ElementUI)

// 持久化
import Vuex from 'vuex'

Vue.use(Vuex)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.user.username) {
      next()
    } else {
      next({
        path: 'login', query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})

new Vue({
  el: '#app', router, store, render: h => h(App)
}).$mount('#app')
