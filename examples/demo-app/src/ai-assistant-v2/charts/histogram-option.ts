import type {EChartsOption} from 'echarts';
import type {TopLevelFormatterParams, CallbackDataParams} from 'echarts/types/dist/shared';

/**
 * Histogram bin descriptor consumed by the ECharts option builder.
 * Mirrors `@openassistant/echarts`'s `HistogramDataProps`.
 */
export type HistogramDataProps = {
  bin: number;
  binStart: number;
  binEnd: number;
};

/**
 * Compact numeric formatter, copied from `@openassistant/common`'s
 * `numericFormatter`, so the axis/tooltip labels match OpenAssistant.
 */
export const numericFormatter = (value: number): string =>
  Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);

const defaultBarColors = ['#FF6B6B', '#48BB78', '#4299E1', '#ED64A6', '#F6E05E'];

/**
 * Builds the ECharts option for a histogram. Copied from
 * `@openassistant/echarts` (`getHistogramChartOption`) so the chart renders
 * identically without depending on the OpenAssistant package at runtime.
 */
export function getHistogramChartOption(
  filteredIndex: number[] | null,
  histogramData: HistogramDataProps[],
  barDataIndexes: number[][]
): EChartsOption {
  const hasHighlighted = filteredIndex && filteredIndex.length > 0;

  const filteredIndexDict: {[key: number]: boolean} = {};
  if (hasHighlighted) {
    filteredIndex.forEach((d: number) => {
      filteredIndexDict[d] = true;
    });
  }

  const highlightedBars = histogramData.map((d: HistogramDataProps, i: number) => {
    const highlightedIds = barDataIndexes[i].filter(
      (idx: number) => filteredIndexDict[idx] === true
    );

    return {
      value: hasHighlighted ? highlightedIds?.length : 0,
      itemStyle: {
        color: defaultBarColors[i % defaultBarColors.length],
        opacity: 1
      },
      name: `[${numericFormatter(d.binStart)} - ${numericFormatter(d.binEnd)}]`,
      ids: hasHighlighted ? highlightedIds : []
    };
  });

  const minValue = histogramData[0].binStart;
  const maxValue = histogramData[histogramData.length - 1].binEnd;
  const numBins = histogramData.length;
  const interval = (maxValue - minValue) / numBins;

  const barData = histogramData.map((d: HistogramDataProps, i: number) => ({
    value: hasHighlighted
      ? barDataIndexes[i].length - highlightedBars[i].value
      : barDataIndexes[i].length,
    itemStyle: {
      color: defaultBarColors[i % defaultBarColors.length],
      opacity: hasHighlighted ? 0.5 : 1,
      shadowBlur: 10,
      shadowColor: 'rgba(0,0,0,0.3)'
    },
    name: `[${numericFormatter(d.binStart)} - ${numericFormatter(d.binEnd)}]`,
    ids: barDataIndexes[i]
  }));

  const series = [
    {
      data: highlightedBars,
      type: 'bar' as const,
      barWidth: '90%',
      stack: 'total',
      xAxisIndex: 0
    },
    {
      data: barData,
      type: 'bar' as const,
      barWidth: '90%',
      stack: 'total',
      xAxisIndex: 0,
      label: {
        show: false,
        position: [0, -15] as [number, number],
        formatter: function (params: CallbackDataParams): string {
          return `${params.value as number}`;
        }
      }
    }
  ];

  const option: EChartsOption = {
    xAxis: [
      {
        type: 'category',
        axisTick: {show: false},
        axisLabel: {show: false},
        axisLine: {show: false},
        position: 'bottom',
        splitLine: {
          show: true
        }
      },
      {
        scale: true,
        type: 'value',
        min: minValue,
        max: maxValue,
        interval: interval,
        axisLabel: {
          hideOverlap: true,
          rotate: 35,
          overflow: 'truncate',
          formatter: numericFormatter
        },
        splitLine: {
          show: false
        },
        position: 'bottom'
      }
    ],
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: numericFormatter
      },
      splitLine: {
        show: false
      },
      axisTick: {show: false},
      axisLine: {show: false}
    },
    series,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params: TopLevelFormatterParams | TopLevelFormatterParams[]) {
        const paramsArray = Array.isArray(params) ? params : [params];
        const range = (paramsArray[1] as {data: {name: string}}).data.name;
        const count = (paramsArray[1] as {value: number}).value;
        return `Range: ${range}<br/> # Items: ${count}`;
      }
    },
    brush: {
      toolbox: ['rect', 'keep', 'clear'],
      xAxisIndex: 0
    },
    grid: [
      {
        left: '3%',
        right: '5%',
        top: '20%',
        bottom: '0%',
        containLabel: true,
        height: 'auto'
      }
    ]
  };

  return option;
}
