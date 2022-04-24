module.exports = function (source) {
  // console.log(source)  //打印源代码
  const options = this.getOptions() // 获取options

  const callback = this.callback()

  setTimeout(() => {
    const res = source.replace('Chin', options.name)
    callback(null, res)
  }, 1000)
}
