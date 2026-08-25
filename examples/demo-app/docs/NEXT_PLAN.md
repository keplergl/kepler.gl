# NEXT_PLAN — The AI assistant's map surface is temporarily vendored

**Status:** Temporary integration (prototyping). See
[`kepler-assistant/NEXT_PLAN.md`](https://github.com/keplergl/kepler-assistant) for the full separation plan.

## What the demo-app consumes

The demo-app's AI assistant is provided by the published
**`@openassistant/kepler-assistant`** package (`^0.0.1` on npm, the
`kepler-assistant` repo). It imports only from `@openassistant/kepler-assistant`:

- `AiAssistantPanel` + `setStartScreenCapture` / `setScreenCaptured` /
  `setMapBoundary` (`src/app.tsx`)
- `AiAssistantControlFactory` (`src/factories/map-control.tsx`)
- `aiAssistantReducer` (`src/reducers/index.ts`)

It never imports `@kepler.gl/mcp` directly.

## The temporary integration

`kepler-assistant` normally consumes `@kepler.gl/mcp` (the reusable map surface:
`map.*` commands + contract + types + `skill/kepler`). To prototype without
publishing that package, the map surface is **temporarily vendored inside
`kepler-assistant` at `src/mcp/`** (relative imports, no `@kepler.gl/mcp`
dependency). This makes kepler-assistant a single self-contained repo.

Consequences for this app:

- The kepler.gl repo's own `src/mcp/` module was **removed** (this branch only
  carries demo-app changes). The map surface now lives only inside
  kepler-assistant's vendored `src/mcp/`.
- `examples/demo-app/esbuild.config.mjs` no longer aliases `@kepler.gl/mcp`, and
  `examples/demo-app/tsconfig.json` no longer maps it — there is nothing to
  resolve it to during the temporary period.
- **Do not import `@kepler.gl/mcp` from the demo-app** during the temporary
  period — it would fail to resolve (or, once published, bypass the vendored
  copy). Use the `map.*` commands via kepler-assistant.

## Permanent home: separate back into the kepler.gl module

The permanent home of the map surface is the **kepler.gl repo `src/mcp/`**
(package `@kepler.gl/mcp`) — currently **removed** from this repo; the vendored
copy inside kepler-assistant is the single edit surface, so the only changes
pushed to this repo are demo-app changes. When prototyping is done:

1. Copy the final vendored map surface (kepler-assistant `src/mcp/`, minus
   `chat-surface.ts`) back into kepler.gl's `src/mcp/`, re-add it to the root
   `package.json` workspaces, then publish `@kepler.gl/mcp` from there (see
   `kepler-assistant/NEXT_PLAN.md` for the exact steps).
2. kepler-assistant removes the vendored `src/mcp/` and restores
   `@kepler.gl/mcp` imports.
3. In this app: re-add the `@kepler.gl/mcp` esbuild alias and tsconfig mapping
   (the removed lines in this branch) so the published package resolves through
   kepler-assistant's externalized import.
4. Verify: rebuild kepler-assistant, then `yarn start:local` in this folder,
   open the AI assistant panel, and drive the registry with
   `window.__keplerRoomStore.commands.invokeCommand('map.get-boundary', {})`.
5. Delete this file once separated.
