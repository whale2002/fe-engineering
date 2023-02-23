// connect 是一个具有中间件机制的轻量级 Node.js 框架。
// 既可以单独作为服务器，也可以接入到任何具有中间件机制的框架中，如 Koa、Express
import connect from 'connect';
// picocolors 是一个用来在命令行显示不同颜色文本的工具
import {blue, green} from 'picocolors';
import chokidar, {FSWatcher} from 'chokidar';
import {optimizer} from '../optimizer';
import {resolvePlugins} from '../plugins';
import {createPluginContainer, PluginContainer} from '../pluginContainer';
import {indexHtmlMiddware} from './middlewares/indexHtml';
import {transformMiddleware} from './middlewares/transform';
import {staticMiddleware} from './middlewares/static';
import {ModuleGraph} from '../ModuleGraph';
import {createWebSocketServer} from '../ws';
import {bindingHMREvents} from '../hmr';
import {normalizePath} from '../utils';

export interface ServerContext {
    root: string;
    pluginContainer: PluginContainer;
    app: connect.Server;
    plugins: Plugin[];
    moduleGraph: ModuleGraph;
    ws: {send: (data: any) => void; close: () => void};
    watcher: FSWatcher;
}

export async function startDevServer() {
    const app = connect();
    const root = process.cwd();
    const startTime = Date.now();

    const watcher = chokidar.watch(root, {
        ignored: ['**/node_modules/**', '**/.git/**'],
        ignoreInitial: true
    });

    const plugins = resolvePlugins(); // 返回rollup插件
    const pluginContainer = createPluginContainer(plugins); // 插件容器
    const moduleGraph = new ModuleGraph((url) =>
        pluginContainer.resolveId(url)
    );
    const ws = createWebSocketServer(app);

    const serverContext: ServerContext = {
        // 服务器上下文
        root: normalizePath(process.cwd()),
        app,
        pluginContainer,
        plugins,
        moduleGraph,
        ws,
        watcher
    };

    bindingHMREvents(serverContext);

    app.use(indexHtmlMiddware(serverContext));
    app.use(transformMiddleware(serverContext));
    app.use(staticMiddleware(serverContext.root));

    for (const plugin of plugins) {
        if (plugin.configureServer) {
            await plugin.configureServer(serverContext);
        }
    }

    app.listen(3002, async () => {
        await optimizer(root);

        console.log(
            green('🚀 No-Bundle 服务已经成功启动!'),
            `耗时: ${Date.now() - startTime}ms`
        );
        console.log(`> 本地访问路径: ${blue('http://localhost:3002')}`);
    });
}
