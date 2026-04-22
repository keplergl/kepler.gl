// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef} from 'react';
import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts/core';
import {BarChart, ScatterChart, BoxplotChart, ParallelChart} from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  BrushComponent,
  ToolboxComponent,
  TitleComponent,
  DataZoomComponent,
  DataZoomInsideComponent
} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import type {EChartsOption} from 'echarts';

import type {
  HistogramToolOutput,
  BoxplotToolOutput,
  ScatterplotToolOutput,
  BubbleChartToolOutput,
  PCPToolOutput
} from '../tools/echarts-tools';

export type BrushLinkCallback = (datasetName: string, selectedIndices: number[]) => void;

const BrushLinkContext = createContext<BrushLinkCallback | undefined>(undefined);

export const BrushLinkProvider = BrushLinkContext.Provider;

echarts.use([
  BarChart,
  ScatterChart,
  BoxplotChart,
  ParallelChart,
  GridComponent,
  TooltipComponent,
  BrushComponent,
  ToolboxComponent,
  TitleComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  CanvasRenderer
]);

const DARK_THEME = {
  backgroundColor: 'rgba(14,14,14,0)',
  textStyle: {},
  title: {textStyle: {color: '#eee'}, subtextStyle: {color: '#aaa'}},
  categoryAxis: {
    axisLine: {lineStyle: {color: '#eee'}},
    axisTick: {lineStyle: {color: '#eee'}},
    axisLabel: {color: '#eee'},
    splitLine: {lineStyle: {color: ['#333']}}
  },
  valueAxis: {
    axisLine: {lineStyle: {color: '#eee'}},
    axisTick: {lineStyle: {color: '#eee'}},
    axisLabel: {color: '#eee'},
    splitLine: {lineStyle: {color: ['#333']}}
  }
};

echarts.registerTheme('dark', DARK_THEME);

const BAR_COLORS = ['#FF6B6B', '#48BB78', '#4299E1', '#ED64A6', '#F6E05E'];

function numFmt(n: number): string {
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

type BrushSelectedParams = {
  batch: Array<{selected: Array<{dataIndex: number[]}>}>;
};

function activateBrush(chart: any, brushType = 'rect') {
  chart.dispatchAction({
    type: 'takeGlobalCursor',
    key: 'brush',
    brushOption: {brushType, brushMode: 'single'}
  });
}

function useChartResize(
  wrapperRef: React.RefObject<HTMLDivElement | null>,
  eChartsRef: React.RefObject<ReactEChartsCore | null>
) {
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const chart = eChartsRef.current?.getEchartsInstance();
      chart?.resize();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [wrapperRef, eChartsRef]);
}

// ---------------------------------------------------------------------------
// Histogram Renderer
// ---------------------------------------------------------------------------
type ToolRendererProps<T> = {
  output: T | undefined;
  input: unknown;
  toolCallId: string;
  state: string;
};

export const HistogramRenderer: React.FC<ToolRendererProps<HistogramToolOutput>> = ({output}) => {
  const onSelected = useContext(BrushLinkContext);
  const eChartsRef = useRef<ReactEChartsCore>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useChartResize(wrapperRef, eChartsRef);

  const histogramData = output?.success ? output.histogramData : undefined;
  const barDataIndexes = output?.success ? output.barDataIndexes : undefined;
  const variableName = output?.success ? output.variableName : undefined;
  const datasetName = output?.success ? output.datasetName : '';

  const option = useMemo<EChartsOption | null>(() => {
    if (!histogramData?.length || !barDataIndexes) return null;
    const barData = histogramData.map((d, i) => ({
      value: barDataIndexes[i].length,
      itemStyle: {
        color: BAR_COLORS[i % BAR_COLORS.length],
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.3)'
      },
      name: `[${numFmt(d.binStart)} - ${numFmt(d.binEnd)}]`
    }));

    const min = histogramData[0].binStart;
    const max = histogramData[histogramData.length - 1].binEnd;
    const interval = (max - min) / histogramData.length;

    return {
      xAxis: [
        {
          type: 'category',
          axisTick: {show: false},
          axisLabel: {show: false},
          axisLine: {show: false},
          splitLine: {show: false},
          position: 'bottom'
        },
        {
          scale: true,
          type: 'value',
          min,
          max,
          interval,
          axisLabel: {hideOverlap: true, rotate: 35, formatter: numFmt},
          splitLine: {show: false},
          position: 'bottom'
        }
      ],
      yAxis: {
        type: 'value',
        axisLabel: {formatter: numFmt},
        splitLine: {show: false},
        axisTick: {show: false},
        axisLine: {show: false}
      },
      series: [
        {
          data: barData,
          type: 'bar',
          barWidth: '90%',
          xAxisIndex: 0,
          label: {show: false}
        }
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {type: 'shadow'},
        formatter(params: any) {
          const p = Array.isArray(params) ? params[0] : params;
          return `Range: ${p.data.name}<br/>Count: ${p.value}`;
        }
      },
      brush: {toolbox: ['rect', 'keep', 'clear'], xAxisIndex: 0},
      grid: [{left: '3%', right: '5%', top: '20%', bottom: '0%', containLabel: true}]
    };
  }, [histogramData, barDataIndexes]);

  const onChartReady = useCallback((chart: any) => activateBrush(chart), []);

  const bindEvents = useMemo(
    () => ({
      brushSelected(params: BrushSelectedParams) {
        if (!barDataIndexes) return;
        const brushComponent = params.batch[0];
        const brushed: number[] = [];
        for (let i = 0; i < brushComponent.selected.length; i++) {
          brushed.push(...brushComponent.selected[i].dataIndex);
        }
        const filteredIndex = brushed.length > 0 ? brushed.flatMap(idx => barDataIndexes[idx]) : [];
        onSelected?.(datasetName, filteredIndex);
      }
    }),
    [datasetName, barDataIndexes, onSelected]
  );

  if (!option) return null;

  return (
    <div
      ref={wrapperRef}
      className="w-full"
      style={{height: 300, overflow: 'hidden', minWidth: 0, maxWidth: '100%'}}
    >
      <div className="flex flex-col rounded-lg pt-2">
        <div className="px-2">
          <p className="text-xs font-bold uppercase text-gray-200">{variableName}</p>
        </div>
        <div style={{height: 260}} className="py-1">
          <ReactEChartsCore
            ref={eChartsRef}
            echarts={echarts}
            option={option}
            notMerge
            lazyUpdate
            theme="dark"
            style={{height: '100%', width: '100%'}}
            opts={{renderer: 'canvas'}}
            onEvents={bindEvents}
            onChartReady={onChartReady}
          />
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Boxplot Renderer
// ---------------------------------------------------------------------------
export const BoxplotRenderer: React.FC<ToolRendererProps<BoxplotToolOutput>> = ({output}) => {
  const onSelected = useContext(BrushLinkContext);
  const eChartsRef = useRef<ReactEChartsCore>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useChartResize(wrapperRef, eChartsRef);

  const valid = Boolean(output?.success && output?.boxplots?.length);
  const boxplots = valid ? output!.boxplots : [];
  const meanPoint = valid ? output!.meanPoint : [];
  const rawData = valid ? output!.rawData : {};
  const variables = valid ? output!.variables : [];
  const datasetName = valid ? output!.datasetName : '';

  const option = useMemo<EChartsOption | null>(() => {
    if (!boxplots.length) return null;
    const pointsData = Object.values(rawData).map((values, di) =>
      values.map((v: number) => [v, di])
    );
    const meanPointData = meanPoint.map((mp, di) => [mp[1], di]);

    const scatterSeries = pointsData.map(data => ({
      type: 'scatter' as const,
      data,
      symbolSize: data.length > 1000 ? 4 : 6,
      symbol: data.length > 1000 ? ('rect' as const) : ('circle' as const),
      itemStyle: {color: 'lightblue', borderColor: '#aaa'},
      emphasis: {
        focus: 'series' as const,
        symbolSize: 6,
        itemStyle: {color: 'red', borderWidth: 1}
      }
    }));

    return {
      xAxis: {
        type: 'value',
        splitLine: {show: false},
        axisLabel: {formatter: numFmt}
      },
      yAxis: {
        type: 'category',
        boundaryGap: true,
        splitLine: {show: false},
        axisLabel: {
          formatter(_d: string, i: number) {
            return boxplots[i]?.name ?? '';
          }
        }
      },
      series: [
        ...scatterSeries,
        {
          type: 'boxplot' as const,
          data: boxplots.map(b => [b.low, b.q1, b.q2, b.q3, b.high]),
          itemStyle: {borderColor: 'white', color: '#DB631C', opacity: 1},
          emphasis: {focus: 'none' as const, disabled: true}
        },
        {
          type: 'scatter' as const,
          data: meanPointData,
          symbolSize: 8,
          itemStyle: {color: '#14C814', borderColor: 'black', opacity: 1}
        }
      ],
      brush: {toolbox: ['rect', 'keep', 'clear'], xAxisIndex: 0},
      grid: [{left: '3%', right: '5%', top: '20%', bottom: '0%', containLabel: true}],
      tooltip: {trigger: 'item'},
      progressive: 0,
      animation: false
    };
  }, [boxplots, meanPoint, rawData]);

  const onChartReady = useCallback((chart: any) => activateBrush(chart), []);

  const bindEvents = useMemo(
    () => ({
      brushSelected(params: BrushSelectedParams) {
        const brushComponent = params.batch[0];
        const brushed = new Set<number>();
        for (let i = 0; i < brushComponent.selected.length; i++) {
          for (const idx of brushComponent.selected[i].dataIndex) {
            brushed.add(idx);
          }
        }
        onSelected?.(datasetName, Array.from(brushed));
      }
    }),
    [datasetName, onSelected]
  );

  if (!option) return null;

  return (
    <div
      ref={wrapperRef}
      className="w-full"
      style={{height: 300, overflow: 'hidden', minWidth: 0, maxWidth: '100%'}}
    >
      <div className="flex flex-col rounded-lg pt-2">
        <div className="px-2">
          <p className="text-xs font-bold uppercase text-gray-200">{variables.join(', ')}</p>
          <small className="text-xs text-gray-400">{datasetName}</small>
        </div>
        <div style={{height: 260}} className="py-1">
          <ReactEChartsCore
            ref={eChartsRef}
            echarts={echarts}
            option={option}
            notMerge
            lazyUpdate
            theme="dark"
            style={{height: '100%', width: '100%'}}
            opts={{renderer: 'canvas'}}
            onEvents={bindEvents}
            onChartReady={onChartReady}
          />
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scatterplot Renderer
// ---------------------------------------------------------------------------
export const ScatterplotRenderer: React.FC<ToolRendererProps<ScatterplotToolOutput>> = ({
  output
}) => {
  const onSelected = useContext(BrushLinkContext);
  const eChartsRef = useRef<ReactEChartsCore>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useChartResize(wrapperRef, eChartsRef);

  const valid = Boolean(output?.success && output?.xData?.length);
  const xData = valid ? output!.xData : [];
  const yData = valid ? output!.yData : [];
  const xVariableName = valid ? output!.xVariableName : '';
  const yVariableName = valid ? output!.yVariableName : '';
  const datasetName = valid ? output!.datasetName : '';

  const option = useMemo<EChartsOption | null>(() => {
    if (!xData.length) return null;
    const seriesData = xData.map((x, i) => [x, yData[i]]);
    return {
      xAxis: {type: 'value', splitLine: {show: false}, axisLabel: {formatter: numFmt}},
      yAxis: {type: 'value', splitLine: {show: false}, axisLabel: {formatter: numFmt}},
      series: [
        {
          data: seriesData,
          type: 'scatter',
          symbolSize: seriesData.length > 1000 ? 3 : 5,
          symbol: seriesData.length > 1000 ? 'rect' : 'circle',
          itemStyle: {color: 'none', borderColor: '#aaa', opacity: 1, borderWidth: 1},
          emphasis: {symbolSize: 8, itemStyle: {color: 'red', borderWidth: 2}},
          animationDelay: 0
        }
      ],
      tooltip: {
        trigger: 'item',
        formatter(params: any) {
          return `${xVariableName}: ${numFmt(params.value[0])}<br/>${yVariableName}: ${numFmt(
            params.value[1]
          )}`;
        },
        axisPointer: {type: 'cross'}
      },
      brush: {toolbox: ['rect', 'polygon', 'clear'], xAxisIndex: 0, yAxisIndex: 0},
      grid: {left: '3%', right: '5%', bottom: '3%', containLabel: true},
      animation: false,
      progressive: 0
    };
  }, [xData, yData, xVariableName, yVariableName]);

  const onChartReady = useCallback((chart: any) => activateBrush(chart), []);

  const bindEvents = useMemo(
    () => ({
      brushSelected(params: BrushSelectedParams) {
        const brushComponent = params.batch[0];
        const brushed: number[] = [];
        for (let i = 0; i < brushComponent.selected.length; i++) {
          brushed.push(...brushComponent.selected[i].dataIndex);
        }
        onSelected?.(datasetName, brushed);
      }
    }),
    [datasetName, onSelected]
  );

  if (!option) return null;

  return (
    <div
      ref={wrapperRef}
      className="w-full"
      style={{height: 300, overflow: 'hidden', minWidth: 0, maxWidth: '100%'}}
    >
      <div className="flex flex-col rounded-lg pt-2">
        <div className="px-2">
          <p className="text-xs font-bold uppercase text-gray-200">
            {xVariableName} vs {yVariableName}
          </p>
          <small className="text-xs text-gray-400">{datasetName}</small>
        </div>
        <div style={{height: 260}} className="py-1">
          <ReactEChartsCore
            ref={eChartsRef}
            echarts={echarts}
            option={option}
            notMerge
            lazyUpdate
            theme="dark"
            style={{height: '100%', width: '100%'}}
            opts={{renderer: 'canvas'}}
            onEvents={bindEvents}
            onChartReady={onChartReady}
          />
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Bubble Chart Renderer
// ---------------------------------------------------------------------------
export const BubbleChartRenderer: React.FC<ToolRendererProps<BubbleChartToolOutput>> = ({
  output
}) => {
  const onSelected = useContext(BrushLinkContext);
  const eChartsRef = useRef<ReactEChartsCore>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useChartResize(wrapperRef, eChartsRef);

  const valid = Boolean(output?.success && output?.data?.variableX?.values?.length);
  const data = valid ? output!.data : undefined;
  const datasetName = valid ? output!.datasetName : '';

  const option = useMemo<EChartsOption | null>(() => {
    if (!data) return null;
    const xData = data.variableX.values;
    const yData = data.variableY.values;
    const sizeData = data.variableSize.values;
    const sizeMin = Math.min(...sizeData);
    const sizeRange = Math.max(...sizeData) - sizeMin;
    const sizeNorm = sizeData.map(d => (50 * (d - sizeMin)) / (sizeRange || 1));
    const seriesData = xData.map((x, i) => [x, yData[i], sizeNorm[i]]);

    return {
      xAxis: {type: 'value', splitLine: {show: false}},
      yAxis: {type: 'value', splitLine: {show: false}},
      series: [
        {
          data: seriesData,
          type: 'scatter',
          symbolSize: (params: any) => params[2],
          itemStyle: {color: 'lightblue', borderColor: '#555', opacity: 0.5},
          emphasis: {focus: 'series', itemStyle: {borderColor: 'red'}}
        }
      ],
      tooltip: {
        trigger: 'item',
        formatter(params: any) {
          return `${data.variableX.name}: ${params.value[0]}<br/>${data.variableY.name}: ${params.value[1]}`;
        }
      },
      brush: {toolbox: ['rect', 'polygon', 'clear'], xAxisIndex: 0, yAxisIndex: 0},
      grid: {left: '3%', right: '5%', bottom: '3%', containLabel: true},
      animation: false,
      progressive: 0
    };
  }, [data]);

  const onChartReady = useCallback((chart: any) => activateBrush(chart), []);

  const bindEvents = useMemo(
    () => ({
      brushSelected(params: BrushSelectedParams) {
        const brushComponent = params.batch[0];
        const brushed: number[] = [];
        for (let i = 0; i < brushComponent.selected.length; i++) {
          brushed.push(...brushComponent.selected[i].dataIndex);
        }
        onSelected?.(datasetName, brushed);
      }
    }),
    [datasetName, onSelected]
  );

  if (!option) return null;

  return (
    <div
      ref={wrapperRef}
      className="w-full"
      style={{height: 300, overflow: 'hidden', minWidth: 0, maxWidth: '100%'}}
    >
      <div className="flex flex-col rounded-lg pt-2">
        <div className="px-2">
          <p className="text-xs font-bold uppercase text-gray-200">
            x: {data!.variableX.name}, y: {data!.variableY.name}, size: {data!.variableSize.name}
          </p>
          <small className="text-xs text-gray-400">{datasetName}</small>
        </div>
        <div style={{height: 260}} className="py-1">
          <ReactEChartsCore
            ref={eChartsRef}
            echarts={echarts}
            option={option}
            notMerge
            lazyUpdate
            theme="dark"
            style={{height: '100%', width: '100%'}}
            opts={{renderer: 'canvas'}}
            onEvents={bindEvents}
            onChartReady={onChartReady}
          />
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// PCP Renderer
// ---------------------------------------------------------------------------
export const PCPRenderer: React.FC<ToolRendererProps<PCPToolOutput>> = ({output}) => {
  const onSelected = useContext(BrushLinkContext);
  const eChartsRef = useRef<ReactEChartsCore>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useChartResize(wrapperRef, eChartsRef);

  const valid = Boolean(output?.success && output?.pcp?.length);
  const pcp = valid ? output!.pcp : [];
  const rawData = valid ? output!.rawData : {};
  const variables = valid ? output!.variables : [];
  const datasetName = valid ? output!.datasetName : '';

  const dataRowWise = useMemo(() => {
    const columns = Object.values(rawData);
    const rowCount = columns[0]?.length || 0;
    const rows: number[][] = new Array(rowCount);
    for (let i = 0; i < rowCount; i++) {
      rows[i] = new Array(columns.length);
      for (let j = 0; j < columns.length; j++) {
        rows[i][j] = columns[j][i];
      }
    }
    return rows;
  }, [rawData]);

  const option = useMemo<EChartsOption | null>(() => {
    if (!pcp.length) return null;
    const parallelAxis = pcp.map((p, i) => ({
      dim: i,
      name: `${p.name}\n[${numFmt(p.min)}, ${numFmt(p.max)}]\nmean: ${numFmt(p.mean)}`
    }));

    return {
      parallel: {
        right: '5%',
        left: '80px',
        top: '40px',
        bottom: '30px',
        layout: 'vertical',
        parallelAxisDefault: {
          axisLabel: {formatter: numFmt},
          nameLocation: 'start'
        }
      },
      brush: {toolbox: ['clear'], brushLink: 'all'},
      parallelAxis,
      series: {
        type: 'parallel',
        lineStyle: {opacity: 0.8, color: 'lightblue'},
        data: dataRowWise,
        emphasis: {focus: 'series', lineStyle: {color: 'red', opacity: 1}},
        inactiveOpacity: 0.4,
        activeOpacity: 1.0
      },
      grid: [{left: '3%', right: '5%', top: '20%', bottom: '0%', containLabel: true}],
      progressive: 0,
      animation: false
    } as EChartsOption;
  }, [pcp, dataRowWise]);

  const bindEvents = useMemo(
    () => ({
      axisareaselected() {
        const chart = eChartsRef.current?.getEchartsInstance();
        if (!chart) return;
        const model = (chart as any).getModel();
        const coordSys = model.getComponent('parallel')?.coordinateSystem;
        if (!coordSys) return;

        const activeIndices: number[] = [];
        dataRowWise.forEach((row, idx) => {
          if (coordSys.eachActiveState(row, (state: string) => state) !== 'inactive') {
            activeIndices.push(idx);
          }
        });
        onSelected?.(datasetName, activeIndices.length === dataRowWise.length ? [] : activeIndices);
      }
    }),
    [datasetName, dataRowWise, onSelected]
  );

  if (!option) return null;

  return (
    <div
      ref={wrapperRef}
      className="w-full"
      style={{height: 320, overflow: 'hidden', minWidth: 0, maxWidth: '100%'}}
    >
      <div className="flex flex-col rounded-lg pt-2">
        <div className="px-2">
          <p className="text-xs font-bold uppercase text-gray-200">{variables.join(', ')}</p>
          <small className="text-xs text-gray-400">{datasetName}</small>
        </div>
        <div style={{height: 280}} className="py-1">
          <ReactEChartsCore
            ref={eChartsRef}
            echarts={echarts}
            option={option}
            notMerge
            lazyUpdate
            theme="dark"
            style={{height: '100%', width: '100%'}}
            opts={{renderer: 'canvas'}}
            onEvents={bindEvents}
          />
        </div>
      </div>
    </div>
  );
};
