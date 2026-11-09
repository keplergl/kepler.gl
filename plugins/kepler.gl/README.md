# kepler.gl plugin for AI assistants

One plugin, two skills, three client manifests. It replaces the former `skill/`
directory (the Python-only skill, version 0.0.1) and carries the `map.*` app
skill that ships with `src/mcp/`.

| Skill | Surface | Use it when |
|-------|---------|-------------|
| [`keplergl-python`](skills/keplergl-python/SKILL.md) | The `keplergl` Python package (>= 0.4.0) | The deliverable is a Python script or a standalone HTML map |
| [`kepler-gl-app`](skills/kepler-gl-app/SKILL.md) | A running kepler.gl app that exposes the `map.*` commands | The user is looking at an open map and asks to change it |

The two surfaces name the same layer differently — H3 is `hexagonId` in a Python
config but `h3` over MCP, and hexbin is `hexagon` on both. Each skill carries the
same cross-surface reference tables; see [Shared content](#shared-content).

## Layout

```text
plugins/kepler.gl/
├── .claude-plugin/plugin.json   Claude Code manifest (skills/ is auto-discovered)
├── plugin.json                  portable Agent Plugins manifest (Codex; UI under extensions.com.openai)
├── .cursor-plugin/plugin.json   Cursor manifest
├── skills/
│   ├── keplergl-python/         SKILL.md + references/
│   └── kepler-gl-app/           SKILL.md
├── assets/                      icon-small.svg, icon-large.svg
└── README.md
```

`src/mcp/skill/kepler/` and the plugin's own contents are checked together by
`scripts/validate-plugin-manifests.js`; see [Validation](#validation).

## Install

The marketplace files live at the repository root: `.claude-plugin/marketplace.json`
for Claude Code and `.agents/plugins/marketplace.json` for Codex.

### Claude Code

```bash
claude plugin marketplace add keplergl/kepler.gl
claude plugin install kepler-gl@kepler-gl
```

### Codex

```bash
codex plugin marketplace add keplergl/kepler.gl
codex plugin add kepler-gl@kepler-gl
```

Or run `codex`, then `/plugins` to enable it interactively.

### Cursor

Cursor reads `.cursor-plugin/plugin.json`; skills under `skills/` are
auto-detected. Point Cursor at this plugin directory (or install it from a
marketplace that serves it).

### Plain skill folder

Clients without a plugin loader can take a single skill directly:

```bash
cp -R plugins/kepler.gl/skills/keplergl-python ~/.claude/skills/
cp -R plugins/kepler.gl/skills/kepler-gl-app ~/.agents/skills/
```

## MCP server

`@kepler.gl/mcp` ships a stdio server, `kepler-mcp`. It holds the map tools,
listens on a loopback WebSocket, and prints a URL carrying a one-time token;
open that URL and the kepler.gl page connects back, after which tool calls
execute against the live map. That is how harnesses without WebMCP (Codex
Desktop, the Codex CLI, Claude Code) reach the map. Agents with a built-in
browser can instead use the page's WebMCP registration.

The plugin still ships no `.mcp.json` (Claude) and no `mcp.json` (portable),
because `@kepler.gl/mcp` is not published to npm yet — an `npx` entry would
404. From a checkout the server runs today:

```bash
yarn workspace @kepler.gl/mcp build
node src/mcp/dist/cjs/server/stdio.js --map-url http://localhost:8080
```

Register that command as the `kepler` server in the client, e.g.
`codex mcp add kepler -- node src/mcp/dist/cjs/server/stdio.js`.

Once the package is published, add both files with the same server, bump the
plugin version, and update this section:

```json
{
  "mcpServers": {
    "kepler": {"command": "npx", "args": ["-y", "@kepler.gl/mcp"]}
  }
}
```

## Shared content

The two skills carry four identical blocks, marked in each `SKILL.md`:

```markdown
<!-- shared:layer-types -->
...
<!-- /shared:layer-types -->
```

`layer-types`, `basemaps`, `trip`, and `palettes` describe kepler.gl facts that
hold for both surfaces. They are copied, not extracted into a `shared/`
directory: each skill stays a self-contained folder that can be installed alone.
The validator fails when the copies drift, so edit both `SKILL.md` files in the
same commit. If these blocks grow, moving them into a generated include is the
next step.

## App skill source of truth

`src/mcp/skill/kepler/SKILL.md` is served verbatim by `@kepler.gl/mcp` and the
demo app, so it stays the source of truth. The plugin's
`skills/kepler-gl-app/SKILL.md` is that body verbatim, wrapped in frontmatter
and followed by a cross-surface appendix. Edit the source, then re-copy the body
— the validator checks that the plugin copy still starts with it.

Skill metadata lives in the `SKILL.md` frontmatter only. `skill.yaml` stays in
`src/mcp/skill/kepler/` because the npm package exports it, but it is not copied
here: no plugin client reads it, and a second metadata file in the same folder
would silently disagree with the frontmatter. The validator instead requires the
frontmatter description to equal `skill.yaml`'s.

## Validation

```bash
node scripts/validate-plugin-manifests.js
```

It checks that the three manifests parse, agree on `name`/`version`/`description`,
and follow their own rules (Agent Plugins `$schema` and name grammar, OpenAI
interface metadata and asset paths, Cursor's closed field set and
`author`/`logo`, Claude's kebab-case plugin id); that every skill directory has
a `SKILL.md` whose frontmatter name matches the directory; that both
marketplaces point at `./plugins/kepler.gl`; that the shared blocks match; that
the app skill tracks `src/mcp`; and that every reference link resolves. It needs
only Node — no dependencies.

Where the Claude CLI is available, `claude plugin validate plugins/kepler.gl
--strict` and `claude plugin validate .claude-plugin/marketplace.json --strict`
are the authoritative checks for the Claude side.

## Release

Versions are tracked in all three manifests and must match. To publish:

```bash
git tag plugin-v0.1.0
git push origin plugin-v0.1.0
```

`.github/workflows/publish-plugin.yml` validates the manifests, builds one zip
per client and a source zip, and attaches them to the GitHub release. This
supersedes the old `skill-v*` tag and `publish-skill.yml` workflow.
