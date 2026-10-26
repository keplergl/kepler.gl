// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Server-side entry point of `@kepler.gl/mcp`.
 *
 * Browser bundles must not import this module: it pulls in `ws` and Node APIs.
 * The map contracts and commands stay in the package root; this subpath is for
 * the stdio MCP server (`kepler-mcp`) and for tests.
 */

export {KeplerMcpBridge, formatResult, getMapTools, toToolName} from './bridge-server';
export type {KeplerMcpBridgeOptions, KeplerMcpBridgeStart, MapTool} from './bridge-server';
