class CopyRightWebpackPlugin {
  // compiler 是一个webpack实例
  apply(compiler) {
    // https://webpack.docschina.org/api/compiler-hooks/#hooks
    compiler.hooks.emit.tapAsync(
      'CopyrightWebpackPlugin',
      (compilation, cb) => {
        compilation.assets['copyright.txt'] = {
          source: function () {
            return 'copyright by coder-chin'
          },
          size: function () {
            return 21
          }
        }
        cb()
      }
    )
  }
}

module.exports = CopyRightWebpackPlugin
