import {Plugin} from '../plugin';
import {clientInjectPlugin} from './clientInject';
import {resolvePlugin} from './resolve';
import {esbuildTransformPlugin} from './esbuild';
import {importAnalysisPlugin} from './importAnalysis';
import {cssPlugin} from './css';
import {assetPlugin} from './assets';

export function resolvePlugins(): Plugin[] {
    return [
        clientInjectPlugin(),
        resolvePlugin(),
        esbuildTransformPlugin(),
        importAnalysisPlugin(),
        cssPlugin(),
        assetPlugin()
    ];
}
