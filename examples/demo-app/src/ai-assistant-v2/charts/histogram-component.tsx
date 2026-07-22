import React, {useMemo, useRef} from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';

import * as echarts from 'echarts/core';
import {use as echartsUse, registerTheme as echartsRegisterTheme} from 'echarts/core';
import {BarChart} from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  BrushComponent,
  ToolboxComponent
} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';

import {ECHARTS_DARK_THEME} from './echarts-theme';
import {getHistogramChartOption, type HistogramDataProps} from './histogram-option';

echartsUse([
  BarChart,
  GridComponent,
  TooltipComponent,
  BrushComponent,
  ToolboxComponent,
  CanvasRenderer
]);

echartsRegisterTheme('dark', ECHARTS_DARK_THEME);

/**
 * Props for the histogram chart. Mirrors `@openassistant/echarts`'s
 * `HistogramOutputData`. `barDataIndexes[i]` holds the row indexes that fall
 * into bin `i`, which powers the brush-selection callback.
 */
export type HistogramOutputData = {
  datasetName: string;
  variableName: string;
  histogramData: HistogramDataProps[];
  barDataIndexes: number[][];
  onSelected?: (datasetName: string, selectedIndices: number[]) => void;
  theme?: string;
  /** Fixed chart height in px. Defaults to 260. */
  height?: number;
};

/**
 * ECharts histogram, copied from `@openassistant/echarts`
 * (`HistogramComponent`) and adapted to plain Tailwind styling. Supports brush
 * selection which calls `onSelected` with the row indexes of the brushed bars.
 */
export function HistogramComponent({
  datasetName,
  histogramData,
  barDataIndexes,
  variableName,
  onSelected,
  theme,
  height = 260
}: HistogramOutputData): React.JSX.Element | null {
  const option = useMemo(() => {
    try {
      return getHistogramChartOption(null, histogramData, barDataIndexes);
    } catch {
      return {};
    }
  }, [histogramData, barDataIndexes]);

  const eChartsRef = useRef<ReactEChartsCore>(null);

  const bindEvents = useMemo(() => {
    return {
      brushSelected: function (params: {
        batch: Array<{
          selected: Array<{
            dataIndex: number[];
          }>;
        }>;
      }) {
        const brushed: number[] = [];
        const brushComponent = params.batch[0];

        for (let sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
          const rawIndices = brushComponent.selected[sIdx].dataIndex as number[];
          brushed.push(...rawIndices);
        }

        const filteredIndex =
          brushed.length > 0 ? brushed.map((idx: number) => barDataIndexes[idx]).flat() : [];

        if (brushed.length === 0) {
          const chart = eChartsRef.current;
          if (chart) {
            const chartInstance = chart.getEchartsInstance();
            const updatedOption = getHistogramChartOption(
              null,
              histogramData ?? [],
              barDataIndexes ?? []
            );
            chartInstance.setOption(updatedOption);
          }
        }

        onSelected?.(datasetName ?? '', filteredIndex);
      }
    };
  }, [datasetName, onSelected, histogramData, barDataIndexes]);

  if (!variableName || !histogramData || !barDataIndexes) {
    return null;
  }

  return (
    <div
      style={{height}}
      className="flex w-full flex-col rounded-lg bg-gray-950 p-4 text-gray-100 shadow"
    >
      <div className="flex-col items-start p-1">
        <p className="text-[10px] font-bold uppercase">{variableName}</p>
      </div>
      <div className="min-h-0 grow py-2">
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          notMerge={true}
          lazyUpdate={true}
          style={{height: '100%', width: '100%'}}
          ref={eChartsRef}
          theme={theme || 'dark'}
          onEvents={bindEvents}
        />
      </div>
    </div>
  );
}
