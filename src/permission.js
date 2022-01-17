import router from './router'
import store from './store'

router.beforeEach(async (to, from, next) => {
  document.title = '追蹤Opensea神器 | HoyaWolf'

  const isLogin = store.state.isLogin || false
  // 需要登入後才可以進入的頁面
  if (to.meta.requiresAuth && !isLogin) {
    next()
  }

  next()
})

export default router
