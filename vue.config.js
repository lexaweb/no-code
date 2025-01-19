const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production'
      ? 'https://github.com/lexaweb/no-code' // Замените на имя вашего репозитория
      : '/'
})
