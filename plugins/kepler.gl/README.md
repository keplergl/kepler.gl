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

The plugin installs skills; register the MCP server separately. It currently
ships no `.mcp.json` (Claude) or `mcp.json` (portable). The checkout setup below
does not require publishing a new kepler.gl version.

### Connect Codex to a local map

1. Use the repository's [Node version](../../README.md#env), then prepare and
   start the demo from the repository root. Skip bootstrap if the checkout is
   already prepared, and keep the app running in this terminal:

   ```bash
   yarn bootstrap
   yarn start
   ```

2. Add the following to `~/.codex/config.toml`. Replace
   `/absolute/path/to/kepler.gl` with your checkout's absolute path. If the demo
   runs on another port, update `--map-url` too:

   ```toml
   [mcp_servers.kepler]
   command = "node"
   cwd = "/absolute/path/to/kepler.gl"
   args = [
     "-r", "./babel-register.js",
     "./src/mcp/src/server/stdio.ts",
     "--map-url", "http://localhost:8080"
   ]
   env = { BABEL_ENV = "test" }
   startup_timeout_sec = 30
   ```

   This development launcher reads the workspace sources directly. `BABEL_ENV=test`
   selects the repository's Babel preset and source aliases; it does not run tests.
   Building only `@kepler.gl/mcp` leaves its workspace dependencies unbuilt, so
   running its compiled server alone can fail in a development checkout.

   Codex starts the bridge process. Other stdio MCP clients can use the same
   command, arguments, working directory, and environment. See the
   [Codex MCP documentation](https://developers.openai.com/codex/mcp/) for client
   configuration options.

3. Restart the server in Codex's MCP settings (or restart the Codex CLI), then
   open [http://127.0.0.1:8765/](http://127.0.0.1:8765/) in your browser. The bridge
   redirects to the demo with its connection token. Keep that map tab open.
   Reopen this link after restarting the bridge, which generates a new token.

4. Load a dataset in the map and ask Codex, for example: "Use the kepler MCP
   server to inspect the loaded datasets and layers," then "Make the points
   blue and increase their size."

If a tool reports that no map is connected, reopen the bridge link and check
that the demo is running at the configured `--map-url`. If port 8765 is already
in use, stop the other bridge process before restarting this one.

### Packaged server

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
