// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ToolLoopAgent, stepCountIs, tool} from 'ai';
import {z} from 'zod';
import {streamSubAgent, AiSliceState} from '@sqlrooms/ai-core';
import {StoreApi} from '@sqlrooms/room-store';
import {KeplerContext} from '../types';
import {getLisaTools} from '../tools/lisa-tool';
import {getModel} from './model-utils';

const LISA_AGENT_INSTRUCTIONS = `You are a spatial statistics assistant specializing in spatial autocorrelation, clustering analysis, and spatial regression.

For clustering analysis:
1. Always perform a spatial statistical test (e.g., Local Moran's I)
2. Explain the results in context
3. STRICT RULE: Never use datasets generated from previous LISA tools (dataset name with "lisa_" prefix) as input for a new LISA analysis

For spatial weights:
1. Queen contiguity is the most common method for polygon data
2. KNN is useful for point data
3. Distance band is useful when you need a specific distance threshold

For regression:
1. Start with OLS as a baseline
2. Use spatial lag/error models when spatial dependence is detected
3. Compare model fit statistics

For variable standardization:
1. When standardizing multiple variables, always use the most recently created dataset as input
2. Only use the original dataset for the first standardization
3. Confirm final dataset contains all standardized columns

For colocation maps:
1. Create categorical variables for both variables
2. Use tableTool to combine categories
3. Create unique values visualization
`;

export function lisaAgentTool(store: StoreApi<AiSliceState>, ctx: KeplerContext) {
  return tool({
    description:
      'An agent for spatial statistics: LISA (Local Moran, Geary, Gi*), global Moran\'s I, spatial weights creation, spatial regression, and data classification.',
    inputSchema: z.object({
      reasoning: z.string().describe('Reasoning for why this agent is being called'),
      prompt: z.string().describe('The spatial statistics request')
    }),
    execute: async ({prompt}, options?: {toolCallId?: string; abortSignal?: AbortSignal}) => {
      const tools = getLisaTools(ctx);
      const agent = new ToolLoopAgent({
        model: getModel(store),
        instructions: LISA_AGENT_INSTRUCTIONS,
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
