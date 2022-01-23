import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login";
import Home from "../components/Home";

Vue.use(VueRouter)

const routes = [
  {
    // default route
    path: '/',
    name: "Home",
    components: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    // redirect: '/index',
    // children: [
    //   {
    //     path: '/index',
    //     name: 'AppIndex',
    //     component: AppIndex,
    //     meta: {
    //       requireAuth: true
    //     }
    //   }
    // ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
