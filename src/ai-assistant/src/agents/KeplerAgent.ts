// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ToolLoopAgent, stepCountIs, tool} from 'ai';
import {z} from 'zod';
import {streamSubAgent, AiSliceState} from '@sqlrooms/ai-core';
import {StoreApi} from '@sqlrooms/room-store';
import {KeplerContext} from '../types';
import {getKeplerTools} from '../tools/kepler-tools';
import {getModel} from './model-utils';

const KEPLER_AGENT_INSTRUCTIONS = `You are a kepler.gl map operations assistant. You help users with map visualization tasks.

For kepler.gl tools:
1. Use loadData tool to load a dataset from a URL if requested by the user.
2. Do not call addLayer tool after loadData tool or saveDataToMap tool, as these tools automatically create a map layer.
3. For addLayer tool: if dataset cannot be found, please prompt the user to save the dataset first.
4. Do not call saveDataToMap after tableTool, as tableTool will automatically save the dataset to kepler.gl.
`;

export function keplerAgentTool(store: StoreApi<AiSliceState>, ctx: KeplerContext) {
  return tool({
    description:
      'An agent for kepler.gl map operations: adding layers, changing basemaps, loading data, updating layer styles, and managing map datasets.',
    inputSchema: z.object({
      reasoning: z.string().describe('Reasoning for why this agent is being called'),
      prompt: z.string().describe('The map operation request')
    }),
    execute: async ({prompt}, options?: {toolCallId?: string; abortSignal?: AbortSignal}) => {
      const tools = getKeplerTools(ctx);
      const agent = new ToolLoopAgent({
        model: getModel(store),
        instructions: KEPLER_AGENT_INSTRUCTIONS,
        tools,
        stopWhen: stepCountIs(10)
      });

      const result = await streamSubAgent(
        agent,
        prompt,
        store,
        options?.toolCallId || '',
        options?.abortSignal
      );

      return {
        success: true,
        finalOutput: result.finalOutput
      };
    }
  });
}
