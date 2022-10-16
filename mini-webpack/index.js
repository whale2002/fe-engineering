import fs from 'fs'
import path from 'path'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import { transformFromAst } from '@babel/core'
import ejs from 'ejs'
import { SyncHook } from 'tapable'

import { jsonLoader } from './loader/jsonLoader.js'
import { ChangeOutputPath } from './plugin/ChangeOutputPath.js'

let id = 0
const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.json$/,
        use: jsonLoader
      }
    ]
  },
  plugins: [new ChangeOutputPath()]
}

const hooks = {
  emitFile: new SyncHook(['context'])
}
function initPlugins() {
  const plugins = webpackConfig.plugins

  plugins.forEach((plugin) => {
    plugin.apply(hooks)
  })
}

initPlugins()

function createAsset(filePath) {
  let source = fs.readFileSync(filePath, {
    encoding: 'utf-8'
  })

  const loaders = webpackConfig.module.rules
  loaders.forEach(({ test, use }) => {
    if (test.test(filePath)) {
      source = use(source)
    }
  })

  const ast = parser.parse(source, {
    sourceType: 'module'
  })

  const deps = []
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value)
    }
  })

  const { code } = transformFromAst(ast, null, {
    presets: ['env']
  })

  return {
    filePath,
    code,
    deps,
    mapping: {},
    id: id++
  }
}

function createGraph(entry) {
  const mainAsset = createAsset(entry)

  const queue = [mainAsset]

  // bfs
  for (const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const child = createAsset(path.resolve('./example', relativePath))
      asset.mapping[relativePath] = child.id
      queue.push(child)
    })
  }

  return queue
}

function build(graph) {
  const template = fs.readFileSync('./bundle.ejs', {
    encoding: 'utf-8'
  })

  const data = graph.map((asset) => {
    const { id, code, mapping } = asset
    return {
      id,
      code,
      mapping
    }
  })
  const code = ejs.render(template, { data })

  let outputPath = './dist/bundle.js'
  const context = {
    changeOutputPath(path) {
      outputPath = path
    }
  }
  hooks.emitFile.call(context)
  fs.writeFileSync(outputPath, code)
}

const graph = createGraph('./example/main.js')
build(graph)
// build('./example/test.json')
