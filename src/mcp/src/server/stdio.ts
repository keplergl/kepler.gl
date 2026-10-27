#!/usr/bin/env node

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * `kepler-mcp` — a stdio MCP server for the kepler.gl map surface.
 *
 * The agent starts this process (it speaks MCP on stdin/stdout); the process
 * also listens for the map page on a loopback WebSocket. It prints a URL that
 * carries the one-time token — open that URL and the page connects, after which
 * every map.* tool call executes against the live map.
 *
 * stdout belongs to the MCP protocol: every log line here goes to stderr.
 */

import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {Server} from '@modelcontextprotocol/sdk/server/index.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {CallToolRequestSchema, ListToolsRequestSchema} from '@modelcontextprotocol/sdk/types.js';
import {KeplerMcpBridge, formatResult} from './bridge-server';
import type {KeplerMcpBridgeOptions} from './bridge-server';

const DEFAULT_MAP_URL = 'http://localhost:8080';

function readVersion(): string {
  if (typeof __dirname === 'undefined') return '0.0.0';
  let directory = __dirname;
  // Walk up until the package manifest is found, so this works both from src/
  // (babel-node, tests) and from dist/cjs/server (the published bin).
  for (let depth = 0; depth < 5; depth++) {
    try {
      const manifest = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'));
      if (manifest.name === '@kepler.gl/mcp') return manifest.version;
    } catch {
      // no manifest at this level — keep walking
    }
    directory = dirname(directory);
  }
  return '0.0.0';
}

function usage(): string {
  return [
    'Usage: kepler-mcp [--port <n>] [--host <h>] [--map-url <url>]',
    '',
    'Runs a stdio MCP server for the kepler.gl map surface and waits for a',
    'kepler.gl page to connect over a loopback WebSocket.',
    '',
    '  --port <n>       WebSocket port for the page (default 8765)',
    '  --host <h>       loopback host to bind (default 127.0.0.1)',
    `  --map-url <url>  page URL printed with the token (default ${DEFAULT_MAP_URL})`
  ].join('\n');
}

function parseArgs(argv: string[]): KeplerMcpBridgeOptions & {help?: boolean} {
  const options: KeplerMcpBridgeOptions & {help?: boolean} = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--port') {
      const value = Number(argv[++i]);
      if (!Number.isInteger(value) || value < 0 || value > 65535) {
        throw new Error(`Invalid --port value: ${argv[i]}`);
      }
      options.port = value;
    } else if (arg === '--host') {
      options.host = argv[++i];
    } else if (arg === '--map-url') {
      options.mapUrl = argv[++i];
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.error(usage());
    return;
  }

  const bridge = new KeplerMcpBridge(options);
  const started = await bridge.start();

  const server = new Server(
    {name: 'kepler-mcp', version: readVersion()},
    {capabilities: {tools: {}}}
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: bridge.getTools().map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema as {type: 'object'; [key: string]: unknown}
    }))
  }));

  server.setRequestHandler(CallToolRequestSchema, async request => {
    const {name, arguments: args} = request.params;
    try {
      const result = await bridge.callTool(name, (args ?? {}) as Record<string, unknown>);
      const {text, isError} = formatResult(result);
      return {content: [{type: 'text' as const, text}], ...(isError ? {isError: true} : {})};
    } catch (error) {
      return {
        content: [
          {type: 'text' as const, text: error instanceof Error ? error.message : String(error)}
        ],
        isError: true
      };
    }
  });

  const shutdown = async () => {
    await bridge.close();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  await server.connect(new StdioServerTransport());

  console.error(`[kepler-mcp] bridge listening on ws://${started.host}:${started.port}/ws`);
  console.error(
    `[kepler-mcp] open http://${started.host}:${started.port}/ in a browser — it redirects ` +
      'to the map page with the token — so the agent can drive the map'
  );
  console.error(`[kepler-mcp] or open ${started.pageUrl}`);
}

main().catch(error => {
  console.error(`[kepler-mcp] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
