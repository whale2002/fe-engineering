const path = require('path')
const CopyRightWebpackPlugin = require('./plugins/copyright-webpack-plugin.js')

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.js'
  },
  plugins: [new CopyRightWebpackPlugin()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  }
}