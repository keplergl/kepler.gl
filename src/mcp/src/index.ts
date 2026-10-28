// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * @kepler.gl/mcp — the kepler.gl map surface.
 *
 * Only the map contract + the map.* commands live here, plus dependency-light
 * helper utilities (e.g. `commands/utils.ts`) that hosts are meant to reuse.
 * No analysis and no app-specific wiring glue — those belong to
 * kepler-assistant, which imports this package for the commands and implements
 * the `KeplerContext` glue seam.
 *
 * This root entry stays browser-safe. The stdio MCP server (which needs `ws`
 * and Node APIs) lives in the `./server` subpath and is never imported here.
 */

export * from './map-contract';
export * from './types';
export * from './commands';
