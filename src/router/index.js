import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login";
import Home from "../components/Home";

import Main from "@/components/Main.vue";
import root from "@/components/root.vue";
import CSGOItems from "@/components/csgo/CSGOItems.vue";
import CSGOInventory from "@/components/csgo/CSGOInventory.vue";

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
  },
  {
    path: '/root',
    name: 'Root',
    component: root,
    redirect: '/index',
    children: [
      {
        path: '/main',
        name: 'Main',
        component: Main
      },
      {
        path: '/csgo-items',
        name: 'csgo-items',
        component: CSGOItems
      },
      {
        path: '/csgo-inventory',
        name: 'csgo-inventory',
        component: CSGOInventory
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
