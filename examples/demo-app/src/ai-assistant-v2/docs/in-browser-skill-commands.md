# In-browser skill systems: execute scripts → commands

The original SKILL protocol lets a skill "execute scripts" — python, shell, or
any host-injected runner. That model does not work in a browser environment:
there is no filesystem, no shell, and python is opt-in (via Pyodide) at best.

This demo-app replaces "execute scripts" with **commands**: typed, namespaced
operations a skill invokes through a single `executeApi` tool. Commands are
typed by the sqlrooms [`RoomCommand`](https://github.com/sqlrooms/sqlrooms/blob/main/packages/room-store/src/CommandSlice.ts)
type, which the host registers in a command registry. The same command
definitions then serve every surface that reads the registry — the AI skill
layer, the command palette UI, the CLI adapter, and the MCP adapter — from one
source of truth.

## Why commands instead of scripts

| scripts (original SKILL) | commands (in-browser) |
|---|---|
| `python my_skill.py` / `bash run.sh` | `executeApi({ call: { apiName: "executeCommand", args: { commandId: "map.add-layer", input: {...} } } })` |
| host runs arbitrary code | host exposes a fixed, namespaced catalog |
| one surface (the runner) | many surfaces (AI, palette, CLI, MCP) — all read the registry |
| no input schema | `inputSchema: ZodType` per command |
| no metadata | `group`, `keywords`, `riskLevel`, `requiresConfirmation`, `isVisible`, `isEnabled` |

## The `RoomCommand` shape

```ts
type RoomCommand = {
  id: string;            // "map.set-basemap"
  name: string;          // "Set basemap"
  description?: string;
  group?: string;        // "Map"
  keywords?: string[];
  inputSchema?: ZodType;
  execute: (ctx, input?) => { success, commandId, data?, error? } | data | void;
  isVisible?, isEnabled?, metadata?, ui?   // palette/CLI/MCP niceties
};
```

`execute` receives a store-centric `RoomCommandExecutionContext` (`{store,
getState, invocation}`) — NOT an AI SDK `{abortSignal}` options bag. The
host's per-command closure (e.g. a `KeplerContext` captured in the factory)
carries whatever the command needs; the registry context is for cross-cutting
concerns (middleware, logging, confirmation).

## Two ways to adopt

### 1. Direct conversion (preferred when you own the command)

Rewrite the factory to return `RoomCommand` directly. The demo-app uses this
path for all its kepler/data/geoda/geo commands. Reference:
[`commands/kepler-commands/basemap-command.ts`](../commands/kepler-commands/basemap-command.ts).

```ts
import type {RoomCommand} from '@sqlrooms/room-store';
import {z} from 'zod';

export function getBasemapCommand(ctx: KeplerContext): RoomCommand {
  return {
    id: 'map.set-basemap',
    name: 'Set basemap',
    group: 'Map',
    description: 'Change the basemap style of the kepler.gl map.',
    inputSchema: z.object({styleType: z.enum([...])}),
    execute: async (_execCtx, input) => {
      const {styleType} = input as {styleType: string};
      ctx.dispatch(mapStyleChange(styleType));
      return {success: true, commandId: 'map.set-basemap', data: {details: `...`}};
    }
  };
}
```

Register once after the store is created:

```ts
registerCommandsForOwner(roomStore, 'kepler-ai', [
  ...Object.values(getKeplerCommands(ctx)),
  // ...other command sets
]);
```

### 2. Wrapper (when you can't rewrite the tool)

Use `toolToCommand(tool, meta)` from
[`commands/kepler-commands/command-wrappers.ts`](../commands/kepler-commands/command-wrappers.ts).
It folds the AI SDK tool's `execute`, `inputSchema`, and `toModelOutput` (the
token-trim logic the AI SDK applies between tool call and model) into a single
`RoomCommand.execute` so the registry-stored result already carries the
model-facing subset.

```ts
import {toolToCommand} from '../commands/kepler-commands/command-wrappers';
import {getSomeExistingAiSdkTool} from './my-tools';

const cmd = toolToCommand(getSomeExistingAiSdkTool(ctx), {
  id: 'my.command',
  name: 'Do the thing',
  group: 'Mine'
});
registerCommandsForOwner(roomStore, 'my-owner', [cmd]);
```

## Things to know

- **Abort signal.** `RoomCommandExecutionContext` has no `abortSignal`. For v1,
  pass it via `invocation.metadata.abortSignal` from the AI layer, or read it
  from a closure if your host provides one. The demo-app ignores it in commands
  (the `KeplerContext` closure is enough); the AI-layer `executeApi` tool keeps
  its own abort handling on the dispatcher.
- **Rich outputs.** `RoomCommandResult.data` is `unknown`. Multi-step chaining
  (e.g. `data.classify` `breaks` → `map.add-layer` `colorMap`) works because
  the AI-layer dispatcher surfaces typed fields out of `data` — keep your
  `data` payload shaped the way the consuming command expects to read it.
- **`toModelOutput`.** On the direct-conversion path, fold the trim logic into
  `execute`'s return (return only the fields the model should see). On the
  wrapper path, `toolToCommand` applies the tool's `toModelOutput` for you.
- **Re-registration.** If the closure your commands capture is per-session
  (not a singleton), re-register on swap with `registerCommandsForOwner` +
  `unregisterCommandsForOwner`.