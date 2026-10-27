// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * The bridge between an MCP client and a kepler.gl page.
 *
 * Browsers cannot listen on a port, so the page is a WebSocket CLIENT that
 * connects OUT to `ws://127.0.0.1:<port>/ws?token=...` (the reverse-connect
 * pattern). This server holds that socket, advertises the `map.*` tools to the
 * MCP client, and forwards each call to the page, where the command registry
 * executes against the live map.
 *
 * The tool list comes from the package itself (`getKeplerCommands`), so tools
 * exist before a page connects; a call without a page returns a clear error.
 * Once a page says `hello` its own catalog replaces the static one, because a
 * page may not serve every command (the demo app omits the DuckDB-backed ones).
 */

import {randomUUID} from 'node:crypto';
import {createServer} from 'node:http';
import type {Server as HttpServer} from 'node:http';
import {WebSocket, WebSocketServer} from 'ws';
import {z} from 'zod';
import {getKeplerCommands} from '../commands';
import type {KeplerContext, RoomCommandResult, ToolDescriptor} from '../commands/types';

const DEFAULT_PORT = 8765;
const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_CALL_TIMEOUT_MS = 60_000;

export type MapTool = {
  /** MCP tool name, e.g. `map_add_layer` (dots are not allowed in tool names). */
  name: string;
  /** The `map.*` command id the call is forwarded to. */
  commandId: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

export type KeplerMcpBridgeOptions = {
  port?: number;
  host?: string;
  /** Base URL of the map page, printed with the token. */
  mapUrl?: string;
  callTimeoutMs?: number;
};

export type KeplerMcpBridgeStart = {
  host: string;
  port: number;
  token: string;
  /** What a human should open: `<mapUrl>?mcp=<token>`. */
  pageUrl: string;
};

type PendingCall = {
  resolve: (result: RoomCommandResult) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
};

/** MCP tool names are commonly restricted to [A-Za-z0-9_-]; `map.add-layer` → `map_add_layer`. */
export function toToolName(commandId: string): string {
  return commandId.replace(/\./g, '_');
}

function toInputSchema(command: {inputSchema?: unknown}): Record<string, unknown> {
  if (command.inputSchema) {
    try {
      const schema = z.toJSONSchema(command.inputSchema as z.ZodType);
      if (schema) return schema as Record<string, unknown>;
    } catch {
      // Not every command ships a zod schema; fall back to a free-form object.
    }
  }
  return {type: 'object'};
}

/** The map surface as declared by this package, independent of any page. */
export function getMapTools(): MapTool[] {
  const commands = getKeplerCommands({} as KeplerContext);
  return Object.values(commands).map(command => ({
    name: toToolName(command.id),
    commandId: command.id,
    description: command.description || command.name,
    inputSchema: toInputSchema(command)
  }));
}

function toolsFromDescriptors(descriptors: ToolDescriptor[]): MapTool[] {
  return descriptors
    .filter(descriptor => descriptor && descriptor.id)
    .map(descriptor => ({
      name: toToolName(descriptor.id),
      commandId: descriptor.id,
      description: descriptor.description || descriptor.name || descriptor.id,
      inputSchema: (descriptor.inputSchema as Record<string, unknown>) || {type: 'object'}
    }));
}

/** RoomCommandResult → the text an MCP client shows for a tool call. */
export function formatResult(result: RoomCommandResult): {text: string; isError: boolean} {
  if (result && typeof result === 'object' && result.success === false) {
    return {text: `✗ ${result.commandId}: ${result.error ?? 'failed'}`, isError: true};
  }
  if (result && typeof result === 'object' && result.error) {
    return {text: `✗ ${result.commandId}: ${result.error}`, isError: true};
  }
  const data = result?.data as {details?: string} | undefined;
  if (data && typeof data.details === 'string') return {text: data.details, isError: false};
  return {text: JSON.stringify(result?.data ?? result ?? null, null, 2), isError: false};
}

export class KeplerMcpBridge {
  private readonly options: Required<KeplerMcpBridgeOptions>;
  private readonly staticTools: MapTool[];
  private pageTools: MapTool[] | null = null;
  private socket: WebSocket | null = null;
  private wss: WebSocketServer | null = null;
  private httpServer: HttpServer | null = null;
  private readonly pending = new Map<string, PendingCall>();
  private token = '';
  private pageUrl = '';

  constructor(options: KeplerMcpBridgeOptions = {}) {
    this.options = {
      port: options.port ?? DEFAULT_PORT,
      host: options.host ?? DEFAULT_HOST,
      mapUrl: options.mapUrl ?? 'http://localhost:8080',
      callTimeoutMs: options.callTimeoutMs ?? DEFAULT_CALL_TIMEOUT_MS
    };
    this.staticTools = getMapTools();
  }

  /** Tools the MCP client can call right now. */
  getTools(): MapTool[] {
    return this.pageTools ?? this.staticTools;
  }

  get connected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  async start(): Promise<KeplerMcpBridgeStart> {
    if (this.wss) throw new Error('The kepler.gl bridge is already running.');

    this.token = randomUUID().replace(/-/g, '');

    // A plain HTTP GET on `/` redirects to the map page carrying the token, so
    // the user can open `http://127.0.0.1:<port>/` even when the MCP client
    // never shows the server's stderr. Only `/ws` upgrades to a WebSocket.
    const httpServer = createServer((request, response) => {
      if (request.url === '/' || request.url?.startsWith('/?')) {
        response.writeHead(302, {Location: this.pageUrl});
        response.end();
        return;
      }
      response.writeHead(404, {'content-type': 'text/plain'});
      response.end('kepler-mcp: the map page connects at /ws');
    });
    this.httpServer = httpServer;

    const wss = new WebSocketServer({server: httpServer, path: '/ws'});
    this.wss = wss;
    wss.on('connection', (socket, request) => this.handleConnection(socket, request.url));

    await new Promise<void>((resolve, reject) => {
      httpServer.once('error', reject);
      httpServer.listen(this.options.port, this.options.host, () => resolve());
    });

    const address = httpServer.address();
    const port = typeof address === 'object' && address ? address.port : this.options.port;
    const mapUrl = this.options.mapUrl.replace(/\/$/, '');
    this.pageUrl = `${mapUrl}${mapUrl.includes('?') ? '&' : '?'}mcp=${encodeURIComponent(
      this.token
    )}`;
    return {host: this.options.host, port, token: this.token, pageUrl: this.pageUrl};
  }

  async callTool(name: string, input: Record<string, unknown> = {}): Promise<RoomCommandResult> {
    const tool =
      this.getTools().find(candidate => candidate.name === name) ??
      this.staticTools.find(candidate => candidate.name === name);
    if (!tool) {
      throw new Error(
        `Unknown map tool "${name}". Available: ${this.getTools()
          .map(candidate => candidate.name)
          .join(', ')}.`
      );
    }
    const socket = this.socket;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      throw new Error(
        'No kepler.gl map page is connected. Open the page URL printed at startup ' +
          '(it carries ?mcp=<token>), then call the tool again.'
      );
    }

    const callId = randomUUID();
    const reply = new Promise<RoomCommandResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(callId);
        reject(
          new Error(`Timed out after ${this.options.callTimeoutMs} ms waiting for the map page.`)
        );
      }, this.options.callTimeoutMs);
      this.pending.set(callId, {resolve, reject, timer});
    });

    socket.send(JSON.stringify({type: 'call', callId, tool: tool.commandId, input}));
    return reply;
  }

  async close(): Promise<void> {
    this.rejectPending('The bridge was closed.');
    this.pageTools = null;
    this.socket?.close(1000, 'bridge closed');
    this.socket = null;
    const wss = this.wss;
    const httpServer = this.httpServer;
    this.wss = null;
    this.httpServer = null;
    if (!wss) return;
    // close() only stops listening and waits for clients; terminate them so
    // shutdown (and tests) do not hang on a page that never closes its socket.
    for (const client of wss.clients) client.terminate();
    await new Promise<void>(resolve => wss.close(() => resolve()));
    if (httpServer) {
      await new Promise<void>(resolve => httpServer.close(() => resolve()));
    }
  }

  private handleConnection(socket: WebSocket, requestUrl: string | undefined): void {
    let token: string | null = null;
    try {
      token = new URL(requestUrl ?? '/ws', 'http://127.0.0.1').searchParams.get('token');
    } catch {
      token = null;
    }
    // The token is the only thing keeping other local pages/processes from
    // driving the map; reject a mismatch before accepting any message.
    if (token !== this.token) {
      socket.close(1008, 'invalid token');
      return;
    }

    // One map page at a time: a second tab takes over so calls never race
    // between two live maps.
    this.socket?.close(1000, 'replaced by a newer connection');
    this.socket = socket;
    this.pageTools = null;

    socket.on('message', data => this.handleMessage(data));
    socket.on('close', () => {
      if (this.socket === socket) {
        this.socket = null;
        this.pageTools = null;
        this.rejectPending('The kepler.gl page disconnected.');
      }
    });
    // Errors are followed by close; the close handler resets state.
    socket.on('error', () => undefined);
  }

  private handleMessage(raw: unknown): void {
    let message: any;
    try {
      message = JSON.parse(String(raw));
    } catch {
      return;
    }
    if (message?.type === 'hello' && Array.isArray(message.commands)) {
      this.pageTools = toolsFromDescriptors(message.commands as ToolDescriptor[]);
      return;
    }
    if (message?.type === 'result' && typeof message.callId === 'string') {
      const pendingCall = this.pending.get(message.callId);
      if (!pendingCall) return;
      clearTimeout(pendingCall.timer);
      this.pending.delete(message.callId);
      pendingCall.resolve(message.result as RoomCommandResult);
    }
  }

  private rejectPending(reason: string): void {
    for (const [callId, pendingCall] of this.pending) {
      clearTimeout(pendingCall.timer);
      this.pending.delete(callId);
      pendingCall.reject(new Error(reason));
    }
  }
}
