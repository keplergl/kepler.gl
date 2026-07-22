// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {tool as aiTool} from 'ai';

// The installed `ai` package's `tool()` generic overloads
// (`tool<INPUT, OUTPUT, CONTEXT extends Context>(...)`) fail to infer the
// `CONTEXT` type parameter when called with a plain
// `{description, inputSchema, execute}` object literal, which is how every
// tool in this app is defined. That inference failure makes every overload
// mismatch and TS reports a spurious `No overload matches this call` error
// against the *last* overload (`Tool<never, never, CONTEXT>`) at every call
// site (~25 of them across `ai-assistant-v2/tools/**`).
//
// The returned tool objects are consumed dynamically - merged into an
// untyped `ToolSet` in `ai-assistant-v2/store.ts` - so nothing downstream
// depends on `tool()`'s precise generic return type. Relax it once here
// instead of casting at each call site.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tool: (definition: any) => any = aiTool as any;
