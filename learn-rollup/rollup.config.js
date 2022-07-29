import json from 'rollup-plugin-json'   // 解析JSON
import resolve from 'rollup-plugin-node-resolve' //解析第三方模块
import commonjs from 'rollup-plugin-commonjs'  //支持commonjs

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm'
  },
  // rollup插件使用方式是调用函数
  plugins: [
    json(),
    resolve(),
    commonjs()
  ]
}