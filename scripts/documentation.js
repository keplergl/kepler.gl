// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import documentation from 'documentation';
import fs from 'fs';
import {resolve, join, basename, dirname} from 'path';
import {logSuccess, logProgress, logOk, logStep, logError} from './log';
import remark from 'remark';
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
            'src/action-types.ts',
            'src/actions.ts',
            'src/action-wrapper.ts',
            'src/vis-state-actions.ts',
            'src/ui-state-actions.ts',
            'src/map-state-actions.ts',
            'src/map-style-actions.ts',
            'src/identity-actions.ts'
          ],
          output: 'actions.md',
          config: {shallow: true}
        }
      ]
    },
    {
      path: 'reducers',
      children: [
        {input: ['src/root.ts', 'src/core.ts'], output: 'reducers.md', config: {shallow: true}},
        {
          input: 'src/combined-updaters.ts',
          handler: 'src/composers.ts',
          output: 'combine.md',
          config: {shallow: true}
        },
        {
          input: 'src/vis-state-updaters.ts',
          handler: 'src/vis-state.ts',
          output: 'vis-state.md',
          config: {shallow: true}
        },
        {
          input: 'src/map-state-updaters.ts',
          handler: 'src/map-state.ts',
          output: 'map-state.md',
          config: {shallow: true}
        },
        {
          input: 'src/map-style-updaters.ts',
          handler: 'src/map-style.ts',
          output: 'map-style.md',
          config: {shallow: true}
        },
        {
          input: 'src/ui-state-updaters.ts',
          handler: 'src/ui-state.ts',
          output: 'ui-state.md',
          config: {shallow: true}
        }
      ]
    },
    {
      path: 'processors',
      children: [{input: 'src/data-processor.ts', output: 'processors.md', config: {shallow: true}}]
    },
    {
      path: 'cloud-providers',
      children: [{input: 'src/provider.ts', output: 'cloud-provider.md', config: {shallow: true}}]
    }
  ]
};

function _overrideHeading(nodes) {
  const contents = ['Examples', 'Parameters'];
  const mdContents = contents.map(text => {
    return unified().use(markdown).parse(`__${text}__`);
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
      ({updater, name, outputPath}) =>
        `[${BT}${updater}.${name}${BT}](../reducers/${basename(outputPath)}#${name.toLowerCase()})`
    )
    .join(', ');

  const mdContent = `
  * __ActionTypes__: [${BT}ActionTypes.${actionType}${BT}](#actiontypes)
  ${updaterList ? `* __Updaters__: ${updaterList}` : ''}
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
  const tree = unified().use(markdown).parse(mdContent);

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

function buildChildDoc({inputPaths, outputPath, comments}, actionMap) {
  let processed = comments;
  if (outputPath.includes('actions.md')) {
    processed = comments.map(node => _appendActionTypesAndUpdatersToActions(node, actionMap));
  } else if (inputPaths.some(p => p.includes('reducers'))) {
    processed = comments.map(node => _appendActionToUpdaters(node, actionMap));
  }

  return documentation.formats.remark(processed, OUT_CONFIG).then(output => {
    const ast = JSON.parse(output);
    ast.children = _overrideHeading(ast.children);
    if (ast.children[2]) {
      ast.children[2] = _cleanUpTOCChildren(ast.children[2]);
    }
    ast.children = ast.children.filter(Boolean);
    const mdOutput = remark().stringify(ast);
    fs.mkdirSync(dirname(outputPath), {recursive: true});
    fs.writeFileSync(outputPath, mdOutput);
    logOk(`   ✓ build docs ${inputPaths} -> ${outputPath}`);
  });
}

// Only cross-link symbols that are actually included in the public API pages.
function documentedNames(comments) {
  return comments.flatMap(node => [node.name, ...documentedNames(node.members?.static || [])]);
}

function buildMdDocs(nodePath, node, allTasks) {
  const {path, children} = node;
  const joinPath = nodePath ? `${nodePath}/${path}` : path;

  children.forEach(child => {
    if (!child.children) {
      const {input, handler, output, config} = child;
      const inputPaths = (Array.isArray(input) ? input : [input]).map(inp => {
        const inputPath = join(PATHS.src, joinPath, inp);
        if (!fs.existsSync(inputPath)) {
          throw new Error(`${inputPath} doesn't exist!`);
        }
        return inputPath;
      });
      const outputPath = join(PATHS.api, joinPath, output);
      const handlerPath = handler && join(PATHS.src, joinPath, handler);

      allTasks.push({inputPaths, handlerPath, outputPath, config});
    } else {
      buildMdDocs(joinPath, child, allTasks);
    }
  });

  return allTasks;
}

async function buildDocs() {
  logProgress('\n================= Start Building API Documentation =================\n');

  logStep('   ## 1. Gathering action and updater mapping');
  const actionMap = actionTableMaker();

  logStep('   ## 2. Build Markdown files from jsDoc');
  const allTasks = buildMdDocs(null, TREE, []);
  const pages = await Promise.all(
    allTasks.map(async page => ({
      ...page,
      comments: await documentation.build(page.inputPaths, {...INPUT_CONFIG, ...page.config})
    }))
  );
  const symbols = new Map(
    pages.map(page => [page.outputPath, new Set(documentedNames(page.comments))])
  );
  const updaterPages = new Map(
    pages.filter(page => page.handlerPath).map(page => [page.handlerPath, page.outputPath])
  );
  const publicActions = symbols.get(join(PATHS.api, 'actions/actions.md'));
  const publicActionMap = Object.fromEntries(
    Object.entries(actionMap)
      .filter(([name]) => publicActions.has(name))
      .map(([name, action]) => [
        name,
        {
          ...action,
          updaters: action.updaters
            .map(updater => ({...updater, outputPath: updaterPages.get(resolve(updater.path))}))
            .filter(updater => symbols.get(updater.outputPath)?.has(updater.name))
        }
      ])
  );

  await Promise.all(pages.map(page => buildChildDoc(page, publicActionMap)));
  logSuccess('\n================= Building API Documentation Success! =================\n');
}

buildDocs().catch(err => {
  logError(err);
  process.exitCode = 1;
});
