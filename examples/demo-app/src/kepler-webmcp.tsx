/**
 * kepler-webmcp — exposes the same `@kepler.gl/mcp` map.* surface through the
 * browser's native WebMCP API so harnesses with a built-in browser (Chrome's
 * agent, Claude Desktop's browser, Codex, ...) can discover and call the tools
 * directly — no WebSocket bridge or local helper process needed.
 *
 * WebMCP is a W3C Web Machine Learning CG draft: the page registers tools
 * (`registerTool`) on an in-page model context and the embedded agent invokes
 * them over the JS heap (webmachinelearning/webmcp). This surface registers
 * the identical DuckDB-free command catalog as `kepler-mcp-bridge.tsx`, so any
 * caller gets the same tools either way — the transport is the only
 * difference.
 *
 * Feature detection: the interface has shifted between drafts — current spec
 * puts `modelContext` on `document`, earlier Chromium builds on `navigator`
 * (deprecated in Chromium 150). Native support: Chrome 149+ origin trial, or
 * `chrome://flags/#enable-webmcp-testing`. When neither exists this component
 * is inert (hidden chip).
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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

type WebMcpStatus = 'idle' | 'registering' | 'registered' | 'error';

export type WebMcpStatusInfo = {
  available: boolean;
  status: WebMcpStatus;
  toolCount: number;
  error: string | null;
  enabled: boolean;
};

type McpWebMcpProps = {
  reduxStore: any;
  onStatus?: (info: WebMcpStatusInfo) => void;
};

const ENABLED_KEY = 'kepler-webmcp-enabled';

export function KeplerWebMcp({reduxStore, onStatus}: McpWebMcpProps) {
  const modelContext = useMemo(getModelContext, []);
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      return window.localStorage.getItem(ENABLED_KEY) !== 'false';
    } catch {
      // private mode / blocked storage — default to enabled
      return true;
    }
  });
  const [status, setStatus] = useState<WebMcpStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [toolCount, setToolCount] = useState(0);
  const controllerRef = useRef<AbortController | null>(null);

  const ctx = useMemo(() => buildKeplerContext(reduxStore), [reduxStore]);
  const catalog = useMemo(() => buildCatalog(ctx), [ctx]);

  const setPersistedEnabled = useCallback((value: boolean) => {
    setEnabled(value);
    try {
      window.localStorage.setItem(ENABLED_KEY, String(value));
    } catch {
      /* private mode etc. — keep the in-memory toggle */
    }
  }, []);

  useEffect(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setStatus('idle');
    setError(null);
    setToolCount(0);

    if (!modelContext || !catalog.length) return;
    if (!enabled) return;

    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus('registering');

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
            execute: async input => {
              try {
                const result = await cmd.execute(
                  {store: undefined, getState: () => undefined, invocation: {surface: 'webmcp'}} as any,
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
      if (rejected.length === results.length) {
        setStatus('error');
        setError(
          `registerTool rejected every command (${rejected.length}). Is WebMCP enabled for this page?`
        );
        return;
      }
      setStatus('registered');
      setToolCount(results.length - rejected.length);
      if (rejected.length) {
        setError(
          `${rejected.length} of ${results.length} commands failed registration: ${rejected
            .map(r => (r as PromiseRejectedResult).reason?.message ?? String((r as PromiseRejectedResult).reason))
            .join('; ')}`
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [catalog, enabled, modelContext]);

  // Cleanup: aborting the controller unregisters the tools (Chrome 153+;
  // harmless where the signal option was ignored).
  useEffect(
    () => () => {
      controllerRef.current?.abort();
      controllerRef.current = null;
    },
    []
  );

  // Report status up so a parent can render a unified summary chip.
  useEffect(() => {
    onStatus?.({available: !!modelContext, status, toolCount, error, enabled});
  }, [modelContext, status, toolCount, error, enabled, onStatus]);

  const available = !!modelContext;
  const label = !available
    ? 'API unavailable'
    : !enabled
      ? 'off'
      : status === 'registered'
        ? `${toolCount} map tools registered`
        : status;
  const dot =
    !available || status === 'idle' || status === 'error'
      ? '#fff'
      : status === 'registered'
        ? '#8ff29a'
        : '#ffe27a';

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, color: '#fff'}}>
        <span style={{width: 8, height: 8, borderRadius: 8, background: dot, flex: 'none'}} />
        <span>webMCP · {label}</span>
        {available &&
          (enabled ? (
            <button onClick={() => setPersistedEnabled(false)} style={btnStyle}>
              disable
            </button>
          ) : (
            <button onClick={() => setPersistedEnabled(true)} style={btnStyle}>
              enable
            </button>
          ))}
      </div>
      {error && <div style={{color: '#ff9e9e', maxWidth: 420}}>{error}</div>}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.2)',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  padding: '2px 8px',
  cursor: 'pointer',
  fontSize: 11
};