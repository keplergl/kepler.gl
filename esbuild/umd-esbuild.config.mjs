// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import esbuild from 'esbuild';
import {replace} from 'esbuild-plugin-replace';
import {umdWrapper} from 'esbuild-plugin-umd-wrapper';

import process from 'node:process';
import {spawn} from 'node:child_process';
import {join} from 'node:path';
import KeplerPackage from '../package.json' assert {type: 'json'};

const LIB_DIR = './';
const NODE_MODULES_DIR = join(LIB_DIR, 'node_modules');
const SRC_DIR = join(LIB_DIR, 'src');

const config = {
  entryPoints: ['./src/index.js'],
  bundle: true,
  platform: 'browser',
  outfile: './umd/keplergl.min.js',
  format: 'umd',
  logLevel: 'error',
  minify: true,
  sourcemap: false,
  treeShaking: true,

  external: ['react', 'react-dom', 'redux', 'react-redux', 'styled-components'],

  plugins: [
    // automatically injected kepler.gl package version into the bundle
    replace({
      __PACKAGE_VERSION__: KeplerPackage.version,
      include: /constants\/src\/default-settings\.ts/
    }),
    umdWrapper({
      libraryName: "KeplerGl",
      globals: {
        "react": "React",
        "react-dom": "ReactDOM",
        'redux': 'Redux', 
        'react-redux': 'ReactRedux', 
        'styled-components': 'styled'
      }
    })
  ]
};

(async () => {
  await esbuild
    .build({
      ...config
    })
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
})();
