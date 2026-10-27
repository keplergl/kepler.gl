/**
 * Ambient declarations for non-code assets the demo-app esbuild bundles.
 * `kepler-mcp-shared.ts` imports the map-management skill markdown as text
 * (esbuild `loader: {'.md': 'text'}`); this keeps editors / tsc quiet.
 */
declare module '*.md' {
  const content: string;
  export default content;
}
