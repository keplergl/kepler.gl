// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * kepler-webmcp — exposes the `@kepler.gl/mcp` map.* surface through the
 * browser's native WebMCP API so harnesses with a built-in browser (Chrome's
 * agent, Claude Desktop's browser, Codex, ...) can discover and call the tools
 * directly — no helper process and no WebSocket.
 *
 * WebMCP is a W3C Web Machine Learning CG draft: the page registers tools
 * (`registerTool`) on an in-page model context and the embedded agent invokes
 * them over the JS heap (webmachinelearning/webmcp).
 *
 * Feature detection: the interface has shifted between drafts — current spec
 * puts `modelContext` on `document`, earlier Chromium builds on `navigator`
 * (deprecated in Chromium 150). Native support: Chrome 149+ origin trial, or
 * `chrome://flags/#enable-webmcp-testing`. When neither exists this component
 * is inert.
 *
 * The component renders nothing — the page carries no map-surface status UI.
 * Registration failures are reported to the console only.
 */
import {useEffect, useMemo, useRef} from 'react';
import {buildCatalog, buildKeplerContext, formatResult, toDescriptor} from './kepler-mcp-shared';

/**
 * Minimal structural type for the WebMCP ModelContext (spec: ModelContext on
 * Document, `registerTool(tool, options?) -> Promise<undefined>`). Kept
 * structural because TypeScript DOM libs don't ship WebMCP yet — see the
 * `webmcp-types` npm package for the full surface.
 */
type WebMcpTool = {
  name: string;
  title?: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: any, options?: {signal?: AbortSignal}) => Promise<any>;
  annotations?: {readOnlyHint?: boolean; untrustedContentHint?: boolean};
};

type ModelContextLike = {
  registerTool: (tool: WebMcpTool, options?: {signal?: AbortSignal}) => Promise<void> | void;
};

/** `document.modelContext` (current spec) with the pre-150 `navigator.modelContext` fallback. */
function getModelContext(): ModelContextLike | null {
  const win = typeof window === 'undefined' ? null : window;
  if (!win) return null;
  const doc = win.document as any;
  return (doc?.modelContext ?? (win.navigator as any)?.modelContext ?? null) as ModelContextLike;
}

/**
 * WebMCP tool names allow `A-Za-z0-9._-`, but MCP-tool naming in agent
 * harnesses is commonly restricted to `[A-Za-z0-9_-]`, so dots (as in
 * `map.load-data`) are folded to underscores for the registered name. The
 * original command id is kept in the description so callers can still map
 * results back to `RoomCommandResult.commandId`.
 */
function webMcpName(commandId: string): string {
  return commandId.replace(/\./g, '_');
}

type McpWebMcpProps = {
  reduxStore: any;
};

export function KeplerWebMcp({reduxStore}: McpWebMcpProps) {
  const modelContext = useMemo(getModelContext, []);
  const controllerRef = useRef<AbortController | null>(null);

  const ctx = useMemo(() => buildKeplerContext(reduxStore), [reduxStore]);
  const catalog = useMemo(() => buildCatalog(ctx), [ctx]);

  useEffect(() => {
    // Abort the previous registration before re-registering; aborting the
    // controller also unregisters its tools (Chrome 153+).
    controllerRef.current?.abort();
    controllerRef.current = null;

    if (!modelContext || !catalog.length) return;

    const controller = new AbortController();
    controllerRef.current = controller;

    let cancelled = false; // effect re-run / unmount while registrations are in flight

    (async () => {
      const results = await Promise.allSettled(
        catalog.map(async cmd => {
          const desc = toDescriptor(cmd);
          const tool: WebMcpTool = {
            // fold dots to underscores — see webMcpName above
            name: webMcpName(cmd.id),
            title: cmd.name,
            description:
              cmd.id === webMcpName(cmd.id)
                ? cmd.description
                : `${cmd.description ?? cmd.name} (command id: ${cmd.id})`,
            inputSchema: desc.inputSchema,
            annotations: {readOnlyHint: cmd.metadata?.readOnly === true},
            // The agent's transport JSON-serializes the return value, and a
            // rejected execute only surfaces as an opaque UnknownError — so
            // errors are returned as text, never thrown.
            execute: async (input, options) => {
              try {
                const result = await cmd.execute(
                  {
                    store: undefined,
                    getState: () => undefined,
                    invocation: {surface: 'webmcp'},
                    // Thread the caller's AbortSignal through so agents can
                    // cancel long-running commands (e.g. map.load-data).
                    signal: options?.signal
                  } as any,
                  input ?? {}
                );
                return formatResult(result as any);
              } catch (err) {
                return `✗ ${cmd.id}: ${err instanceof Error ? err.message : String(err)}`;
              }
            }
          };
          // Chrome 153+ accepts `{signal}` for unregistration; older drafts
          // take only the tool. Fall back to the single-argument form.
          try {
            await modelContext.registerTool(tool, {signal: controller.signal});
          } catch (err) {
            if (controller.signal.aborted || cancelled) return;
            await modelContext.registerTool(tool);
          }
        })
      );

      if (cancelled || controller.signal.aborted) return;
      const rejected = results.filter(r => r.status === 'rejected');
      if (!rejected.length) return;

      // Nothing else reports WebMCP state — surface a failed registration to
      // whoever is debugging the page rather than failing silently.
      const reasons = rejected
        .map(
          r =>
            (r as PromiseRejectedResult).reason?.message ??
            String((r as PromiseRejectedResult).reason)
        )
        .join('; ');
      console.warn(
        `[kepler.gl webMCP] ${rejected.length} of ${results.length} map tools failed to register: ${reasons}`
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [catalog, modelContext]);

  // Close the controller on unmount so the tools do not outlive the component.
  useEffect(
    () => () => {
      controllerRef.current?.abort();
      controllerRef.current = null;
    },
    []
  );

  return null;
}
