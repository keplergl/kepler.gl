/**
 * The skill-runtime `runSkill` tool. Lifecycle for one call:
 *
 *   1. Resolve `skillId` via `SkillStorage.resolveSkillId`.
 *   2. Read the skill record (manifest + instructions).
 *   3. Spin up a fresh `ToolLoopAgent` seeded with the skill's `SKILL.md` as
 *      instructions and a tool set built from the shared `KeplerContext`:
 *      `executeApi` (the unified command dispatcher — `executeCommand` routes
 *      a `commandId` such as "map.get-boundary", "data.query", "geoda.analysis",
 *      "chart.histogram" to the underlying kepler / DuckDB / GeoDa / geo /
 *      chart commands, and `listCommands` enumerates the available command ids).
 *      Charts are now routed through `executeApi` like every other command —
 *      the histogram renderer dispatches on `output.commandId` rather than
 *      tool name (see `tools/echarts-renderers.tsx`).
 *   4. Stream that sub-agent via `streamSubAgent` so its tool calls surface in
 *      the parent's activity log.
 */

import {streamSubAgent, type AiSliceState} from '@sqlrooms/ai-core';
import type {SkillStorage} from '@sqlrooms/ai';
import type {StoreApi} from '@sqlrooms/room-store';
import {ToolLoopAgent, tool, type LanguageModel} from 'ai';
import {z} from 'zod';
import type {KeplerContext} from '../types';
import {createExecuteApiTool} from './executeApi';

/**
 * Maximum number of tool-loop steps a skill sub-agent may take before it is
 * cut off. Matches the `ToolLoopAgent` default (20). When the cap is hit the
 * result is marked `truncated` so the orchestrator knows the skill may not
 * have finished — previously a low cap (10) silently returned a partial
 * `finalOutput` with `success: true`, which the parent agent reported as a
 * completed task.
 */
const MAX_SKILL_STEPS = 20;

export interface CreateRunSkillToolOptions {
  store: StoreApi<AiSliceState>;
  storage: SkillStorage;
  /** Shared kepler.gl redux bridge; tools read/write the map through it. */
  getKeplerContext: () => KeplerContext;
  /**
   * Resolver for the language model. Called once per `runSkill` invocation
   * so the sub-agent uses the session's current provider/model.
   */
  getModel: () => LanguageModel;
}

export function createRunSkillTool({
  store,
  storage,
  getModel
}: CreateRunSkillToolOptions) {
  return tool({
    description:
      'Run an installed skill by id. The skill receives the goal as its user prompt and has access to the executeApi tool, which dispatches map/data/geoda/geo/chart commands.',
    inputSchema: z.object({
      reasoning: z.string().describe('Why this skill is being invoked.'),
      skillId: z.string().describe('The id of the skill to run, e.g. "colocation".'),
      goal: z
        .string()
        .describe(
          'The task for the skill: the concrete question or instruction to execute against.'
        )
    }),
    execute: async (
      {skillId, goal}: {skillId: string; goal: string},
      options?: {toolCallId?: string; abortSignal?: AbortSignal}
    ) => {
      try {
        const ref = await storage.resolveSkillId(skillId);
        if (!ref) {
          return {
            success: false as const,
            error: `No skill found with id "${skillId}".`
          };
        }
        const record = await storage.readSkill(ref);

        const skillTools = {
          executeApi: createExecuteApiTool(store)
        };

        // The stop condition only fires when the loop still has pending tool
        // calls (i.e. the agent was mid-work), so `stepLimitHit` reliably
        // distinguishes "cut off by the cap" from "finished naturally".
        let stepLimitHit = false;
        const subAgent = new ToolLoopAgent({
          model: getModel(),
          tools: skillTools,
          instructions: record.instructions,
          stopWhen: ({steps}) => {
            if (steps.length >= MAX_SKILL_STEPS) {
              stepLimitHit = true;
              return true;
            }
            return false;
          }
        });

        const result = await streamSubAgent(
          subAgent as any,
          goal,
          store,
          options?.toolCallId || '',
          options?.abortSignal
        );

        if (stepLimitHit) {
          return {
            success: true as const,
            skillId,
            rootId: ref.rootId,
            truncated: true as const,
            finalOutput:
              result.finalOutput +
              '\n\n[Note: the skill reached its step limit and may not have completed all steps. ' +
              'If the task is not fully done, continue from where it left off.]'
          };
        }

        return {
          success: true as const,
          skillId,
          rootId: ref.rootId,
          finalOutput: result.finalOutput
        };
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') throw err;
        return {
          success: false as const,
          error: `Skill "${skillId}" failed: ${err instanceof Error ? err.message : String(err)}`
        };
      }
    }
  });
}
