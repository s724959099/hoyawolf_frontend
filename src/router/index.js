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
    path: '/member/setting',
    name: 'MemberSetting',
    component: () =>
      import(/* webpackChunkName: "member" */ '../views/Member/Setting.vue'),
    meta: {
      needLogin: true,
    },
  },
  {
    path: '/member/auth',
    name: 'MemberNotify',
    component: () =>
      import(/* webpackChunkName: "member" */ '../views/Member/Notify.vue'),
    meta: {
      needLogin: true,
    },
  },
  {
    path: '*',
    component: () => import('@/views/Error/404'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
