export function jsonLoader(source) {
  console.log('jsonLoader----------------', source)

  return `export default ${JSON.stringify(source)}`
}
