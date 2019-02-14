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
  'document-exported': true
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
        ['index', 'actions', false]
      ]
    },
    {
      path: 'reducers',
      children: [
        ['root', 'reducers', true],
        ['vis-state-updaters', 'vis-state', true],
        ['map-state-updaters', 'map-state', true],
        ['map-style-updaters', 'map-style', true],
        ['ui-state-updaters', 'ui-state', true]
      ]
    }
  ]
}

function buildMdDocs(nodePath, node) {

  const {path, children} = node;
  const joinPath = nodePath ? `${nodePath}/${path}` : path;

  children.forEach(child => {

    if (typeof child === 'string' || Array.isArray(child)) {
        const inF  = Array.isArray(child) ? child[0] : child;
        const outF = Array.isArray(child) ? child[1] : child;

        const inputPath = join(PATHS.src, joinPath, `${inF}.js`);
        const outputPath = join(PATHS.api, joinPath, `${outF}.md`);
        const shallow = child[2];

        documentation.build([inputPath], {...INPUT_CONFIG, shallow})
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
          });
    } else {
      buildMdDocs(joinPath, child);
    }
  });

}

function buildDocs() {
  logProgress('\n\n================= Start Building API Documentation =================');

  // 1. build docs
  buildMdDocs(null, TREE);

  logSuccess('\n\n================= Building API Documentation Success! =================');
}

buildDocs();
