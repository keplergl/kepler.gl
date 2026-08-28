# NEXT_PLAN — The AI assistant's map surface is temporarily vendored

**Status:** Temporary integration (prototyping). See
[`kepler-assistant/NEXT_PLAN.md`](https://github.com/keplergl/kepler-assistant) for the full separation plan.

## What the demo-app consumes

The demo-app's AI assistant is provided by the published
**`@openassistant/kepler-assistant`** package (`^0.0.12` on npm, the
`kepler-assistant` repo). It imports only from `@openassistant/kepler-assistant`:

- `AiAssistantPanel` + `setMapBoundary` (`src/app.tsx`)
- `AiAssistantControlFactory` (`src/factories/map-control.js`)
- `aiAssistantReducer` (`src/reducers/index.js`)

## The temporary integration

`kepler-assistant` normally consumes the reusable kepler.gl map surface:
(`map.*` commands + contract + types + `skill/kepler`). To prototype without
publishing that package, the map surface is **temporarily vendored inside
`kepler-assistant` at `src/mcp/`** (relative imports, no `@kepler.gl/mcp`
dependency). This makes kepler-assistant a single self-contained repo.

## Why `@kepler.gl/mcp` is needed: making kepler.gl work with any AI harness

The next plan is to turn kepler.gl from an app with an in-app chat panel into a
**map surface that any AI harness can operate** — Claude Code, Codex, and other
harness tools (like sqlrooms/ai). `@kepler.gl/mcp` is the enabler for that, which is why it has a
permanent home in the kepler.gl repo rather than staying vendored inside
kepler-assistant.

What `@kepler.gl/mcp` provides:

```
Harness (Claude Code / Codex)
        │  MCP (stdio / HTTP)          ← MCP is a process/transport protocol
        ▼
Local MCP server  ── user-provided ── follows the @kepler.gl/mcp interface:
        │                              kepler-assistant's MCP server, or any MCP
        │                              server that needs map rendering via kepler.gl
        │  WebSocket  (page connects out; the local server runs the WS endpoint)
        ▼
kepler.gl page (browser, static)
        │  hosts @kepler.gl/mcp — the map-surface interface
        ▼
@kepler.gl/mcp
   ├─ command registry ── executes map.* commands on the in-browser map
   ├─ command contract + JSON Schemas + types + skill/kepler
   └─ WebSocket transport to the local MCP server
```

Note: importing `@kepler.gl/mcp` does not put a working command registry in the
local MCP server. The two sides consume different parts of the same package —
the MCP server imports the command contract + JSON Schemas + types +
`skill/kepler` to register and validate its tools, while the command registry
only executes in the browser page, where the live map instance exists.

Until `@kepler.gl/mcp` is published, the map surface lives only inside
kepler-assistant's vendored `src/mcp/` (see above), which keeps it out of reach
of external harnesses. Moving it back into the kepler.gl repo and publishing it
(see below) is what unlocks the harness-agnostic plan.

## Next: separate back into the kepler.gl module

The permanent home of the map surface should be the **kepler.gl repo `src/mcp/`**
(package `@kepler.gl/mcp`); When prototyping is done:

1. Copy the final vendored map surface (kepler-assistant `src/mcp/`, minus
   `chat-surface.ts`) back into kepler.gl's `src/mcp/`, re-add it to the root
   `package.json` workspaces, then publish `@kepler.gl/mcp` from there (see
   `kepler-assistant/NEXT_PLAN.md` for the exact steps).
2. kepler-assistant removes the vendored `src/mcp/` and restores
   `@kepler.gl/mcp` imports.
3. In this app: add the `@kepler.gl/mcp` esbuild alias and a tsconfig mapping
   so the published package resolves through kepler-assistant's externalized
   import.
4. Verify: rebuild kepler-assistant, then `yarn start:local` in this folder,
   open the AI assistant panel, and drive the registry with
   `window.__keplerRoomStore.commands.invokeCommand('map.get-boundary', {})`.
5. Delete this file once separated.
