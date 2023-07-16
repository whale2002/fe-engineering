import path from 'path';
import {build} from 'esbuild';
import {green} from 'picocolors';
import {scanPlugin} from './scanPlugin';
import {preBundlePlugin} from './preBundlePlugin';
import {PRE_BUNDLE_DIR} from '../constants';

export async function optimizer(root: string) {
    const entry = path.resolve(root, 'src/main.tsx');
    const deps = new Set<string>();

    // 相当于遍历了一遍依赖，并没有打包
    await build({
        entryPoints: [entry],
        bundle: true,
        write: false,
        plugins: [scanPlugin(deps)]
    });

    console.log(
        `${green('需要预构建的依赖')}:\n${[...deps]
            .map(green)
            .map((item) => `  ${item}`)
            .join('\n')}`
    );

    await build({
        entryPoints: [...deps],
        write: true,
        bundle: true,
        format: 'esm',
        splitting: true,
        outdir: path.resolve(root, PRE_BUNDLE_DIR),
        plugins: [preBundlePlugin(deps)]
    });
}
