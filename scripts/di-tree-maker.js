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

import * as parser from '@babel/parser';
import fs from 'fs';
import traverse from '@babel/traverse';

import {resolve, join} from 'path';

const SRC_DIR = './src';
const entry = join(SRC_DIR, 'components');

const allFiles = walkSync(entry, []);
const treeMap = {}
const ROOT = 'ContainerFactory';

allFiles.forEach(file => {
  traverseTree(file, treeMap);
});

const root = findRoot(treeMap);
const html = fs.readFileSync(resolve('./scripts/tree-template.html'), 'utf8');
const template = 'var dependencyTree = {}';
const injected = html.replace(template, `var dependencyTree = ${JSON.stringify(root)}`);

fs.writeFile('./scripts/tree.html', injected, 'utf8', function(err) {
  if (err) {
      return console.warn(err);
  }

  console.log("The html file was saved!");
});

fs.writeFile('./scripts/component-dependencies.json', JSON.stringify(root), 'utf8', function(err) {
  if (err) {
      return console.warn(err);
  }

  console.log("The json file was saved!");
});


// find treeMap root
function findRoot(treeMap) {
  const root = Object.values(treeMap).filter(node => node.isRoot);
  if (root.length !== 1) {
    console.warn('we find 0 or more than 1 roots', root.map(r => r.name).join(', '))
    return treeMap[ROOT];
  }

  return root[0];
}

function makeFactoryNode(name, path) {
  return {name, label: name.replace('Factory', ''), path, children: [], isRoot: true};
}

function addPathByFactoryDeclaration(path, treeMap, filePath) {
  const {id, loc} = path.node;
  if (id.name && id.name.endsWith('Factory')) {
    // debugger
    treeMap[id.name] = treeMap[id.name] || makeFactoryNode(id.name, filePath);
    treeMap[id.name].path = filePath + '#L' + loc.start.line + '-' + 'L' + loc.end.line;
  }
}

function traverseTree(filePath, treeMap = {}) {
  const content = fs.readFileSync(filePath, 'utf8')
  const ast = parser.parse(content, {
    sourceType: 'module',
    plugins: ['jsx', 'classProperties', 'exportNamespaceFrom', 'decorators-legacy']
  });
  // console.log(filePath);
  traverse(ast, {
    VariableDeclarator(path) {
      addPathByFactoryDeclaration(path, treeMap, filePath);
    },
    FunctionDeclaration(path) {
      addPathByFactoryDeclaration(path, treeMap, filePath);
    },
    AssignmentExpression(path) {

      const {left, right, loc} = path.node;

      if (
        left.type === "MemberExpression" &&
        left.property.type === 'Identifier' &&
        left.property.name === 'deps'
      ) {
        if (!right.type === 'ArrayExpression') {
          console.warn('warning: detected nonsense at:', path)
          return;
        }

        const factory = left.object.name;
        const deps = right.elements.map(e => e.name);

        treeMap[factory] = treeMap[factory] || makeFactoryNode(factory, filePath);
        treeMap[factory].path = filePath + '#L' + loc.start.line + '-' + 'L' + loc.end.line;

        deps.forEach(dep => {

          treeMap[dep] = treeMap[dep] || makeFactoryNode(dep, '');
          treeMap[dep].isRoot = false;
          treeMap[factory].children.push(treeMap[dep]);
        })
        // console.log(left.object.name, right.elements.map(e => e.name) )
      }
    }
  });

  return treeMap;
}

function walkSync(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const path = join(dir, file);

    if (fs.statSync(path).isDirectory()) {
      fileList = walkSync(path, fileList);
    } else if (path.endsWith('.js')){
      fileList.push(path);
    }
  });
  return fileList;
};
