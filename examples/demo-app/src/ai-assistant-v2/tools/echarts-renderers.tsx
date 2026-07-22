import React from 'react';
import type {ToolRenderer, ToolRendererRegistry} from '@sqlrooms/ai-core';
import type {HistogramToolOutput} from './echarts-tools';
import {HistogramComponent} from '../charts/histogram-component';

/**
 * Bridge for the histogram brush-selection callback. The tool renderer is a
 * standalone component in the registry and has no access to the kepler context,
 * so the store registers a handler here that highlights the selected rows.
 */
type HistogramSelectionHandler = (datasetName: string, selectedIndices: number[]) => void;

let histogramSelectionHandler: HistogramSelectionHandler | undefined;

export function setHistogramSelectionHandler(handler: HistogramSelectionHandler | undefined) {
  histogramSelectionHandler = handler;
}

/**
 * Renders the output of `histogramTool` as an ECharts histogram, matching the
 * OpenAssistant `HistogramPlotComponent`.
 *
 * Registered in the store `toolRenderers` map under the `histogramTool` key AND
 * hoisted via `hoistedRenderers` in `MainView`, so the chart is drawn inline in
 * the chat. Without both, the tool output is only summarized as text.
 */
export const HistogramToolResult: ToolRenderer<HistogramToolOutput> = ({
  output,
  state,
  errorText
}) => {
  if (state === 'output-error') {
    return (
      <div className="text-destructive text-xs">
        Histogram failed: {errorText ?? output?.error ?? 'Unknown error'}
      </div>
    );
  }

  if (!output || !output.success) {
    if (state === 'input-streaming' || state === 'input-available') {
      return <div className="text-xs opacity-60">Building histogram…</div>;
    }
    return (
      <div className="text-destructive text-xs">
        Histogram failed: {output?.error ?? 'No data returned'}
      </div>
    );
  }

  if (!output.histogramData?.length || !output.barDataIndexes?.length) {
    return <div className="text-xs opacity-60">No values to plot.</div>;
  }

  return (
    <div className="my-2 w-full">
      <HistogramComponent
        datasetName={output.datasetName}
        variableName={output.variableName}
        histogramData={output.histogramData}
        barDataIndexes={output.barDataIndexes}
        onSelected={(datasetName, selectedIndices) =>
          histogramSelectionHandler?.(datasetName, selectedIndices)
        }
      />
    </div>
  );
};

/**
 * Renderers for the echarts-style analytical tools, keyed by tool name so they
 * can be spread into the store `toolRenderers` registry.
 */
export function getEchartsToolRenderers(): ToolRendererRegistry {
  return {
    histogramTool: HistogramToolResult as ToolRenderer<any>
  };
}
