module.exports = {
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  },
  
  devServer: {
    proxy: {
        '/api': {
            target: 'http://i8c104.p.ssafy.io:8080/',
            changeOrigin: true,
        }
    },
  } 
}
