/**
 * kepler-mcp-bridge — lets a local `kepler-mcp` process drive this page.
 *
 * Harnesses that do not implement WebMCP (Codex Desktop today, the Codex CLI,
 * Claude Code) reach the map through MCP instead. Browsers cannot LISTEN on a
 * port, so this page is a WebSocket CLIENT: the `kepler-mcp` stdio server
 * prints a URL carrying a one-time token, and opening that URL connects out to
 * `ws://127.0.0.1:<port>/ws?token=...`. Once connected the page advertises the
 * DuckDB-free subset of `getKeplerCommands(ctx)` and answers `call` messages by
 * executing them against the demo's own redux store.
 *
 * Opt-in only: nothing connects unless a token is present. The component
 * renders nothing — the page carries no map-surface status UI — and logs to the
 * console.
 */
import {useEffect, useMemo, useRef} from 'react';
import type {RoomCommandResult} from '@kepler.gl/mcp';
import {buildCatalog, buildKeplerContext, toDescriptor} from './kepler-mcp-shared';

const DEFAULT_PORT = 8765;
const RETRY_MS = 2000;
const MAX_ATTEMPTS = 30;
const TOKEN_KEY = 'kepler-mcp-token';

// The bridge only ever talks to a loopback server. A crafted link must not be
// able to point it at a remote WebSocket (data-exfil / remote-control risk), so
// any host other than loopback is ignored. `0.0.0.0` is deliberately excluded:
// it is the "any address" wildcard, not a loopback address.
const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
const isLoopbackHost = (host: string) => LOOPBACK_HOSTS.has(host.toLowerCase());

type UrlConfig = {token: string; tokenFromUrl: boolean; host: string; port: number};

function getUrlConfig(): UrlConfig {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const urlToken = params.get('mcp');
  // sessionStorage (not localStorage): the token is a credential and must not
  // outlive the tab session. A persisted token reconnects on reload, but only
  // to the default loopback host — host/port are honored from the URL alone.
  let stored: string | null = null;
  if (typeof window !== 'undefined') {
    try {
      stored = sessionStorage.getItem(TOKEN_KEY);
    } catch {
      // private mode / blocked storage — treat as absent
    }
  }
  const token = urlToken ?? stored ?? '';
  const requestedHost = params.get('mcpHost');
  const rawHost =
    urlToken != null && requestedHost && isLoopbackHost(requestedHost)
      ? requestedHost
      : 'localhost';
  // IPv6 hosts must be bracketed in a URL (`ws://[::1]:port/...`).
  const host = rawHost.includes(':') && !rawHost.startsWith('[') ? `[${rawHost}]` : rawHost;
  // Clamp to a valid TCP port (1-65535): a crafted ?mcpPort=99999 is truthy
  // after Number() and would produce an invalid WebSocket URL.
  const requestedPort = Number(params.get('mcpPort'));
  const port =
    urlToken != null &&
    Number.isInteger(requestedPort) &&
    requestedPort >= 1 &&
    requestedPort <= 65535
      ? requestedPort
      : DEFAULT_PORT;
  return {token, tokenFromUrl: urlToken != null, host, port};
}

type Props = {
  reduxStore: any;
};

export function KeplerMcpBridge({reduxStore}: Props) {
  const ctx = useMemo(() => buildKeplerContext(reduxStore), [reduxStore]);
  const catalog = useMemo(() => buildCatalog(ctx), [ctx]);
  const commandsById = useMemo(
    () => Object.fromEntries(catalog.map(command => [command.id, command])),
    [catalog]
  );
  const catalogRef = useRef(catalog);
  catalogRef.current = catalog;

  useEffect(() => {
    const config = getUrlConfig();
    if (!config.token) return;

    try {
      sessionStorage.setItem(TOKEN_KEY, config.token);
    } catch {
      // private mode — the bridge still works for this page load
    }

    // Strip the token from the URL so it does not leak through history,
    // screenshots, logs or Referer headers.
    if (config.tokenFromUrl && typeof window !== 'undefined' && window.history?.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.delete('mcp');
      url.searchParams.delete('mcpHost');
      url.searchParams.delete('mcpPort');
      window.history.replaceState({}, '', url.toString());
    }

    let stopped = false;
    let socket: WebSocket | null = null;
    let attempts = 0;
    let retryTimer: number | null = null;

    const scheduleRetry = () => {
      if (stopped || attempts >= MAX_ATTEMPTS) return;
      retryTimer = window.setTimeout(connect, RETRY_MS);
    };

    const connect = () => {
      if (stopped) return;
      attempts += 1;
      const wsUrl = `ws://${config.host}:${config.port}/ws?token=${encodeURIComponent(
        config.token
      )}`;
      // Never log the token: screenshots and shared console output would leak it.
      const redacted = `ws://${config.host}:${config.port}/ws?token=***`;
      const ws = new WebSocket(wsUrl);
      socket = ws;

      ws.onopen = () => {
        attempts = 0;
        ws.send(JSON.stringify({type: 'hello', commands: catalogRef.current.map(toDescriptor)}));
        console.info(
          `[kepler.gl mcp bridge] connected to ${redacted} · ${catalogRef.current.length} map commands`
        );
      };

      ws.onmessage = async event => {
        let message: any;
        try {
          message = JSON.parse(String(event.data));
        } catch {
          return;
        }
        if (message?.type !== 'call') return;
        const {callId, tool, input} = message as {callId: string; tool: string; input?: unknown};
        let result: RoomCommandResult;
        try {
          const command = commandsById[tool];
          if (!command) throw new Error(`Unknown command: ${tool}`);
          result = (await command.execute(
            {store: undefined, getState: () => undefined, invocation: {surface: 'mcp'}} as any,
            input ?? {}
          )) as RoomCommandResult;
        } catch (error) {
          result = {
            success: false,
            commandId: tool,
            error: error instanceof Error ? error.message : String(error)
          };
        }
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({type: 'result', callId, result}));
        }
      };

      ws.onclose = event => {
        if (socket === ws) socket = null;
        if (stopped) return;
        if (event.code === 1008) {
          console.warn(
            '[kepler.gl mcp bridge] the server rejected this token — open the URL printed by kepler-mcp'
          );
          return;
        }
        scheduleRetry();
      };
    };

    connect();

    return () => {
      stopped = true;
      if (retryTimer !== null) window.clearTimeout(retryTimer);
      socket?.close();
      socket = null;
    };
  }, [catalog, commandsById]);

  return null;
}
