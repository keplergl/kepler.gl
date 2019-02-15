// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import documentation from 'documentation';
import fs from 'fs';
import {resolve, join} from 'path';
import {logSuccess, logProgress, logOk} from './log';
import remark from 'remark';
import toc from 'remark-toc';

const INPUT_CONFIG = {
  shallow: true,
  access: ['public'],
  'document-exported': true,
  sortOrder: 'alpha'
};

const OUT_CONFIG = {
  markdownToc: true
};

const PATHS = {
  src: resolve('./src'),
  api: resolve('./docs/api-reference')
};

const TREE = {
  path: '',
  children: [
    {
      path: 'actions',
      children: [
        {
          input: [
            'actions.js',
            'action-wrapper.js',
            '../constants/action-types.js',
            'vis-state-actions.js',
            'ui-state-actions.js',
            'map-state-actions.js',
            'map-style-actions.js',
            'identity-actions.js'
          ], output: 'actions.md', config: {shallow: true}}
      ]
    },
    {
      path: 'reducers',
      children: [
        {input: 'root.js', output: 'reducers.md', config: {shallow: true}},
        {input: 'vis-state-updaters.js', output: 'vis-state.md', config: {shallow: true}},
        {input: 'map-state-updaters.js', output: 'map-state.md', config: {shallow: true}},
        {input: 'map-style-updaters.js', output: 'map-style.md', config: {shallow: true}},
        {input: 'ui-state-updaters.js', output: 'ui-state.md', config: {shallow: true}}
      ]
    }
  ]
}

function buildChildDoc(inputPath, outputPath, config) {
  return documentation.build(inputPath, {...INPUT_CONFIG, ...config})
    .then(res => {
      // res is an array of parsed comments with inferred properties
      // and more: everything you need to build documentation or
      // any other kind of code data.
      return documentation.formats.remark(res, OUT_CONFIG)
    })
    .then(output => {
      // output is a string of remark json
      return remark()
        .use(toc, {maxDepth: 2, tight: true})
        .run(JSON.parse(output));
    })
    .then(ast => {
      const output = remark().stringify(ast);
      fs.writeFileSync(outputPath, output);
      logOk(`   ✓ build docs ${inputPath} -> ${outputPath}`);
    })
    .catch(err => {
      throw err;
    });
}

function buildMdDocs(nodePath, node, allTasks) {

  const {path, children} = node;
  const joinPath = nodePath ? `${nodePath}/${path}` : path;

  children.forEach(child => {

    if (!child.children) {

        const {input, output, shallow} = child;
        const inputPath = (Array.isArray(input) ? input : [input]).map(inp => join(PATHS.src, joinPath, inp));
        const outputPath = join(PATHS.api, joinPath, output);
        allTasks.push(buildChildDoc(inputPath, outputPath, shallow));
    } else {
      buildMdDocs(joinPath, child, allTasks);
    }
  });

  return allTasks;
}

function buildDocs() {
  logProgress('\n================= Start Building API Documentation =================\n');

  const allTasks = buildMdDocs(null, TREE, []);

  Promise.all(allTasks).then(() => {
    logSuccess('\n================= Building API Documentation Success! =================\n');
  })
}

buildDocs();
