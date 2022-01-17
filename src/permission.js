import router from './router'
// import store from './store'

router.beforeEach(async (to, from, next) => {
  document.title = 'HoyaWolf!'
  next()
  // if (store.state.isLogin) {
  //   next()
  // } else {
  //   next({ path: '/' })
  // }
})
