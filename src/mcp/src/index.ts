/**
 * @kepler.gl/mcp — the kepler.gl map surface.
 *
 * Only the map contract + the map.* commands live here, plus dependency-light
 * helper utilities (e.g. `commands/utils.ts`) that hosts are meant to reuse.
 * No MCP server, no analysis, no app-specific wiring glue — those belong to
 * kepler-assistant, which imports this package for the commands and implements
 * the `KeplerContext` glue seam.
 */

export * from './map-contract';
export * from './types';
export * from './commands';
