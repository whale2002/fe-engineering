function require(filePath) {
  const map = {
    './foo.js': foojs,
    './main.js': mainjs
  }

  const fn = map[filePath]

  const module = {
    exports: {}
  }
  fn(require, module, module.exports)

  return module.exports
}

function mainjs(require, module, exports) {
  const { foo } = require('./foo.js')

  foo()
  console.log('main.js')
}

function foojs(require, module, exports) {
  function foo() {
    console.log('foo.js')
  }
  console.log('foo执行')

  module.exports = {
    foo
  }
}

require('./main.js')
