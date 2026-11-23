// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Server} from '@modelcontextprotocol/sdk/server/index.js';
import {CallToolRequestSchema, ListToolsRequestSchema} from '@modelcontextprotocol/sdk/types.js';
import {formatResult} from './bridge-server';
import type {KeplerMcpBridge} from './bridge-server';

/** Configure the MCP protocol independently of the CLI's stdio transport. */
export function createKeplerMcpServer(bridge: KeplerMcpBridge, version: string): Server {
  const server = new Server(
    {name: 'kepler-mcp', version},
    {capabilities: {tools: {listChanged: true}}}
  );

  // A client cannot receive catalog notifications until initialization finishes.
  // Earlier changes are already reflected in its first tools/list response.
  let unsubscribe: (() => void) | undefined;
  server.oninitialized = () => {
    unsubscribe?.();
    unsubscribe = bridge.onToolsChanged(() => {
      void server.sendToolListChanged().catch(error => server.onerror?.(error));
    });
  };
  server.onclose = () => {
    unsubscribe?.();
    unsubscribe = undefined;
  };

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

  return server;
}
