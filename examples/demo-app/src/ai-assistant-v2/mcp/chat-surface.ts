// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Expose the kepler.gl command registry as the kepler-agnostic `ChatToolSurface`
 * (owned by kepler-assistant). This is the seam that lets a chat harness drive
 * kepler.gl's commands without depending on the app internals.
 *
 * The shape (listTools + invoke → {success, data?, error?}) is identical to the
 * `ChatToolSurface` interface in kepler-assistant, so the chat harness can drive
 * either this registry or the kepler-mcp service interchangeably.
 */

export interface ChatToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface ChatToolSurface {
  listTools(): string[];
  invoke(tool: string, input: unknown): Promise<ChatToolResult>;
}

/** Wrap the room-store command registry as a `ChatToolSurface`. */
export function createRegistryChatSurface(store: any): ChatToolSurface {
  return {
    listTools: () => Object.keys(store?.getState?.()?.commands?.registry ?? {}),
    async invoke(tool, input) {
      const r = await store?.getState?.()?.commands?.invokeCommand(tool, input ?? {});
      return {success: !!r?.success, data: r?.data, error: r?.error};
    }
  };
}
