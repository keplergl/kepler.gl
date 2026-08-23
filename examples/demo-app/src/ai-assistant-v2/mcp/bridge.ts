// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * In-page MCP bridge (the browser path).
 *
 * The kepler.gl app is a static, client-side site that *dials out* to the local
 * kepler-mcp hub (`ws://localhost:PORT`). When the MCP service receives a
 * `map.*` tool call it forwards it to this bridge, which executes the command
 * against the room-store command registry (the single source of truth) and
 * returns the result. This is the demo-app side of the PROPOSAL §3.3 bridge.
 *
 * Security (PROPOSAL §5): the bridge is **opt-in and default off**. It only
 * connects when the page URL has `?mcp=1`. The hub enforces an Origin allowlist
 * and a pairing code, which the page presents via `?code=` (or
 * `?mcpCode=`), so the user's consent gate is explicit.
 */

/** Inbound tool-call frame from the hub. */
type HubFrame = {id: string; tool: string; input?: unknown};

const DEFAULT_HUB_PORT = 9123;

function params(): URLSearchParams {
  return typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
}

function hubPort(): number {
  const p = Number(params().get('mcpPort'));
  return Number.isFinite(p) && p > 0 ? p : DEFAULT_HUB_PORT;
}

function pairingCode(): string {
  const explicit = params().get('mcpCode') || params().get('code');
  if (explicit) return explicit;
  try {
    return localStorage.getItem('kepler-mcp-code') || '';
  } catch {
    return '';
  }
}

function getRoomStore(): any {
  return (window as any).__keplerRoomStore;
}

function connect(url: string, code: string): void {
  let ws: WebSocket;
  try {
    ws = new WebSocket(url);
  } catch {
    scheduleRetry(url, code);
    return;
  }

  ws.onopen = () => {
    // Register with the hub using the pairing code (PROPOSAL §5).
    ws.send(JSON.stringify({id: 'bridge-register', tool: '__register', input: {code}}));
  };

  ws.onmessage = async (event) => {
    let frame: HubFrame;
    try {
      frame = JSON.parse(String(event.data)) as HubFrame;
    } catch {
      return;
    }
    if (!frame?.id || !frame?.tool || frame.tool === '__register') return;

    const store = getRoomStore();
    if (!store?.getState?.().commands?.invokeCommand) {
      ws.send(JSON.stringify({id: frame.id, success: false, error: 'AI assistant not ready'}));
      return;
    }
    try {
      const result = await store.getState().commands.invokeCommand(frame.tool, frame.input ?? {});
      ws.send(
        JSON.stringify({
          id: frame.id,
          success: result.success,
          data: result.data,
          error: result.error
        })
      );
    } catch (error) {
      ws.send(
        JSON.stringify({
          id: frame.id,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        })
      );
    }
  };

  ws.onclose = () => scheduleRetry(url, code);
  ws.onerror = () => {
    // close will fire and schedule the retry.
  };
}

let retryTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleRetry(url: string, code: string): void {
  if (retryTimer) return;
  retryTimer = setTimeout(() => {
    retryTimer = null;
    connect(url, code);
  }, 2000);
}

/**
 * Start the MCP bridge. No-op unless the page URL has `?mcp=1` (opt-in).
 * Connects to `ws://localhost:<mcpPort>` (default 9123) and registers with the
 * pairing code from `?mcpCode=` / `?code=` / localStorage.
 */
export function startMcpBridge(): void {
  if (typeof window === 'undefined') return;
  if (params().get('mcp') !== '1') return; // default off
  connect(`ws://localhost:${hubPort()}`, pairingCode());
}
