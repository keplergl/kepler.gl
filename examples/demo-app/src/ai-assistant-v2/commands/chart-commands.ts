/**
 * Chart commands — the five ECharts analytical tools (`histogramTool`,
 * `boxplotTool`, `scatterplotTool`, `bubbleChartTool`, `pcpTool`) exposed as
 * `RoomCommand`s routed through `executeApi` `executeCommand`.
 *
 * Previously these were direct AI SDK tools injected into every skill sub-agent
 * (see `runSkillTool.ts`). Converting them to commands lets them be discovered
 * dynamically via `discoverSkill` like every other capability, shrinks each
 * sub-agent's toolset to just `executeApi`, and makes the `skillPrompt.ts`
 * claim ("you do NOT have any direct tools of your own") literally true.
 *
 * The histogram renderer is dispatched by `commandId` rather than tool name —
 * see `tools/echarts-renderers.tsx` (`getEchartsToolRenderers` registers an
 * `executeApi` renderer that checks `output.commandId === 'chart.histogram'`).
 *
 * `barDataIndexes` from the histogram tool is intentionally NOT surfaced to the
 * model by `executeApi`'s `toModelOutput` (it is "not meant for the LLM to
 * read"); it survives through `result.data` so the renderer can use it for
 * brush-selection → map highlighting.
 */

import type {RoomCommand} from '@sqlrooms/room-store';
import {KeplerContext} from '../types';
import {getEchartsTools} from '../tools/echarts-tools';
import {toolToCommand} from './kepler-commands/command-wrappers';

/**
 * Build the five chart commands for a given `KeplerContext`. Returns a map
 * keyed by command id (e.g. `chart.histogram`) for flat-merge into the catalog.
 */
export function getChartCommands(ctx: KeplerContext): Record<string, RoomCommand> {
  const tools = getEchartsTools(ctx);
  const commands: RoomCommand[] = [
    {...toolToCommand(tools.histogramTool, {
      id: 'chart.histogram',
      name: 'Histogram',
      group: 'Chart',
      keywords: ['histogram', 'distribution', 'frequency', 'bin']
    }), metadata: {readOnly: true, riskLevel: 'low', idempotent: true}},
    {...toolToCommand(tools.boxplotTool, {
      id: 'chart.boxplot',
      name: 'Boxplot',
      group: 'Chart',
      keywords: ['boxplot', 'quartile', 'iqr', 'outlier']
    }), metadata: {readOnly: true, riskLevel: 'low', idempotent: true}},
    {...toolToCommand(tools.scatterplotTool, {
      id: 'chart.scatterplot',
      name: 'Scatterplot',
      group: 'Chart',
      keywords: ['scatterplot', 'correlation', 'scatter']
    }), metadata: {readOnly: true, riskLevel: 'low', idempotent: true}},
    {...toolToCommand(tools.bubbleChartTool, {
      id: 'chart.bubble',
      name: 'Bubble chart',
      group: 'Chart',
      keywords: ['bubble', 'chart', 'three variables']
    }), metadata: {readOnly: true, riskLevel: 'low', idempotent: true}},
    {...toolToCommand(tools.pcpTool, {
      id: 'chart.pcp',
      name: 'Parallel coordinates',
      group: 'Chart',
      keywords: ['parallel coordinates', 'pcp', 'multivariate']
    }), metadata: {readOnly: true, riskLevel: 'low', idempotent: true}}
  ];
  return Object.fromEntries(commands.map(c => [c.id, c]));
}