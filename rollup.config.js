const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');
const sourcemaps = require('rollup-plugin-sourcemaps');
const del = require('rollup-plugin-delete');
const strip = require('@rollup/plugin-strip');
const analyze = require('rollup-plugin-analyzer');
const pkg = require('./package.json');

const isDevelopment = process.env.NODE_ENV === 'development';

export default {
    input: 'src/index.js',
    output: [
        {
            exports: 'named',
            format: 'esm',
            file: pkg.module,
            sourcemap: isDevelopment ? 'inline' : false
        },
        {
            format: 'cjs',
            exports: 'named',
            file: pkg.main,
            sourcemap: isDevelopment ? 'inline' : false
        }
    ],
    external: [
        ...Object.keys(pkg.peerDependencies || {}).map((external) => {
            return external;
        })
    ],
    plugins: [
        del({ targets: 'dist/*' }),
        nodeResolve(),
        babel({
            exclude: '**/node_modules/**',
            extensions: ['js'],
            babelHelpers: 'bundled'
        }),
        strip({
            debugger: !isDevelopment,
            functions: isDevelopment ? [] : ['console.*', 'assert.*', 'debug', 'alert'],
            sourceMap: !isDevelopment
        }),
        !isDevelopment ? terser() : null,
        isDevelopment ? sourcemaps() : null,
        analyze()
    ]
};
