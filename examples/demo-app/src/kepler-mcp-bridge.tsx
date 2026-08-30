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

type BridgeStatus = 'idle' | 'connecting' | 'connected' | 'error';

function getUrlConfig(): {token: string; port: number; host: string} {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const stored = typeof window !== 'undefined' ? localStorage.getItem('kepler-mcp-token') : null;
  const token = params.get('mcp') ?? stored ?? '';
  const port = Number(params.get('mcpPort')) || DEFAULT_PORT;
  const host = params.get('mcpHost') ?? WSHost();
  return {token, port, host};
}

type McpBridgeProps = {
  reduxStore: any;
};

export function KeplerMcpBridge({reduxStore}: McpBridgeProps) {
  const [token, setToken] = useState(getUrlConfig().token);
  const [port, setPort] = useState(getUrlConfig().port);
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
      localStorage.setItem('kepler-mcp-token', useToken);
      setStatus('connecting');
      setError(null);

      const wsUrl = `ws://${WSHost()}:${port}/ws?token=${encodeURIComponent(useToken)}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({type: 'hello', commands: catalog.map(toDescriptor)}));
        setStatus('connected');
        pushLog(`connected to ${wsUrl} · ${catalog.length} map commands`);
      };
      ws.onmessage = async ev => {
        const msg = JSON.parse(String(ev.data));
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
        setError(`WebSocket error connecting to ${wsUrl}. Is kepler-mcp-demo running?`);
        setStatus('error');
      };
      ws.onclose = () => {
        if (wsRef.current === ws) {
          wsRef.current = null;
          setStatus('idle');
        }
      };
    },
    [catalog, commandsById, port, pushLog, token]
  );

  useEffect(() => {
    const cfg = getUrlConfig();
    if (cfg.token) {
      setToken(cfg.token);
      connect(cfg.token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connected = status === 'connected';
  const chip = (connected ? '#2e7cf6' : status === 'error' ? '#d64545' : '#555') as const;

  return (
    <div style={{position: 'fixed', left: 12, bottom: 12, zIndex: 9999, fontFamily: 'monospace', fontSize: 11}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: chip,
          color: '#fff',
          borderRadius: 999,
          padding: '4px 10px',
          boxShadow: '0 2px 8px rgba(0,0,0,.35)'
        }}
      >
        <span style={{width: 8, height: 8, borderRadius: 8, background: status === 'connected' ? '#8ff29a' : status === 'connecting' ? '#ffe27a' : '#fff', flex: 'none'}} />
        <span>
          map harness · {status}
        </span>
        {connected ? (
          <button onClick={disconnect} style={btnStyle}>disconnect</button>
        ) : (
          <>
            <input
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="token"
              style={{width: 130, background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.5)', color: '#fff', borderRadius: 4, padding: '2px 6px'}}
            />
            <input
              type="number"
              value={port}
              onChange={e => setPort(Number(e.target.value) || DEFAULT_PORT)}
              style={{width: 52, background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.5)', color: '#fff', borderRadius: 4, padding: '2px 6px'}}
            />
            <button onClick={() => connect()} style={btnStyle}>connect</button>
          </>
        )}
      </div>
      {(error || log.length > 0) && (
        <div
          style={{
            marginTop: 4,
            background: 'rgba(0,0,0,.85)',
            color: '#ddd',
            borderRadius: 6,
            padding: '4px 8px',
            maxWidth: 420
          }}
        >
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
