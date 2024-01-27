// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import documentation from 'documentation';
import fs from 'fs';
import {resolve, join} from 'path';
import {logSuccess, logProgress, logOk, logStep, logError} from './log';
import remark from 'remark';
import toc from 'remark-toc';
import unified from 'unified';
import markdown from 'remark-parse';
import actionTableMaker from './action-table-maker';

const INPUT_CONFIG = {
  shallow: true,
  access: ['public'],
  'document-exported': true,
  sortOrder: 'alpha'
  // github: true
};

const OUT_CONFIG = {
  markdownToc: true
};

const PATHS = {
  src: resolve('./src'),
  api: resolve('./docs/api-reference')
};

const BT = '`';

const TREE = {
  path: '',
  children: [
    {
      path: 'actions',
      children: [
        {
          input: [
            '../constants/action-types.js',
            'actions.js',
            'action-wrapper.js',
            'vis-state-actions.js',
            'ui-state-actions.js',
            'map-state-actions.js',
            'map-style-actions.js',
            'identity-actions.js'
          ],
          output: 'actions.md',
          config: {shallow: true}
        }
      ]
    },
    {
      path: 'reducers',
      children: [
        {input: ['root.js', 'core.js'], output: 'reducers.md', config: {shallow: true}},
        {input: 'combined-updaters.js', output: 'combine.md', config: {shallow: true}},
        {input: 'vis-state-updaters.js', output: 'vis-state.md', config: {shallow: true}},
        {input: 'map-state-updaters.js', output: 'map-state.md', config: {shallow: true}},
        {input: 'map-style-updaters.js', output: 'map-style.md', config: {shallow: true}},
        {input: 'ui-state-updaters.js', output: 'ui-state.md', config: {shallow: true}}
      ]
    },
    {
      path: 'processors',
      children: [{input: 'data-processor.js', output: 'processors.md', config: {shallow: true}}]
    },
    {
      path: 'cloud-providers',
      children: [{input: 'provider.js', output: 'cloud-provider.md', config: {shallow: true}}]
    }
  ]
};

function _overrideHeading(nodes) {
  const contents = ['Examples', 'Parameters'];
  const mdContents = contents.map(text => {
    return unified()
      .use(markdown)
      .parse(`__${text}__`);
  });

  return nodes.map(node => {
    if (
      node.type === 'heading' &&
      Array.isArray(node.children) &&
      contents.includes(node.children[0].value)
    ) {
      const value = node.children[0].value;
      const replacement = mdContents[contents.indexOf(value)].children[0];
      return replacement;
    }

    return node;
  });
}

function _appendActionTypesAndUpdatersToActions(node, actionMap) {
  // __Updaters__: [`visStateUpdaters.loadFilesUpdater`](../reducers/ui-state.md#uistateupdaterssetexportfilteredupdater)

  if (node.members && node.members.static.length) {
    node.members.static = node.members.static.map(nd =>
      _appendActionTypesAndUpdatersToActions(nd, actionMap)
    );
  }

  const action = node.name;

  if (!actionMap[action]) {
    return node;
  }

  const {actionType, updaters} = actionMap[action];
  const updaterList = updaters
    .map(
      ({updater, name, path}) =>
        `[${BT}${updater}.${name}${BT}](../reducers/${path.split('/')[2].replace('.js', '')}.md#${(
          updater + name
        ).toLowerCase()})`
    )
    .join(', ');

  const mdContent = `
  * __ActionTypes__: [${BT}ActionTypes.${actionType}${BT}](#actiontypes)
  * __Updaters__: ${updaterList}
  `;

  return _appendListToDescription(node, mdContent);
}

/**
 * Add action to linked updaters
 * @param {Object} node
 * @param {Object} actionMap
 */
function _appendActionToUpdaters(node, actionMap) {
  if (node.members && node.members.static.length) {
    node.members.static = node.members.static.map(nd => _appendActionToUpdaters(nd, actionMap));
  }

  const updater = node.name;

  const action = Object.values(actionMap).find(action =>
    action.updaters.find(up => up.name === updater)
  );

  if (!action) {
    return node;
  }
  const actionName = action.name;

  const mdContent = `
  * __Action__: [${BT}${actionName}${BT}](../actions/actions.md#${actionName.toLowerCase()})
  `;

  return _appendListToDescription(node, mdContent);
}

function _appendListToDescription(node, mdContent) {
  const tree = unified()
    .use(markdown)
    .parse(mdContent);

  if (typeof node.description === 'object') {
    node.description.children = (node.description.children || []).concat(tree.children);
  } else {
    logError(`Missing Description for ${node.name}`);
    node.description = tree;
  }

  return node;
}

function _isParagraph(node) {
  return node.type === 'paragraph' && node.children.length === 1;
}

function _isLink(node) {
  return node.type === 'link' && node.children.length === 1;
}

function _isLinkReference(node) {
  return node.type === 'linkReference' && node.children.length === 1;
}
function _isExampleOrParam(node) {
  return node.type === 'text' && ['Parameters', 'Examples', 'Properties'].includes(node.value);
}

function _isExampleOrParameterLink(node) {
  return (
    _isParagraph(node) &&
    _isLinkReference(node.children[0]) &&
    _isExampleOrParam(node.children[0].children[0])
  );
}

/**
 * Remove example and parameter link from TOC
 */
function _cleanUpTOCChildren(node) {
  if (!Array.isArray(node.children)) {
    return node;
  }

  if (_isExampleOrParameterLink(node)) {
    return null;
  }

  const filteredChildren = node.children
    .reduce((accu, nd) => {
      accu.push(_cleanUpTOCChildren(nd));
      return accu;
    }, [])
    .filter(n => n);

  if (!filteredChildren.length) {
    return null;
  }

  return {
    ...node,
    children: filteredChildren
  };
}

function buildChildDoc(inputPath, outputPath, actionMap, config) {
  return documentation
    .build(inputPath, {...INPUT_CONFIG, ...config})
    .then(res => {
      // res is an array of parsed comments with inferred properties
      // and more: everything you need to build documentation or
      // any other kind of code data.
      let processed = res;

      if (outputPath.includes('actions.md')) {
        // add action type and updater links to action
        processed = res.map(node => _appendActionTypesAndUpdatersToActions(node, actionMap));
      } else if (inputPath.some(p => p.includes('reducers'))) {
        // add action type and updater links to action
        processed = res.map(node => _appendActionToUpdaters(node, actionMap));
      }

      return documentation.formats.remark(processed, OUT_CONFIG);
    })
    .then(output => {
      // output is a string of remark json
      const ast = JSON.parse(output);

      ast.children = _overrideHeading(ast.children);
      if (ast.children.length < 3) {
        logError(inputPath, 'has less than 3 children');
      }
      const tableOfContent = _cleanUpTOCChildren(ast.children[2]);
      ast.children[2] = tableOfContent;

      const mdOutput = remark().stringify(ast);
      fs.writeFileSync(outputPath, mdOutput);
      logOk(`   ✓ build docs ${inputPath} -> ${outputPath}`);
    })
    .catch(err => {
      logError(err);
    });
}

function buildMdDocs(nodePath, node, actionMap, allTasks) {
  const {path, children} = node;
  const joinPath = nodePath ? `${nodePath}/${path}` : path;

  children.forEach(child => {
    if (!child.children) {
      const {input, output, config} = child;
      const inputPaths = (Array.isArray(input) ? input : [input]).reduce((accu, inp) => {
        const inputPath = join(PATHS.src, joinPath, inp);

        if (fs.existsSync(inputPath)) {
          // Do something
          accu.push(inputPath);
        } else {
          logError(`[Error] ${inputPath} doesn't exist!`);
        }

        return accu;
      }, []);

      if (!inputPaths.length) {
        return;
      }
      const outputPath = join(PATHS.api, joinPath, output);

      allTasks.push(buildChildDoc(inputPaths, outputPath, actionMap, config));
    } else {
      buildMdDocs(joinPath, child, actionMap, allTasks);
    }
  });

  return allTasks;
}

function buildDocs() {
  logProgress('\n================= Start Building API Documentation =================\n');

  logStep('   ## 1. Gathering action and updater mapping');
  const actionMap = actionTableMaker();

  logStep('   ## 2. Build Markdown files from jsDoc');
  const allTasks = buildMdDocs(null, TREE, actionMap, []);

  Promise.all(allTasks).then(() => {
    logSuccess('\n================= Building API Documentation Success! =================\n');
  });
}

buildDocs();
