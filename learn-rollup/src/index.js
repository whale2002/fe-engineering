import { join } from 'lodash-es'  // 处理esm。 默认不支持cjs。需要插件rollup-plugin-commonjs
import { log } from './logger.js'
import message from './message.js'
import { name, version } from '../package.json'
import cjs from './cjs.js'

const msg = message.hello

log(msg)

console.log(name, version)

console.log(join([1, 2], '-'))

console.log(cjs.she)
