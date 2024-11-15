//vue.config.js
const TransformPages = require('uni-read-pages')
const {webpack} = new TransformPages()
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				ROUTES: webpack.DefinePlugin.runtimeValue(() => {
					const tfPages = new TransformPages({
						includes: ['path', 'name', 'aliasPath']
					});
					return JSON.stringify(tfPages.routes)
				}, true )
			})
		],
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
	}
}