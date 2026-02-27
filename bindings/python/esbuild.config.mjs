import * as esbuild from 'esbuild';
import path from 'path';
import {fileURLToPath} from 'url';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isWatch = process.argv.includes('--watch');

// Resolve apache-arrow to a single location
const arrowPath = path.dirname(require.resolve('apache-arrow'));

// Resolve browser polyfills for Node.js built-ins (point to actual entry files)
const assertPath = require.resolve('assert/');
const eventsPath = require.resolve('events/');

const buildOptions = {
  entryPoints: {widget: 'src/index.ts'},
  bundle: true,
  format: 'esm',
  outdir: 'keplergl/static',
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
    '.css': 'css'
  },
  external: [],
  minify: !isWatch,
  sourcemap: isWatch,
  target: ['es2020'],
  define: {
    'process.env.NODE_ENV': isWatch ? '"development"' : '"production"',
    'global': 'globalThis'
  },
  inject: ['./src/process-shim.js'],
  // Use alias to ensure single instance of apache-arrow and provide browser polyfills
  alias: {
    'apache-arrow': arrowPath,
    'assert': assertPath,
    'events': eventsPath
  }
};

async function build() {
  if (isWatch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log('Watching for changes...');
  } else {
    await esbuild.build(buildOptions);
    console.log('Build complete!');
  }
}

build().catch(() => process.exit(1));
