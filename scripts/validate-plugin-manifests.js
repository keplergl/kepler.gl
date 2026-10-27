#!/usr/bin/env node

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Validates the kepler.gl plugin manifests across the three client formats
// (Claude Code, portable Agent Plugins / Codex, Cursor) plus the two
// marketplace files, and guards the hand-copied content between the two skills.
//
// Run from the repo root: node scripts/validate-plugin-manifests.js
// Exits non-zero on any error. No dependencies, so it runs in CI as-is.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PLUGIN_DIR = path.join(ROOT, 'plugins', 'kepler.gl');
const MANIFESTS = {
  claude: path.join(PLUGIN_DIR, '.claude-plugin', 'plugin.json'),
  portable: path.join(PLUGIN_DIR, 'plugin.json'),
  cursor: path.join(PLUGIN_DIR, '.cursor-plugin', 'plugin.json')
};
const MARKETPLACES = {
  claude: path.join(ROOT, '.claude-plugin', 'marketplace.json'),
  codex: path.join(ROOT, '.agents', 'plugins', 'marketplace.json')
};
const AGENT_PLUGINS_SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';
const SHARED_BLOCKS = ['layer-types', 'basemaps', 'trip', 'palettes'];

const errors = [];
const checks = [];

const rel = p => path.relative(ROOT, p).split(path.sep).join('/');
const fail = message => errors.push(message);
const pass = message => checks.push(message);
const isDir = p => fs.existsSync(p) && fs.statSync(p).isDirectory();
const isFile = p => fs.existsSync(p) && fs.statSync(p).isFile();
const normalize = value => String(value).replace(/\s+/g, ' ').trim();
const readText = p => fs.readFileSync(p, 'utf8');

function readJson(file, label) {
  if (!isFile(file)) {
    fail(`${label}: missing ${rel(file)}`);
    return null;
  }
  try {
    return JSON.parse(readText(file));
  } catch (error) {
    fail(`${label}: ${rel(file)} is not valid JSON (${error.message})`);
    return null;
  }
}

function readFrontmatter(file) {
  const text = readText(file);
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return null;
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!field) continue;
    let value = field[2].trim();
    if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
    data[field[1]] = value;
  }
  return {data, body: text.slice(match[0].length)};
}

function skillDirs() {
  const dir = path.join(PLUGIN_DIR, 'skills');
  if (!isDir(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(entry => isDir(path.join(dir, entry)))
    .sort();
}

function extractSharedBlocks(file, label) {
  const text = readText(file);
  const blocks = {};
  for (const name of SHARED_BLOCKS) {
    const pattern = new RegExp(`<!-- shared:${name} -->\\n([\\s\\S]*?)<!-- /shared:${name} -->`);
    const match = text.match(pattern);
    if (!match) {
      fail(`${label}: missing shared block "shared:${name}" in ${rel(file)}`);
      continue;
    }
    blocks[name] = match[1].replace(/\r\n/g, '\n').trim();
  }
  return blocks;
}

function checkLocalSource(source, label, expectedDir) {
  // Agent Plugins: a plain path or {source: "local", path}. Paths are relative
  // to the marketplace root, must start with ./, and must stay inside it.
  const sourcePath = typeof source === 'string' ? source : source && source.path;
  if (typeof source !== 'string' && (!source || source.source !== 'local')) {
    fail(`${label}: expected a local source, got ${JSON.stringify(source)}`);
    return;
  }
  if (!sourcePath || !sourcePath.startsWith('./')) {
    fail(`${label}: source path must start with "./" (got ${JSON.stringify(sourcePath)})`);
    return;
  }
  const resolved = path.resolve(ROOT, sourcePath);
  if (!resolved.startsWith(ROOT + path.sep)) {
    fail(`${label}: source path must stay inside the marketplace root`);
    return;
  }
  if (resolved !== path.resolve(expectedDir)) {
    fail(`${label}: source resolves to ${rel(resolved)}, expected ${rel(expectedDir)}`);
    return;
  }
  pass(`${label}: local source -> ${sourcePath}`);
}

// --- 1. Manifests parse and agree on identity ------------------------------

const manifests = {};
for (const [label, file] of Object.entries(MANIFESTS)) {
  const json = readJson(file, `${label} manifest`);
  if (json) manifests[label] = json;
}

if (Object.keys(manifests).length === Object.keys(MANIFESTS).length) {
  const identity = {};
  for (const [label, json] of Object.entries(manifests)) {
    identity[label] = {
      name: json.name,
      version: json.version,
      description: normalize(json.description)
    };
    if (!json.description) fail(`${label} manifest: missing description`);
    if (!json.version) fail(`${label} manifest: missing version`);
    if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(json.version || '')) {
      fail(`${label} manifest: version "${json.version}" is not semver`);
    }
  }
  const reference = identity.claude;
  for (const [label, value] of Object.entries(identity)) {
    if (value.name !== reference.name) {
      fail(`${label} manifest: name "${value.name}" != "${reference.name}"`);
    }
    if (value.version !== reference.version) {
      fail(`${label} manifest: version "${value.version}" != "${reference.version}"`);
    }
    if (value.description !== reference.description) {
      fail(`${label} manifest: description differs from the Claude manifest`);
    }
  }
  // Claude.ai marketplace sync and Codex both require a kebab-case id; the
  // display name ("kepler.gl") lives in the Cursor and OpenAI metadata.
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(reference.name || '')) {
    fail(`plugin name "${reference.name}" is not kebab-case`);
  } else {
    pass(`manifests agree on name/version/description (${reference.name}@${reference.version})`);
  }
}

// --- 2. Portable (Codex / Agent Plugins) manifest --------------------------

if (manifests.portable) {
  const portable = manifests.portable;
  if (portable.$schema !== AGENT_PLUGINS_SCHEMA) {
    fail(`portable manifest: $schema must be exactly ${AGENT_PLUGINS_SCHEMA}`);
  } else {
    pass('portable manifest: $schema is the Agent Plugins 1.0.0 schema');
  }
  if (
    !portable.name ||
    !/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(portable.name) ||
    portable.name.includes('--') ||
    portable.name.includes('..')
  ) {
    fail(`portable manifest: name "${portable.name}" violates the Agent Plugins name rules`);
  }
  if (portable.author && typeof portable.author !== 'object') {
    fail('portable manifest: author must be an object ({name, email, url})');
  }
  const openai = portable.extensions && portable.extensions['com.openai'];
  if (!openai || typeof openai !== 'object') {
    fail('portable manifest: missing extensions["com.openai"]');
  } else if (!openai.interface || typeof openai.interface !== 'object') {
    fail('portable manifest: extensions["com.openai"].interface must be an object');
  } else {
    const ui = openai.interface;
    for (const key of ['displayName', 'shortDescription', 'category']) {
      if (!ui[key]) fail(`portable manifest: extensions["com.openai"].interface.${key} is missing`);
    }
    if (ui.brandColor && !/^#[0-9A-Fa-f]{6}$/.test(ui.brandColor)) {
      fail(`portable manifest: brandColor "${ui.brandColor}" is not #RRGGBB`);
    }
    if (ui.defaultPrompt && !Array.isArray(ui.defaultPrompt)) {
      fail('portable manifest: interface.defaultPrompt must be an array');
    }
    for (const key of ['composerIcon', 'logo']) {
      const asset = ui[key];
      if (!asset) continue;
      if (!asset.startsWith('./')) {
        fail(`portable manifest: interface.${key} must start with "./"`);
      } else if (!isFile(path.join(PLUGIN_DIR, asset))) {
        fail(`portable manifest: interface.${key} -> ${asset} does not exist`);
      }
    }
    pass('portable manifest: com.openai interface metadata is complete');
  }
}

// --- 3. Cursor manifest ----------------------------------------------------

// Cursor reads <plugin>/.cursor-plugin/plugin.json — a root cursor-plugin.json
// is a legacy path that current Cursor does not load. The manifest is closed
// (additionalProperties: false) and its author object allows only name/email,
// so the checks below mirror the published schema instead of inventing fields.
const CURSOR_KEYS = [
  'name',
  'displayName',
  'description',
  'version',
  'minClientVersions',
  'author',
  'publisher',
  'homepage',
  'repository',
  'license',
  'logo',
  'keywords',
  'category',
  'tags',
  'commands',
  'agents',
  'skills',
  'rules',
  'hooks',
  'variables',
  'mcpServers'
];
if (manifests.cursor) {
  const cursor = manifests.cursor;
  for (const key of Object.keys(cursor)) {
    if (!CURSOR_KEYS.includes(key)) fail(`cursor manifest: unsupported field "${key}"`);
  }
  if (!cursor.author || typeof cursor.author !== 'object' || !cursor.author.name) {
    fail('cursor manifest: author must be an object with a name');
  } else {
    for (const key of Object.keys(cursor.author)) {
      if (!['name', 'email'].includes(key)) {
        fail(`cursor manifest: author.${key} is not in the Cursor schema`);
      }
    }
  }
  if (cursor.repository && typeof cursor.repository !== 'string') {
    fail('cursor manifest: repository must be a URL string');
  }
  if (cursor.logo && !isFile(path.join(PLUGIN_DIR, cursor.logo))) {
    fail(`cursor manifest: logo -> ${cursor.logo} does not exist`);
  }
  if (cursor.skills) {
    const dir = typeof cursor.skills === 'string' ? cursor.skills : cursor.skills[0];
    if (!isDir(path.join(PLUGIN_DIR, dir))) {
      fail(`cursor manifest: skills -> ${dir} does not exist`);
    } else {
      pass(`cursor manifest: skills -> ${dir}`);
    }
  }
}
if (isFile(path.join(PLUGIN_DIR, 'cursor-plugin.json'))) {
  fail('plugins/kepler.gl/cursor-plugin.json is a legacy path — use .cursor-plugin/plugin.json');
}

// --- 4. Skill discovery and frontmatter -----------------------------------

const dirs = skillDirs();
const foundSkills = {};
if (dirs.length !== 2) {
  fail(`skills/: expected 2 skill directories, found ${dirs.length} (${dirs.join(', ')})`);
}
for (const dir of dirs) {
  const skillFile = path.join(PLUGIN_DIR, 'skills', dir, 'SKILL.md');
  if (!isFile(skillFile)) {
    fail(`skills/${dir}: missing SKILL.md`);
    continue;
  }
  const frontmatter = readFrontmatter(skillFile);
  if (!frontmatter) {
    fail(`skills/${dir}: SKILL.md has no YAML frontmatter`);
    continue;
  }
  const {name, description} = frontmatter.data;
  if (!name) fail(`skills/${dir}: frontmatter is missing "name"`);
  else if (name !== dir) {
    fail(`skills/${dir}: frontmatter name "${name}" must match the directory name`);
  }
  if (!description) fail(`skills/${dir}: frontmatter is missing "description"`);
  if (name && description) foundSkills[name] = frontmatter;
}

const appSkillYaml = path.join(PLUGIN_DIR, 'skills', 'kepler-gl-app', 'skill.yaml');
if (foundSkills['kepler-gl-app'] && isFile(appSkillYaml)) {
  fail(
    'skills/kepler-gl-app: skill.yaml must not exist — skill metadata lives in the SKILL.md frontmatter'
  );
}

if (manifests.claude && Array.isArray(manifests.claude.skills)) {
  for (const entry of manifests.claude.skills) {
    if (!isDir(path.join(PLUGIN_DIR, entry))) {
      fail(`claude manifest: skills entry ${entry} does not exist`);
    }
  }
  if (manifests.claude.skills.length === 2) {
    pass('claude manifest: both skill directories are declared');
  }
}

// --- 5. Shared blocks stay identical --------------------------------------

const pythonSkill = path.join(PLUGIN_DIR, 'skills', 'keplergl-python', 'SKILL.md');
const appSkill = path.join(PLUGIN_DIR, 'skills', 'kepler-gl-app', 'SKILL.md');
if (isFile(pythonSkill) && isFile(appSkill)) {
  const pythonBlocks = extractSharedBlocks(pythonSkill, 'keplergl-python');
  const appBlocks = extractSharedBlocks(appSkill, 'kepler-gl-app');
  let drift = false;
  for (const name of SHARED_BLOCKS) {
    if (pythonBlocks[name] && appBlocks[name] && pythonBlocks[name] !== appBlocks[name]) {
      fail(`shared block "shared:${name}" differs between keplergl-python and kepler-gl-app`);
      drift = true;
    }
  }
  if (!drift && Object.keys(pythonBlocks).length === SHARED_BLOCKS.length) {
    pass(`shared blocks are identical across both skills (${SHARED_BLOCKS.join(', ')})`);
  }
}

// --- 6. App skill tracks its source in src/mcp -----------------------------
// src/mcp/skill/kepler/SKILL.md is served verbatim by @kepler.gl/mcp and the
// demo app, so it stays the source of truth; the plugin copy adds frontmatter
// and a cross-surface appendix and must otherwise match.

const sourceSkill = path.join(ROOT, 'src', 'mcp', 'skill', 'kepler', 'SKILL.md');
if (isFile(appSkill) && isFile(sourceSkill)) {
  const app = readFrontmatter(appSkill);
  const sourceBody = readText(sourceSkill).replace(/\r\n/g, '\n').trim();
  const appBody = app ? app.body.replace(/\r\n/g, '\n').trim() : '';
  if (!appBody.startsWith(sourceBody)) {
    fail(
      'skills/kepler-gl-app/SKILL.md no longer starts with src/mcp/skill/kepler/SKILL.md — ' +
        're-copy the source body (frontmatter + cross-surface appendix go around it)'
    );
  } else {
    pass('kepler-gl-app body matches src/mcp/skill/kepler/SKILL.md');
  }

  const skillYaml = path.join(ROOT, 'src', 'mcp', 'skill', 'kepler', 'skill.yaml');
  if (isFile(skillYaml)) {
    const description = (readText(skillYaml).match(/^description:\s*(.+)$/m) || [])[1];
    if (!description) {
      fail('src/mcp/skill/kepler/skill.yaml: could not read description');
    } else if (normalize(app.data.description) !== normalize(description)) {
      fail(
        'skills/kepler-gl-app/SKILL.md frontmatter description differs from ' +
          'src/mcp/skill/kepler/skill.yaml (keep the two in sync)'
      );
    } else {
      pass('kepler-gl-app description matches src/mcp/skill/kepler/skill.yaml');
    }
  }
}

// --- 7. Python skill references resolve -----------------------------------

if (isFile(pythonSkill)) {
  const text = readText(pythonSkill);
  const links = [...text.matchAll(/\]\((references\/[^)\s]+)\)/g)].map(m => m[1]);
  const missing = links.filter(link => !isFile(path.join(path.dirname(pythonSkill), link)));
  if (missing.length) {
    fail(`keplergl-python: broken reference links -> ${missing.join(', ')}`);
  } else {
    pass(`keplergl-python: ${links.length} reference links resolve`);
  }
  const referenced = new Set(links.map(link => path.basename(link)));
  const onDisk = fs.readdirSync(path.join(path.dirname(pythonSkill), 'references'));
  const orphans = onDisk.filter(file => !referenced.has(file));
  if (orphans.length) {
    fail(`keplergl-python: references not linked from SKILL.md -> ${orphans.join(', ')}`);
  }
}

// --- 8. Marketplaces point at the plugin ----------------------------------

const claudeMarketplace = readJson(MARKETPLACES.claude, 'claude marketplace');
if (claudeMarketplace) {
  const errorsBefore = errors.length;
  if (!claudeMarketplace.name) fail('claude marketplace: missing name');
  if (!claudeMarketplace.owner || !claudeMarketplace.owner.name) {
    fail('claude marketplace: missing owner.name');
  }
  const entries = claudeMarketplace.plugins || [];
  if (entries.length !== 1) fail(`claude marketplace: expected 1 plugin, found ${entries.length}`);
  for (const entry of entries) {
    if (!entry.name) fail('claude marketplace: plugin entry is missing name');
    if (manifests.portable && entry.name !== manifests.portable.name) {
      fail(
        `claude marketplace: plugin "${entry.name}" != manifest name "${manifests.portable.name}"`
      );
    }
    checkLocalSource(entry.source, 'claude marketplace', PLUGIN_DIR);
  }
  if (errors.length === errorsBefore) pass('claude marketplace points at plugins/kepler.gl');
}

const codexMarketplace = readJson(MARKETPLACES.codex, 'codex marketplace');
if (codexMarketplace) {
  const errorsBefore = errors.length;
  if (!codexMarketplace.name) fail('codex marketplace: missing name');
  const entries = codexMarketplace.plugins || [];
  if (entries.length !== 1) fail(`codex marketplace: expected 1 plugin, found ${entries.length}`);
  for (const entry of entries) {
    if (!entry.name) fail('codex marketplace: plugin entry is missing name');
    if (!entry.category) fail('codex marketplace: plugin entry is missing category');
    if (manifests.portable && entry.name !== manifests.portable.name) {
      fail(
        `codex marketplace: plugin "${entry.name}" != manifest name "${manifests.portable.name}"`
      );
    }
    if (entry.policy) {
      const {installation, authentication} = entry.policy;
      if (!['NOT_AVAILABLE', 'AVAILABLE', 'INSTALLED_BY_DEFAULT'].includes(installation)) {
        fail(`codex marketplace: invalid policy.installation "${installation}"`);
      }
      if (!['ON_INSTALL', 'ON_USE'].includes(authentication)) {
        fail(`codex marketplace: invalid policy.authentication "${authentication}"`);
      }
    }
    checkLocalSource(entry.source, 'codex marketplace', PLUGIN_DIR);
  }
  if (errors.length === errorsBefore) pass('codex marketplace points at plugins/kepler.gl');
}

// --- Report ---------------------------------------------------------------

for (const check of checks) console.log(`  ✔ ${check}`);
if (errors.length) {
  console.error(`\n✘ ${errors.length} problem(s):`);
  for (const error of errors) console.error(`  ✘ ${error}`);
  process.exit(1);
}
console.log('\n✔ Plugin manifests are consistent.');
