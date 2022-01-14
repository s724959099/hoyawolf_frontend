// const fs = require('fs')

module.exports = {
  transpileDependencies: ['vuetify'],
  productionSourceMap: false,

  devServer: {
    // https: {
    //   key: fs.readFileSync(`${__dirname}/src/assets/https/localhost-key.pem`),
    //   cert: fs.readFileSync(`${__dirname}/src/assets/https/localhost.pem`),
    // },
    disableHostCheck: true,
    port: 9527,
    open: true,
    hot: true,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_WOLF_API,
        changeOrigin: true,
        pathRewrite: {
          '/api': '',
        },
      },
      '/line': {
        target: process.env.VUE_APP_LINE_API,
        changeOrigin: true,
        secure: true,
        pathRewrite: {
          '/line': '',
        },
      },
      '/notify': {
        target: process.env.VUE_APP_LINE_NOTIFY_API,
        changeOrigin: true,
        secure: true,
        pathRewrite: {
          '/notify': '',
        },
      },
    },
  },
}
