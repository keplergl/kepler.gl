// Copyright (c) 2020 Uber Technologies, Inc.
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

import fs from 'fs';
import {resolve, join} from 'path';
import traverse from '@babel/traverse';
import * as parser from '@babel/parser';
import {walkSync} from './ast-helper';

const SRC_DIR = './src';
const entries = [
  // action to type mapping
  join(SRC_DIR, 'actions'),

  // type to updater mapping
  join(SRC_DIR, 'reducers')
];

/**
 * Build action table
 * @public
 */
export function buildActionTable() {
  const allFiles = walkSync(entries, []);

  let actionTypeMap = {};

  allFiles.forEach(file => {
    actionTypeMap = traverseTree(file, actionTypeMap);
  });

  return Object.keys(actionTypeMap).reduce((accu, type) => {
    accu[actionTypeMap[type].action.name] = {
      ...actionTypeMap[type].action,
      updaters: actionTypeMap[type].updaters,
      actionType: type
    };

    return accu;
  }, {});
}

function createActionNode(actionType) {
  return {action: '', updaters: [], actionType};
}

/**
 * Parse actionHandler declaration to map updater to action type
 * @param {Object} path - AST node
 * @param {Object} actionMap
 * @param {string} filePath
 */
function addActionHandler(path, actionMap, filePath) {

  const {init} = path.node;

  if (init && Array.isArray(init.properties)) {
    init.properties.forEach(property => {
      const {key, value} = property;
      if (key && value && key.property && value.property) {
        const actionType = key.property.name;
        const updater = value.name;

        actionMap[actionType] = actionMap[actionType] || createActionNode(actionType);
        actionMap[actionType].updaters.push({
          updater: value.object.name,
          name: value.property.name,
          path: filePath
        });
      }
    })
  }
}

/**
 * Parse createAction function to add action to action type
 * @param {*} path
 * @param {*} actionMap
 * @param {*} filePath
 */
function addActionCreator(path, actionMap, filePath) {

  const {node, parentPath} = path;
  if (node.arguments.length && parentPath.node && parentPath.node.id) {

    const action = parentPath.node.id.name;
    const firstArg = node.arguments[0];
    const actionType = firstArg.property ? firstArg.property.name : firstArg.name;

    const {loc} = parentPath.node
    actionMap[actionType] = actionMap[actionType] || createActionNode(actionType);
    actionMap[actionType].action = {name: action, path: `${filePath}#L${loc.start.line}-L${loc.end.line}`};
  }
}

function addActionDeclaration(path, actionMap, filePath) {
  const {node} = path;

  const action = node.id.name;
  const returnStatement = node.body.body[0];

  const returnValue = returnStatement.argument.properties[0].value;
  const actionType = returnValue.property ? returnValue.property.name : returnValue.name;
  const {loc} = path.node;

  actionMap[actionType] = actionMap[actionType] || createActionNode(actionType);
  actionMap[actionType].action = {name: action, path: `${filePath}#L${loc.start.line}-L${loc.end.line}`};
}

function traverseTree(filePath, actionMap = {}) {
  const content = fs.readFileSync(filePath, 'utf8');

  const ast = parser.parse(content, {
    sourceType: 'module',
    plugins: ['exportNamespaceFrom', 'exportDefaultFrom']
  });

  traverse(ast, {
    VariableDeclarator(path) {
      const {id} = path.node;
      if (id.name === 'actionHandler') {
        addActionHandler(path, actionMap, filePath);
      }
    },
    CallExpression(path)  {
      /**
       * If action is declared with createAction
       * export const togglePerspective = createAction(
       *   ActionTypes.TOGGLE_PERSPECTIVE
       * );
       */
      const {callee} = path.node;
      if (callee.name === 'createAction') {
        addActionCreator(path, actionMap, filePath);
      }
    },
    FunctionDeclaration(path) {
      /**
       * If action is declared with a function call
       * export function layerConfigChange(oldLayer, newConfig) {
       *  return {type: ActionTypes.LAYER_CONFIG_CHANGE};
       * }
       */
      if (filePath.endsWith('actions.js')) {
        const {leadingComments} = path.parentPath.node;
        if (
          Array.isArray(leadingComments) && leadingComments[0] && leadingComments[0].value.includes('@public')
        ) {
          addActionDeclaration(path, actionMap, filePath);
        }

      }

    }

  });

  return actionMap;
}

export default buildActionTable;
