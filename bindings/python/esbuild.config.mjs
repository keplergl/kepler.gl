import * as esbuild from 'esbuild';
import path from 'path';
import {fileURLToPath} from 'url';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isWatch = process.argv.includes('--watch');

// Resolve apache-arrow to a single location
const arrowPath = path.dirname(require.resolve('apache-arrow'));

const buildOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'esm',
  outdir: 'keplergl/static',
  outExtension: {'.js': '.js'},
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
    'process.env.NODE_ENV': isWatch ? '"development"' : '"production"'
  },
  // Use alias to ensure single instance of apache-arrow
  alias: {
    'apache-arrow': arrowPath
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
