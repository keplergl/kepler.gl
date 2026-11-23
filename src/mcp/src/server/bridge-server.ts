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
import {constants} from 'node:fs';
import type {ReadStream} from 'node:fs';
import {open} from 'node:fs/promises';
import type {FileHandle} from 'node:fs/promises';
import {createServer} from 'node:http';
import type {IncomingMessage, Server as HttpServer, ServerResponse} from 'node:http';
import {basename, isAbsolute} from 'node:path';
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
  socket: WebSocket;
};

type LocalResource = {
  id: string;
  path: string;
  file: FileHandle;
  size: number;
  origin: string;
  callId: string;
  transfers: Set<{stream: ReadStream; response: ServerResponse}>;
  cleanup?: Promise<void>;
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
  // Keep prose-only replies readable, but never let a summary hide payload fields.
  if (data && typeof data.details === 'string' && Object.keys(data).length === 1) {
    return {text: data.details, isError: false};
  }
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
  private readonly localResources = new Map<string, LocalResource>();
  private pageOrigin = '';
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
    return (this.pageTools ?? this.staticTools).map(tool => {
      if (tool.commandId !== 'map.load-data') return tool;
      const schema = tool.inputSchema;
      if (schema['x-kepler-local-resource'] !== 1) return tool;
      return {
        ...tool,
        description:
          'LOCAL FILES ON THE MCP SERVER: pass filePath with the absolute path of one explicitly selected local file, instead of url. ' +
          'The bridge transfers the file directly; no separate HTTP server or encoded tool payload is needed. ' +
          tool.description,
        inputSchema: {
          ...schema,
          properties: {
            ...(schema.properties as Record<string, unknown>),
            filePath: {
              type: 'string',
              minLength: 1,
              description:
                'Absolute path to an explicitly selected regular file on the machine running this MCP server. Mutually exclusive with url.'
            }
          },
          required: ((schema.required as string[]) ?? []).filter(key => key !== 'url'),
          oneOf: [{required: ['url']}, {required: ['filePath']}]
        }
      };
    });
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
      const resource = this.localResources.get(request.url ?? '');
      if (resource) {
        this.serveLocalResource(resource, request, response);
        return;
      }
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
    wss.on('connection', (socket, request) =>
      this.handleConnection(socket, request.url, request.headers.origin)
    );

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
    let resource: LocalResource | undefined;
    if (tool.commandId === 'map.load-data') {
      const hasFilePath = Object.prototype.hasOwnProperty.call(input, 'filePath');
      const hasUrl = Object.prototype.hasOwnProperty.call(input, 'url');
      if (hasFilePath === hasUrl) {
        throw new Error('Provide exactly one of url or filePath to load a dataset.');
      }
      if (hasFilePath) {
        const pageTool = this.pageTools?.find(candidate => candidate.commandId === 'map.load-data');
        if (pageTool?.inputSchema['x-kepler-local-resource'] !== 1) {
          throw new Error(
            'The connected map has not advertised local file import support. Update or reload the map page, wait for its connection, and retry.'
          );
        }
        resource = await this.openLocalResource(input.filePath, callId);
        if (this.socket !== socket || socket.readyState !== WebSocket.OPEN) {
          await this.releaseLocalResource(resource);
          throw new Error(
            'The map page disconnected or was replaced before the file transfer started.'
          );
        }
        const address = this.httpServer?.address();
        if (!address || typeof address === 'string') {
          await this.releaseLocalResource(resource);
          throw new Error('The local transfer server is unavailable. Reconnect the map and retry.');
        }
        if (address.address !== '127.0.0.1' && address.address !== '::1') {
          await this.releaseLocalResource(resource);
          throw new Error(
            'Local file imports require a loopback bridge host (127.0.0.1 or ::1). Restart the MCP server with a loopback host.'
          );
        }
        const host = address.address.includes(':') ? `[${address.address}]` : address.address;
        input = {
          url: `http://${host}:${address.port}${resource.path}`,
          ...(input.datasetName !== undefined ? {datasetName: input.datasetName} : {})
        };
      }
    }
    const reply = new Promise<RoomCommandResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.failCall(
          callId,
          `Timed out after ${this.options.callTimeoutMs} ms waiting for the map page. Retry with a smaller file or increase callTimeoutMs.`
        );
      }, this.options.callTimeoutMs);
      this.pending.set(callId, {resolve, reject, timer, socket});
    });

    try {
      socket.send(JSON.stringify({type: 'call', callId, tool: tool.commandId, input}), error => {
        if (error)
          this.failCall(callId, 'Unable to send the command to the map. Reconnect and retry.');
      });
    } catch {
      this.failCall(callId, 'Unable to send the command to the map. Reconnect and retry.');
    }
    try {
      return await reply;
    } finally {
      if (resource) await this.releaseLocalResource(resource);
    }
  }

  async close(): Promise<void> {
    this.rejectPending('The bridge was closed.');
    this.pageTools = null;
    this.socket?.close(1000, 'bridge closed');
    this.socket = null;
    await Promise.all(
      [...this.localResources.values()].map(resource => this.releaseLocalResource(resource))
    );
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

  private handleConnection(
    socket: WebSocket,
    requestUrl: string | undefined,
    origin: string | undefined
  ): void {
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
    this.rejectPending('The kepler.gl page was replaced by a newer connection.');
    this.socket?.close(1000, 'replaced by a newer connection');
    this.socket = socket;
    this.pageOrigin = origin ?? new URL(this.options.mapUrl).origin;
    this.pageTools = null;

    socket.on('message', data => {
      if (this.socket === socket) this.handleMessage(data);
    });
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
    for (const callId of this.pending.keys()) this.failCall(callId, reason);
  }

  private failCall(callId: string, reason: string): void {
    const pendingCall = this.pending.get(callId);
    if (!pendingCall) return;
    clearTimeout(pendingCall.timer);
    this.pending.delete(callId);
    if (pendingCall.socket.readyState === WebSocket.OPEN) {
      pendingCall.socket.send(JSON.stringify({type: 'cancel', callId}), () => undefined);
    }
    pendingCall.reject(new Error(reason));
  }

  private async openLocalResource(filePath: unknown, callId: string): Promise<LocalResource> {
    if (typeof filePath !== 'string' || !filePath.trim() || !isAbsolute(filePath)) {
      throw new Error('filePath must be an absolute path to an explicitly selected local file.');
    }
    let file: FileHandle;
    try {
      // Nonblocking open prevents a FIFO/device supplied by mistake from
      // hanging before fstat can reject anything except regular files.
      file = await open(filePath, constants.O_RDONLY | constants.O_NONBLOCK);
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code ?? 'unknown error';
      throw new Error(
        `Cannot open the selected local file (${code}). Check that it exists and is readable by the MCP server.`
      );
    }
    try {
      const stats = await file.stat();
      if (!stats.isFile()) throw new Error('Select a regular file, not a directory or device.');
      if (stats.size === 0)
        throw new Error('The selected file is empty. Select a non-empty dataset.');
      const id = randomUUID();
      const resource: LocalResource = {
        id,
        path: `/local-data/${id}/${encodeURIComponent(basename(filePath))}`,
        file,
        size: stats.size,
        origin: this.pageOrigin,
        callId,
        transfers: new Set()
      };
      this.localResources.set(resource.path, resource);
      return resource;
    } catch (error) {
      await file.close();
      throw error;
    }
  }

  private serveLocalResource(
    resource: LocalResource,
    request: IncomingMessage,
    response: ServerResponse
  ): void {
    if (request.headers.origin && request.headers.origin !== resource.origin) {
      response.writeHead(403);
      response.end('This transfer belongs to a different map origin.');
      return;
    }
    const headers = {
      'Access-Control-Allow-Origin': resource.origin,
      'Access-Control-Expose-Headers': 'X-Kepler-Local-Resource',
      'Cache-Control': 'no-store',
      Vary: 'Origin',
      'X-Kepler-Local-Resource': resource.id
    };
    if (request.method === 'OPTIONS') {
      response.writeHead(204, {...headers, 'Access-Control-Allow-Methods': 'GET'});
      response.end();
      return;
    }
    if (request.method !== 'GET') {
      response.writeHead(405, {...headers, Allow: 'GET, OPTIONS'});
      response.end();
      return;
    }
    response.writeHead(200, {
      ...headers,
      'Content-Type': 'application/octet-stream',
      'Content-Length': resource.size
    });
    const stream = resource.file.createReadStream({
      autoClose: false,
      start: 0,
      end: resource.size - 1
    });
    const transfer = {stream, response};
    resource.transfers.add(transfer);
    response.on('close', () => {
      resource.transfers.delete(transfer);
      stream.destroy();
    });
    stream.on('error', () => {
      response.destroy();
      this.failCall(
        resource.callId,
        'The local file transfer failed. Check that the file is still readable and retry.'
      );
    });
    stream.pipe(response);
  }

  private releaseLocalResource(resource: LocalResource): Promise<void> {
    if (!resource.cleanup) {
      this.localResources.delete(resource.path);
      for (const {stream, response} of resource.transfers) {
        stream.destroy();
        response.destroy();
      }
      resource.cleanup = resource.file.close();
    }
    return resource.cleanup;
  }
}
