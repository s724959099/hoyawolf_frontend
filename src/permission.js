import router from './router'
// import store from './store'

router.beforeEach(async (to, from, next) => {
  document.title = '追蹤Opensea神器 | HoyaWolf'
  next()
  // if (store.state.isLogin) {
  //   next()
  // } else {
  //   next({ path: '/' })
  // }
})
