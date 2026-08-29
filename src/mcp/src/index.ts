/**
 * @kepler.gl/mcp — the kepler.gl map surface.
 *
 * Only the map contract + the map.* commands live here. No MCP server, no
 * analysis, no glue — those belong to kepler-assistant, which imports this
 * package for the commands and implements the `KeplerContext` glue seam.
 */

export * from './map-contract';
export * from './types';
export * from './commands';
