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

// React 19 removed UMD builds, and the automatic JSX runtime resolves JSX to
// `react/jsx-runtime` (`jsx`/`jsxs`/`Fragment`) and `react/jsx-dev-runtime`
// (`jsxDEV`). kepler.gl's own source uses the classic runtime, but several
// bundled dependencies (e.g. deck.gl React bindings) are precompiled with the
// automatic runtime, so `require("react/jsx-runtime")` ends up in the UMD
// output. Since we keep `react` external (a single global `React` provided by
// the exported HTML), that subpath would resolve to `undefined` at runtime and
// throw "Cannot read properties of undefined (reading 'jsxs')".
//
// This plugin provides a tiny in-bundle implementation of the JSX runtimes that
// is built on top of the external `React` global (via React.createElement), so
// no extra global is required and the single React instance is preserved.
const jsxRuntimeShimPlugin = {
  name: 'react-jsx-runtime-shim',
  setup(build) {
    build.onResolve({filter: /^react\/jsx-(dev-)?runtime$/}, args => ({
      path: args.path,
      namespace: 'react-jsx-runtime-shim'
    }));

    build.onLoad({filter: /.*/, namespace: 'react-jsx-runtime-shim'}, () => ({
      // `react` stays external here too, so this resolves to the global React.
      contents: `
        import * as React from 'react';
        var createElement = React.createElement;
        export var Fragment = React.Fragment;
        function jsxWithKey(type, config, maybeKey) {
          var props = {};
          var key = maybeKey === undefined ? null : '' + maybeKey;
          for (var propName in config) {
            if (propName !== 'key') props[propName] = config[propName];
          }
          if (config && config.key !== undefined && key === null) {
            key = '' + config.key;
          }
          return createElement.apply(null, [type, key === null ? props : Object.assign({key: key}, props)]);
        }
        export var jsx = jsxWithKey;
        export var jsxs = jsxWithKey;
        export var jsxDEV = jsxWithKey;
      `,
      loader: 'js',
      resolveDir: SRC_DIR
    }));
  }
};

// react-audio-voice-recorder (pulled in transitively via @openassistant/ui for
// the AI assistant's voice input) ships a prebuilt bundle that vendors a
// React 17 jsx-runtime. That vendored runtime reads
// `React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner`
// at module-eval time WITHOUT optional chaining, which throws under React 19
// (the property was removed), breaking the whole UMD bundle at load. We only
// consume its `useAudioRecorder` hook, so we exclude the real package from the
// UMD bundle and substitute a no-op stub. The exported static map therefore
// works under React 19; the only lost capability is voice input in the AI
// assistant (which requires a build tool / npm consumer anyway).
const audioRecorderStubPlugin = {
  name: 'react-audio-voice-recorder-stub',
  setup(build) {
    build.onResolve({filter: /^react-audio-voice-recorder$/}, args => ({
      path: args.path,
      namespace: 'react-audio-voice-recorder-stub'
    }));

    build.onLoad({filter: /.*/, namespace: 'react-audio-voice-recorder-stub'}, () => ({
      contents: `
        export function useAudioRecorder() {
          return {
            isRecording: false,
            recordingBlob: undefined,
            startRecording: function() {},
            stopRecording: function() {},
            togglePauseResume: function() {},
            recordingTime: 0,
            isPaused: false,
            mediaRecorder: undefined
          };
        }
        export function AudioRecorder() { return null; }
        export default {useAudioRecorder: useAudioRecorder, AudioRecorder: AudioRecorder};
      `,
      loader: 'js',
      resolveDir: SRC_DIR
    }));
  }
};

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

  // React 19+ no longer ships UMD builds, but the kepler.gl UMD bundle keeps
  // these dependencies external and expects them as globals on `window`
  // (React, ReactDOM, Redux, ReactRedux, styled). The exported static HTML map
  // (see src/utils/src/export-map-html.ts) provides these globals by loading the
  // corresponding ES modules from an ESM CDN through an import map. Keep the list
  // of externals and the globals map below in sync with that template.
  // Note: `react/jsx-runtime` is intentionally NOT external; it is shimmed on top
  // of the external `React` global by jsxRuntimeShimPlugin below.
  external: ['react', 'react-dom', 'redux', 'react-redux', 'styled-components'],

  plugins: [
    jsxRuntimeShimPlugin,
    audioRecorderStubPlugin,
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
