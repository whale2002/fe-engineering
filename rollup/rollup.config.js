// 以下注释是为了能使用 VSCode 的类型提示
/**
 * @type { import('rollup').RollupOptions }
 */
const buildOptions = {
  input: {
    index: 'src/index.js',
    util: 'src/util.js'
  },
  output: [
    {
      dir: 'dist/es',
      format: 'esm'
    },
    {
      dir: 'dist/cjs',
      format: 'cjs'
    }
  ]
}

export default buildOptions

// rollup 具有天然的 Tree Shaking 功能
