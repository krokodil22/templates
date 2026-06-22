const path = require('path');
const webpack = require('webpack');

const fs = require('fs');
const crypto = require('crypto');

const TASKS_DIR = path.resolve(__dirname, 'tasks');
const toSlug = value => {
    const normalized = value
        .toLowerCase()
        .replace(/\.sb3$/, '')
        .replace(/[^a-z0-9а-яё]+/gi, '-')
        .replace(/^-+|-+$/g, '');
    return normalized || 'project';
};
const taskProjects = [];
const collectTaskProjects = dir => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            collectTaskProjects(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.sb3')) {
            const relativeDir = path.relative(TASKS_DIR, dir).split(path.sep);
            const mode = relativeDir[relativeDir.length - 1];
            if (mode !== 'FS' && mode !== 'Editor') continue;
            const relativeFile = path.relative(__dirname, fullPath)
                .split(path.sep)
                .join('/');
            const hash = crypto.createHash('sha1')
                .update(relativeFile)
                .digest('hex')
                .slice(0, 8);
            const urlPath = `tasks/${relativeDir.join('/')}/${toSlug(entry.name)}-${hash}`;
            taskProjects.push({
                id: relativeFile,
                mode,
                fileName: entry.name,
                sourceDir: `tasks/${relativeDir.join('/')}`,
                urlPath
            });
        }
    }
};
collectTaskProjects(TASKS_DIR);

// Plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ScratchWebpackConfigBuilder = require('scratch-webpack-configuration');

// const STATIC_PATH = process.env.STATIC_PATH || '/static';

const commonHtmlWebpackPluginOptions = {
    // Google Tag Manager ID
    // Looks like 'GTM-XXXXXXX'
    gtm_id: process.env.GTM_ID || '',

    // Google Tag Manager env & auth info for alterative GTM environments
    // Looks like '&gtm_auth=0123456789abcdefghijklm&gtm_preview=env-00&gtm_cookies_win=x'
    // Taken from the middle of: GTM -> Admin -> Environments -> (environment) -> Get Snippet
    // Blank for production
    gtm_env_auth: process.env.GTM_ENV_AUTH || ''
};

const baseConfig = new ScratchWebpackConfigBuilder(
    {
        rootPath: path.resolve(__dirname),
        enableReact: true,
        shouldSplitChunks: false,
        publicPath: 'auto'
    })
    .setTarget('browserslist')
    .merge({
        output: {
            assetModuleFilename: 'static/assets/[name].[hash][ext][query]',
            library: {
                name: 'GUI',
                type: 'umd2'
            }
        },
        resolve: {
            fallback: {
                Buffer: require.resolve('buffer/'),
                stream: require.resolve('stream-browserify')
            }
        }
    })
    .addModuleRule({
        test: /\.(svg|png|wav|mp3|gif|jpg)$/,
        resourceQuery: /^$/, // reject any query string
        type: 'asset' // let webpack decide on the best type of asset
    })
    .addPlugin(new webpack.DefinePlugin({
        'process.env.DEBUG': Boolean(process.env.DEBUG),
        'process.env.GA_ID': `"${process.env.GA_ID || 'UA-000000-01'}"`,
        'process.env.GTM_ENV_AUTH': `"${process.env.GTM_ENV_AUTH || ''}"`,
        'process.env.GTM_ID': process.env.GTM_ID ? `"${process.env.GTM_ID}"` : null,
        'process.env.LOCAL_TASK_PROJECTS': JSON.stringify(taskProjects)
    }))
    .addPlugin(new CopyWebpackPlugin({
        patterns: [
            {
                from: 'node_modules/scratch-blocks/media',
                to: 'static/blocks-media/default'
            },
            {
                from: 'node_modules/scratch-blocks/media',
                to: 'static/blocks-media/high-contrast'
            },
            {
                // overwrite some of the default block media with high-contrast versions
                // this entry must come after copying scratch-blocks/media into the high-contrast directory
                from: 'src/lib/themes/high-contrast/blocks-media',
                to: 'static/blocks-media/high-contrast',
                force: true
            },
            {
                context: 'node_modules/scratch-vm/dist/web',
                from: 'extension-worker.{js,js.map}',
                noErrorOnMissing: true
            }
        ]
    }));

if (!process.env.CI) {
    baseConfig.addPlugin(new webpack.ProgressPlugin());
}

// build the shipping library in `dist/`
const distConfig = baseConfig.clone()
    .merge({
        entry: {
            'scratch-gui': path.join(__dirname, 'src/index.js')
        },
        output: {
            path: path.resolve(__dirname, 'dist')
        }
    })
    .addExternals(['react', 'react-dom'])
    .addPlugin(
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/lib/libraries/*.json',
                    to: 'libraries',
                    flatten: true,
                    globOptions: {
                        ignore: [
                            '**/backdrops.json',
                            '**/sounds.json',
                            '**/sprites.json'
                        ]
                    }
                }
            ]
        })
    );

// build the examples and debugging tools in `build/`
const buildConfig = baseConfig.clone()
    .enableDevServer(process.env.PORT || 8601)
    .merge({
        entry: {
            gui: './src/playground/index.jsx',
            blocksonly: './src/playground/blocks-only.jsx',
            compatibilitytesting: './src/playground/compatibility-testing.jsx',
            player: './src/playground/player.jsx'
        },
        output: {
            path: path.resolve(__dirname, 'build')
        }
    })
    .addPlugin(new HtmlWebpackPlugin({
        ...commonHtmlWebpackPluginOptions,
        chunks: ['gui'],
        template: 'src/playground/index.ejs',
        staticPath: 'static',
        title: 'Редактор'
    }))
    .addPlugin(new HtmlWebpackPlugin({
        ...commonHtmlWebpackPluginOptions,
        chunks: ['gui'],
        filename: 'interview/index.html',
        template: 'src/playground/index.ejs',
        staticPath: '../static',
        title: 'Редактор'
    }))
    .addPlugin(new HtmlWebpackPlugin({
        ...commonHtmlWebpackPluginOptions,
        chunks: ['gui'],
        filename: 'VU/index.html',
        template: 'src/playground/index.ejs',
        staticPath: '../static',
        title: 'Редактор'
    }))
    .addPlugin(new HtmlWebpackPlugin({
        ...commonHtmlWebpackPluginOptions,
        chunks: ['gui'],
        filename: 'M5U6/index.html',
        template: 'src/playground/index.ejs',
        staticPath: '../static',
        title: 'Редактор'
    }))
    .addPlugin(new HtmlWebpackPlugin({
        ...commonHtmlWebpackPluginOptions,
        chunks: ['blocksonly'],
        filename: 'blocks-only.html',
        template: 'src/playground/index.ejs',
        title: 'Scratch 3.0 GUI: Blocks Only Example'
    }))
    .addPlugin(new HtmlWebpackPlugin({
        ...commonHtmlWebpackPluginOptions,
        chunks: ['compatibilitytesting'],
        filename: 'compatibility-testing.html',
        template: 'src/playground/index.ejs',
        title: 'Scratch 3.0 GUI: Compatibility Testing'
    }))
    .addPlugin(new HtmlWebpackPlugin({
        ...commonHtmlWebpackPluginOptions,
        chunks: ['player'],
        filename: 'player.html',
        template: 'src/playground/index.ejs',
        title: 'Scratch 3.0 GUI: Player Example'
    }));

taskProjects.forEach(taskProject => {
    buildConfig.addPlugin(new HtmlWebpackPlugin({
        ...commonHtmlWebpackPluginOptions,
        chunks: ['gui'],
        filename: `${taskProject.urlPath}/index.html`,
        template: 'src/playground/index.ejs',
        staticPath: '../../../../static',
        title: taskProject.mode === 'FS' ? 'Проект' : 'Редактор',
        localTaskProject: taskProject
    }));
});

buildConfig
    .addPlugin(new CopyWebpackPlugin({
        patterns: [
            {
                from: 'static',
                to: 'static'
            },
            {
                from: 'interview',
                to: 'interview'
            },
            {
                from: 'VU',
                to: 'VU'
            },
            {
                from: 'M5U6',
                to: 'M5U6'
            },
            {
                from: 'tasks',
                to: 'tasks',
                noErrorOnMissing: true
            },
            {
                from: 'extensions/**',
                to: 'static',
                context: 'src/examples'
            }
        ]
    }));

// Skip building `dist/` unless explicitly requested
// It roughly doubles build time and isn't needed for `scratch-gui` development
// If you need non-production `dist/` for local dev, such as for `scratch-www` work, you can run something like:
// `BUILD_MODE=dist npm run build`
const buildDist = process.env.NODE_ENV === 'production' || process.env.BUILD_MODE === 'dist';

module.exports = buildDist ?
    [buildConfig.get(), distConfig.get()] :
    buildConfig.get();
