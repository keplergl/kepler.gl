/**
 * kepler-mcp-bridge — opt-in harness bridge for the demo-app.
 *
 * Lets a LOCAL kepler-mcp-demo process (an MCP server for Claude/Codex) drive
 * this page's map through the @kepler.gl/mcp `map.*` commands.
 *
 * Topology: browsers cannot LISTEN on a port, so this page is a WebSocket
 * CLIENT that connects OUT to `ws://localhost:<port>/ws?token=...` (the
 * reverse-connect pattern). Once connected it advertises the DuckDB-free
 * subset of `getKeplerCommands(ctx)` and answers `call` messages by executing
 * them against the demo's own redux store.
 *
 * Only activated on explicit opt-in: a `?mcp=<token>` query param (auto) or
 * the "Connect to map harness" button (pastes a token).
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {RoomCommandResult} from '@kepler.gl/mcp';
import {buildCatalog, buildKeplerContext, formatResult, toDescriptor} from './kepler-mcp-shared';

const DEFAULT_PORT = 8765;
const WSHost = () => 'localhost';

// The bridge only ever talks to a local kepler-mcp-demo process. A crafted
// link must not be able to point it at a remote WebSocket server (data-exfil /
// remote-control risk), so any host other than loopback is ignored.
// True loopback hosts only. `0.0.0.0` is deliberately excluded: it is the
// "any address" wildcard, not a loopback address, and accepting it would
// undermine the protection against connecting the bridge to non-local hosts.
const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
const isLoopbackHost = (host: string) => LOOPBACK_HOSTS.has(host.toLowerCase());

type BridgeStatus = 'idle' | 'connecting' | 'connected' | 'error';

function getUrlConfig(): {token: string; port: number; host: string; tokenFromUrl: boolean} {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const urlToken = params.get('mcp');
  let stored: string | null = null;
  if (typeof window !== 'undefined') {
    try {
      // sessionStorage (not localStorage): the token is a credential, so it
      // must not linger past the tab session or be readable by any script on
      // the origin indefinitely. sessionStorage still survives page reloads.
      stored = sessionStorage.getItem('kepler-mcp-token');
    } catch {
      // private mode / blocked storage — treat as absent
    }
  }
  const token = urlToken ?? stored ?? '';
  // Only honor URL host/port when the token is ALSO from the URL — otherwise a
  // link like `?mcpHost=attacker.tld` could combine a persisted token with a
  // non-local host and leak it. And even then, restrict the host to loopback
  // addresses only.
  const requestedHost = params.get('mcpHost');
  const host =
    urlToken != null && requestedHost && isLoopbackHost(requestedHost) ? requestedHost : WSHost();
  // Clamp to a valid TCP port (1-65535): a crafted ?mcpPort=99999 or negative
  // value is truthy after Number() and would produce an invalid WebSocket URL
  // with confusing connection failures.
  const requestedPort = Number(params.get('mcpPort'));
  const port =
    urlToken != null && Number.isInteger(requestedPort) && requestedPort >= 1 && requestedPort <= 65535
      ? requestedPort
      : DEFAULT_PORT;
  return {token, port, host, tokenFromUrl: urlToken != null};
}

export type BridgeStatusInfo = {
  status: BridgeStatus;
  error: string | null;
  connected: boolean;
};

type McpBridgeProps = {
  reduxStore: any;
  onStatus?: (info: BridgeStatusInfo) => void;
};

export function KeplerMcpBridge({reduxStore, onStatus}: McpBridgeProps) {
  const [token, setToken] = useState(getUrlConfig().token);
  const [port, setPort] = useState(getUrlConfig().port);
  // host is fixed from the URL config at init (loopback-only) and never
  // changed by the UI, so the setter is intentionally not destructured.
  const [host] = useState(getUrlConfig().host);
  const [status, setStatus] = useState<BridgeStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const ctx = useMemo(() => buildKeplerContext(reduxStore), [reduxStore]);
  const catalog = useMemo(() => buildCatalog(ctx), [ctx]);
  const commandsById = useMemo(
    () => Object.fromEntries(catalog.map(c => [c.id, c])),
    [catalog]
  );

  const pushLog = useCallback((line: string) => {
    setLog(prev => [...prev.slice(-6), `${new Date().toLocaleTimeString()} ${line}`]);
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setStatus('idle');
  }, []);

  const connect = useCallback(
    (useToken = token) => {
      if (!useToken) {
        setError('No token. Paste the one printed by kepler-mcp-demo.');
        setStatus('error');
        return;
      }
      try {
        // sessionStorage, not localStorage — the token is a credential and
        // must not outlive the tab session.
        sessionStorage.setItem('kepler-mcp-token', useToken);
      } catch {
        // private mode / blocked storage — the bridge still works for this
        // session without persistence
      }
      setStatus('connecting');
      setError(null);

      // Close any existing socket first — clicking connect repeatedly (or a
      // reconnect) must not leave multiple sockets open racing to handle
      // messages and mutate the map.
      wsRef.current?.close();
      wsRef.current = null;

      const wsUrl = `ws://${host}:${port}/ws?token=${encodeURIComponent(useToken)}`;
      // The token is a credential — never surface the full URL in logs or
      // user-visible errors (screenshots, screen recordings, shared console
      // logs would leak it). Redact it for display.
      const redactedWsUrl = `ws://${host}:${port}/ws?token=***`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({type: 'hello', commands: catalog.map(toDescriptor)}));
        setStatus('connected');
        pushLog(`connected to ${redactedWsUrl} · ${catalog.length} map commands`);
      };
      ws.onmessage = async ev => {
        let msg: any;
        try {
          msg = JSON.parse(String(ev.data));
        } catch {
          pushLog(`ignored non-JSON message: ${String(ev.data).slice(0, 80)}`);
          return;
        }
        if (msg?.type !== 'call') return;
        const {callId, tool, input} = msg as {callId: string; tool: string; input?: unknown};
        const command = commandsById[tool];
        let result: RoomCommandResult;
        try {
          if (!command) throw new Error(`Unknown command: ${tool}`);
          result = (await command.execute(
            {store: undefined, getState: () => undefined, invocation: {surface: 'mcp'}} as any,
            input ?? {}
          )) as RoomCommandResult;
        } catch (err) {
          result = {
            success: false,
            commandId: tool,
            error: err instanceof Error ? err.message : String(err)
          };
        }
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({type: 'result', callId, result}));
        }
        pushLog(formatResult(result));
      };
      ws.onerror = () => {
        setError(`WebSocket error connecting to ${redactedWsUrl}. Is kepler-mcp-demo running?`);
        setStatus('error');
      };
      ws.onclose = () => {
        if (wsRef.current === ws) {
          wsRef.current = null;
          // Don't clobber an error status set by onerror — a failed connection
          // should stay visible as 'error', not silently flip back to 'idle'
          // (which would mask the failure while the error text lingers).
          setStatus(prev => (prev === 'error' ? prev : 'idle'));
        }
      };
    },
    [catalog, commandsById, host, port, pushLog, token]
  );

  useEffect(() => {
    const cfg = getUrlConfig();
    // Auto-connect ONLY when the token came from the URL (?mcp=<token>) — the
    // explicit opt-in. A persisted token must not auto-connect: a link like
    // `?mcpHost=attacker.tld` could otherwise combine the stored token with a
    // non-local host and leak it.
    if (cfg.tokenFromUrl && cfg.token) {
      setToken(cfg.token);
      connect(cfg.token);
      // Strip the token from the URL so it doesn't leak via browser history,
      // screenshots, logs, or Referer headers when navigating away.
      if (typeof window !== 'undefined' && window.history?.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.delete('mcp');
        window.history.replaceState({}, '', url.toString());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close the socket on unmount so a live connection doesn't leak (route
  // changes, HMR, ...) and socket events can't trigger state updates after
  // the component is gone.
  useEffect(() => {
    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);

  // Report status up so a parent can render a unified summary chip.
  useEffect(() => {
    onStatus?.({status, error, connected: status === 'connected'});
  }, [status, error, onStatus]);

  const connected = status === 'connected';
  const dot = connected ? '#8ff29a' : status === 'connecting' ? '#ffe27a' : '#fff';

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, color: '#fff'}}>
        <span style={{width: 8, height: 8, borderRadius: 8, background: dot, flex: 'none'}} />
        <span>map harness · {status}</span>
        {connected ? (
          <button onClick={disconnect} style={btnStyle}>disconnect</button>
        ) : (
          <>
            <input
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="token"
              aria-label="map harness token"
              style={{width: 130, background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.5)', color: '#fff', borderRadius: 4, padding: '2px 6px'}}
            />
            <input
              type="number"
              value={port}
              onChange={e => {
                // Clamp manual entry to a valid TCP port (1-65535), matching
                // the URL-param parsing — 0/negative/>65535 would produce an
                // invalid WebSocket URL with confusing failures.
                const v = Number(e.target.value);
                setPort(Number.isInteger(v) && v >= 1 && v <= 65535 ? v : DEFAULT_PORT);
              }}
              aria-label="map harness port"
              style={{width: 52, background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.5)', color: '#fff', borderRadius: 4, padding: '2px 6px'}}
            />
            <button onClick={() => connect()} style={btnStyle}>connect</button>
          </>
        )}
      </div>
      {(error || log.length > 0) && (
        <div style={{color: '#ddd', maxWidth: 420}}>
          {error && <div style={{color: '#ff9e9e'}}>{error}</div>}
          {log.slice(-4).map((line, i) => (
            <div key={i} style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
              {line}
            </div>
          ))}
        </div>
      )}
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
