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
import {getKeplerCommands, getValuesFromDataset} from '@kepler.gl/mcp';
import type {KeplerContext, RoomCommandResult, ToolDescriptor} from '@kepler.gl/mcp';
import {WebMercatorViewport} from '@deck.gl/core';

const DEFAULT_PORT = 8765;
const WSHost = () => 'localhost';

// map.* commands that need a DuckDB connector / the kepler-app glue
// (`loadTableToKepler`, `loadTableIntoDuckDB`, `getConnector`). The mapping-only
// bridge does not serve them.
const DUCKDB_REQUIRED = new Set(['map.create-table', 'map.add-column', 'map.save-data']);

type BridgeStatus = 'idle' | 'connecting' | 'connected' | 'error';

function getUrlConfig(): {token: string; port: number; host: string} {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const stored = typeof window !== 'undefined' ? localStorage.getItem('kepler-mcp-token') : null;
  const token = params.get('mcp') ?? stored ?? '';
  const port = Number(params.get('mcpPort')) || DEFAULT_PORT;
  const host = params.get('mcpHost') ?? WSHost();
  return {token, port, host};
}

/** Live accessors into the demo's own redux store — no kepler-assistant needed. */
function buildKeplerContext(reduxStore: any): KeplerContext {
  const readMap = () => reduxStore?.getState()?.demo?.keplerGl?.map;
  return {
    getVisState: () => readMap()?.visState,
    getMapBoundary: () => {
      // Recompute the current viewport corners from the live mapState (same
      // WebMercatorViewport math the app's onViewStateChange uses). Fall back
      // to the assistant slice's stored boundary if mapState lacks a size.
      const mapState = readMap()?.mapState;
      if (mapState?.width && mapState?.height) {
        try {
          const viewport = new WebMercatorViewport(mapState);
          const nw = viewport.unproject([0, 0]);
          const se = viewport.unproject([viewport.width, viewport.height]);
          return {nw: [nw[0], nw[1]], se: [se[0], se[1]]};
        } catch {
          /* fall through to stored boundary */
        }
      }
      return reduxStore?.getState()?.demo?.aiAssistant?.keplerGl?.mapBoundary;
    },
    getMapboxToken: () =>
      typeof window !== 'undefined' ? (localStorage.getItem('mapbox-token') ?? undefined) : undefined,
    dispatch: (action: any) => reduxStore?.dispatch(action),
    getValuesFromDataset: (datasetName, variableName) => {
      const visState = readMap()?.visState;
      if (!visState) return [];
      return getValuesFromDataset(visState.datasets, visState.layers, datasetName, variableName);
    },
    getDatasetContext: () => {
      // Shape required by map.get-dataset-context: a human line, then a JSON
      // array of {datasetName, datasetId, fields, layers} descriptors.
      const visState = readMap()?.visState;
      const datasets = visState?.datasets;
      const layers = visState?.layers ?? [];
      if (!datasets) return '';
      const context =
        'Please remember the following datasets and layers for answering the user question:';
      const dataMeta = Object.values(datasets).map((ds: any) => ({
        datasetName: ds?.label ?? ds?.id,
        datasetId: ds?.id,
        fields: (ds?.fields ?? []).map((f: any) => ({[f.name]: f.type})),
        layers: layers
          .filter((layer: any) => layer?.config?.dataId === ds?.id)
          .map((layer: any) => ({
            id: layer.id,
            label: layer.config.label,
            type: layer.type,
            geometryMode: layer.config.columnMode,
            geometryColumns: Object.fromEntries(
              Object.entries(layer.config.columns)
                .filter(([, value]) => value !== null)
                .map(([key, value]) => [
                  key,
                  typeof value === 'object' && value !== null
                    ? Object.fromEntries(Object.entries(value).filter(([, v]) => v !== null))
                    : value
                ])
            )
          }))
      }));
      return `${context}\n${JSON.stringify(dataMeta)}`;
    },
    loadTableToKepler: async () => ({
      success: false,
      error: 'map.save-data / loadTableToKepler is not available in the mapping-only bridge.'
    }),
    loadTableIntoDuckDB: async () => {
      throw new Error('DuckDB operations are not available in the mapping-only bridge.');
    },
    getConnector: async () => {
      throw new Error('DuckDB operations are not available in the mapping-only bridge.');
    }
  };
}

/** The DuckDB-free map.* commands this page serves over the bridge. */
function buildCatalog(ctx: KeplerContext) {
  return Object.values(getKeplerCommands(ctx)).filter(c => !DUCKDB_REQUIRED.has(c.id));
}

function toDescriptor(cmd: {id: string; name: string; description?: string; group?: string; keywords?: string[]; metadata?: {readOnly?: boolean; idempotent?: boolean; riskLevel?: string; requiresConfirmation?: boolean}; inputSchema?: any}): ToolDescriptor {
  let inputSchema: Record<string, unknown> = {type: 'object'};
  if (cmd.inputSchema) {
    try {
      // zod v4 -> JSON Schema
      const zod: any = require('zod');
      inputSchema = (zod.toJSONSchema?.(cmd.inputSchema) ?? {type: 'object'}) as Record<string, unknown>;
    } catch {
      inputSchema = {type: 'object'};
    }
  }
  return {
    id: cmd.id,
    name: cmd.name,
    description: cmd.description,
    group: cmd.group,
    keywords: cmd.keywords,
    inputSchema,
    metadata: cmd.metadata as ToolDescriptor['metadata']
  };
}

function formatResult(result: RoomCommandResult): string {
  if (result.error) return `✗ ${result.commandId}: ${result.error}`;
  const data = result.data as {details?: string} | undefined;
  return data?.details ? `✓ ${data.details}` : `✓ ${result.commandId} ok`;
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
