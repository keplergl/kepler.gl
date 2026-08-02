/**
 * The skill-runtime `runSkill` tool. Lifecycle for one call:
 *
 *   1. Resolve `skillId` via `SkillStorage.resolveSkillId`.
 *   2. Read the skill record (manifest + instructions).
 *   3. Spin up a fresh `ToolLoopAgent` seeded with the skill's `SKILL.md` as
 *      instructions and a tool set built from the shared `KeplerContext`:
 *      `executeApi` (the unified command dispatcher — `executeCommand` routes
 *      a `commandId` such as "map.get-boundary", "data.query", "geoda.lisa"
 *      to the underlying kepler / DuckDB / GeoDa / geo tools, and
 *      `listCommands` enumerates the available command ids) PLUS the five
 *      ECharts analytical tools (`histogramTool`, `boxplotTool`,
 *      `scatterplotTool`, `bubbleChartTool`, `pcpTool`). The ECharts tools are
 *      exposed as named tools rather than `executeApi` commands because a
 *      chart's deliverable is the React component and its tool name must
 *      survive to the UI for the right renderer to be selected. They are
 *      injected into every skill, not just `charts`, so e.g. the LISA and
 *      classify skills can draw a histogram mid-workflow.
 *   4. Stream that sub-agent via `streamSubAgent` so its tool calls surface in
 *      the parent's activity log.
 */

import {streamSubAgent, type AiSliceState} from '@sqlrooms/ai-core';
import type {SkillStorage} from '@sqlrooms/ai';
import type {StoreApi} from '@sqlrooms/room-store';
import {ToolLoopAgent, stepCountIs, tool, type LanguageModel} from 'ai';
import {z} from 'zod';
import type {KeplerContext} from '../types';
import {createExecuteApiTool} from './executeApi';
import {getEchartsTools} from '../tools/echarts-tools';

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
  getKeplerContext,
  getModel
}: CreateRunSkillToolOptions) {
  return tool({
    description:
      'Run an installed skill by id. The skill receives the goal as its user prompt and has access to the executeApi tool, which dispatches map/data/geoda/geo commands.',
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
          executeApi: createExecuteApiTool(store),
          ...getEchartsTools(getKeplerContext())
        };

        const subAgent = new ToolLoopAgent({
          model: getModel(),
          tools: skillTools,
          instructions: record.instructions,
          stopWhen: stepCountIs(10)
        });

        const result = await streamSubAgent(
          subAgent as any,
          goal,
          store,
          options?.toolCallId || '',
          options?.abortSignal
        );

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
