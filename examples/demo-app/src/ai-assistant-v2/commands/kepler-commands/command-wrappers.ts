/**
 * Generic utility for converting an existing AI SDK tool into a sqlrooms
 * `RoomCommand`. Kept dependency-light (only `zod` + `RoomCommand` type) so it
 * can be reused by any in-browser skill system that wants to expose its
 * existing AI SDK tools as commands without rewriting them.
 *
 * The demo-app's own command factories return `RoomCommand` directly (preferred
 * when you own the command — see `basemap-command.ts` for the reference shape). This
 * wrapper is the fallback path for hosts that cannot rewrite their tools:
 * it folds the tool's `execute`, `inputSchema`, and `toModelOutput` (the
 * token-trim logic the AI SDK applies between tool call and model) into a
 * single `RoomCommand.execute` so the registry-stored result already carries
 * the model-facing subset.
 */

import type {RoomCommand} from '@sqlrooms/room-store';
import type {ZodType} from 'zod';

/** A built AI SDK tool, treated loosely for dynamic dispatch. */
export type AnyTool = {
  execute?: (args: any, options: any) => Promise<any>;
  toModelOutput?: (params: {output: any; toolCallId?: string}) => any;
  description?: string;
  inputSchema?: ZodType;
};

/** Metadata that the AI SDK tool does not carry but a `RoomCommand` requires. */
export type CommandMeta = {
  /** Stable, namespaced command id, e.g. `map.set-basemap`. */
  id: string;
  /** Human-readable name shown in the command palette / listings. */
  name: string;
  /** Optional grouping label, e.g. `Map`, `Data`, `GeoDa`. */
  group?: string;
  /** Optional search keywords. */
  keywords?: string[];
};

/**
 * Cast a concrete zod schema (e.g. `z.object({...})`, which is `ZodObject<...>`)
 * to the `ZodType<unknown>` that `RoomCommand.inputSchema` expects. The
 * installed zod v3 `ZodObject` is not structurally assignable to sqlrooms'
 * `ZodType<unknown>` (covariance on the output type), so a cast is required at
 * the assignment site. This helper centralizes that cast.
 */
export function asInputSchema(schema: ZodType): ZodType<unknown> {
  return schema as unknown as ZodType<unknown>;
}

/**
 * Wrap an existing AI SDK tool as a sqlrooms `RoomCommand`. The command's
 * `execute` calls the tool's `execute` and then applies the tool's
 * `toModelOutput` (if any) so the trimmed, model-facing shape is what the
 * registry stores and downstream surfaces (AI skill, palette, CLI, MCP) see.
 */
export function toolToCommand(tool: AnyTool, meta: CommandMeta): RoomCommand {
  return {
    id: meta.id,
    name: meta.name,
    description: tool.description,
    group: meta.group,
    keywords: meta.keywords,
    inputSchema: tool.inputSchema as any,
    execute: async (_ctx, input) => {
      if (!tool.execute || typeof tool.execute !== 'function') {
        return {
          success: false,
          commandId: meta.id,
          error: 'Tool has no execute function.'
        };
      }
      try {
        const rawOutput = await tool.execute(input ?? {}, {toolCallId: meta.id});
        const trimmed =
          typeof tool.toModelOutput === 'function'
            ? tool.toModelOutput({output: rawOutput, toolCallId: meta.id})
            : rawOutput;
        return {
          success: rawOutput?.success ?? true,
          commandId: meta.id,
          data:
            typeof trimmed === 'object' && trimmed !== null
              ? trimmed
              : {details: trimmed}
        };
      } catch (error) {
        return {
          success: false,
          commandId: meta.id,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
  };
}