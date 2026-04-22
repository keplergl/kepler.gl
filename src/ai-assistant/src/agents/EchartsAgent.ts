// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ToolLoopAgent, stepCountIs, tool} from 'ai';
import {z} from 'zod';
import {streamSubAgent, AiSliceState} from '@sqlrooms/ai-core';
import {StoreApi} from '@sqlrooms/room-store';
import {KeplerContext} from '../types';
import {getEchartsTools} from '../tools/echarts-tools';
import {getModel} from './model-utils';

const ECHARTS_AGENT_INSTRUCTIONS = `You are a data visualization assistant. You help users create charts and plots to explore their data.

Available chart types:
- Boxplot: for showing distribution of numeric variables
- Histogram: for frequency distribution
- Scatterplot: for showing relationships between two variables
- Bubble chart: for three-variable visualization (x, y, size)
- PCP (Parallel Coordinates Plot): for multi-variable comparison

When creating charts:
1. Ask for or infer the relevant dataset and variable names
2. Choose the most appropriate chart type for the analysis
3. Explain what the chart reveals about the data
`;

export function echartsAgentTool(store: StoreApi<AiSliceState>, ctx: KeplerContext) {
  return tool({
    description:
      'An agent for creating data visualizations: boxplots, histograms, scatterplots, bubble charts, and parallel coordinate plots.',
    inputSchema: z.object({
      reasoning: z.string().describe('Reasoning for why this agent is being called'),
      prompt: z.string().describe('The data visualization request')
    }),
    execute: async ({prompt}, options?: {toolCallId?: string; abortSignal?: AbortSignal}) => {
      const tools = getEchartsTools(ctx);
      const agent = new ToolLoopAgent({
        model: getModel(store),
        instructions: ECHARTS_AGENT_INSTRUCTIONS,
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
