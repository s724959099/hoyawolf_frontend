import router from './router'
// import store from './store'

router.beforeEach(async (to, from, next) => {
  // if (to.meta.needLogin === true) {
  //   next({ path: '/' })
  // }

  next()
})
