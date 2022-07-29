import foo from './foo.js'

foo.bar()

if(module.hot) {
  module.hot.accept(() => {
    console.log('hmr')
  })
}