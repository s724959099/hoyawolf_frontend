import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Home,
  },
  {
    path: '/member/setting',
    name: 'MemberSetting',
    component: () =>
      import(/* webpackChunkName: "member" */ '../views/Member/Setting.vue'),
  },
  {
    path: '/member/auth',
    name: 'MemberNotify',
    component: () =>
      import(/* webpackChunkName: "member" */ '../views/Member/Notify.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/member/track-wallet',
    name: 'MemberTrackWallet',
    component: () =>
      import(
        /* webpackChunkName: "member" */ '../views/Member/TrackWallet.vue'
      ),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/member/address-profit',
    name: 'AddressProfit',
    component: () =>
      import(
        /* webpackChunkName: "member" */ '../views/Member/AddressProfit.vue'
      ),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/member/info',
    name: 'MemberInfo',
    component: () =>
      import(/* webpackChunkName: "member" */ '../views/Member/Info.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '*',
    redirect: '/',
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
