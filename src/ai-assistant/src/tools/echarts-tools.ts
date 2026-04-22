// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {tool} from 'ai';
import {z} from 'zod';
import {layerSetIsValid} from '@kepler.gl/actions';
import {KeplerContext} from '../types';
import {getValuesFromDataset, highlightRows} from './utils';

/**
 * Histogram bin data used by the renderer.
 */
export type HistogramBin = {
  bin: number;
  binStart: number;
  binEnd: number;
};

export type HistogramToolOutput = {
  success: boolean;
  datasetName: string;
  variableName: string;
  histogramData: HistogramBin[];
  barDataIndexes: number[][];
  error?: string;
};

export type BoxplotStats = {
  name: string;
  low: number;
  q1: number;
  q2: number;
  q3: number;
  high: number;
  mean: number;
  std: number;
  iqr: number;
};

export type BoxplotToolOutput = {
  success: boolean;
  datasetName: string;
  variables: string[];
  boxplots: BoxplotStats[];
  meanPoint: [string, number][];
  rawData: Record<string, number[]>;
  error?: string;
};

export type ScatterplotToolOutput = {
  success: boolean;
  datasetName: string;
  xVariableName: string;
  yVariableName: string;
  xData: number[];
  yData: number[];
  correlation: number;
  error?: string;
};

export type BubbleChartToolOutput = {
  success: boolean;
  datasetName: string;
  data: {
    variableX: {name: string; values: number[]};
    variableY: {name: string; values: number[]};
    variableSize: {name: string; values: number[]};
  };
  error?: string;
};

export type PCPToolOutput = {
  success: boolean;
  datasetName: string;
  variables: string[];
  pcp: Array<{name: string; min: number; max: number; mean: number; std: number}>;
  rawData: Record<string, number[]>;
  error?: string;
};

function createHistogramBins(
  values: number[],
  numberOfBins: number
): {histogramData: HistogramBin[]; barDataIndexes: number[][]} {
  if (!values.length) {
    return {histogramData: [], barDataIndexes: []};
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binWidth = (max - min) / numberOfBins;
  const histogramData: HistogramBin[] = [];
  const barDataIndexes: number[][] = Array.from({length: numberOfBins}, () => []);

  for (let i = 0; i < numberOfBins; i++) {
    histogramData.push({
      bin: i,
      binStart: min + i * binWidth,
      binEnd: min + (i + 1) * binWidth
    });
  }

  values.forEach((value, index) => {
    if (value === max) {
      barDataIndexes[numberOfBins - 1].push(index);
      return;
    }
    const binIndex = Math.floor((value - min) / binWidth);
    barDataIndexes[binIndex].push(index);
  });

  return {histogramData, barDataIndexes};
}

function createBoxplotData(
  data: Record<string, number[]>,
  boundIQR: number
): {boxplots: BoxplotStats[]; meanPoint: [string, number][]} {
  const meanPoint: [string, number][] = [];
  const boxplots: BoxplotStats[] = Object.keys(data).map(key => {
    const sorted = [...data[key]].sort((a, b) => a - b);
    const n = sorted.length;
    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];
    const iqr = q3 - q1;
    const low = q1 - boundIQR * iqr;
    const high = q3 + boundIQR * iqr;
    const q2 = sorted[Math.floor(n * 0.5)];
    const mean = sorted.reduce((s, v) => s + v, 0) / n;
    const std = Math.sqrt(sorted.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1));
    meanPoint.push([key, mean]);
    return {name: key, low, q1, q2, q3, high, mean, std, iqr};
  });
  return {boxplots, meanPoint};
}

function computePCPData(rawData: Record<string, number[]>) {
  return Object.entries(rawData).map(([name, values]) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    const std = Math.sqrt(
      values.reduce((s, v) => s + (v - mean) ** 2, 0) / (values.length - 1)
    );
    return {name, min, max, mean, std};
  });
}

export function getEchartsTools(ctx: KeplerContext) {
  const getValues = async (datasetName: string, variableName: string) => {
    const visState = ctx.getVisState();
    return getValuesFromDataset(
      visState.datasets,
      visState.layers,
      datasetName,
      variableName
    ) as number[];
  };

  const onSelected = (datasetName: string, selectedIndices: number[]) => {
    const visState = ctx.getVisState();
    const triggerLayerReRender = (layer: any, isValid: boolean) => {
      ctx.dispatch(layerSetIsValid(layer, isValid));
    };
    highlightRows(visState.datasets, visState.layers, datasetName, selectedIndices, triggerLayerReRender);
  };

  const histogramTool = tool({
    description: 'Create a histogram to show the frequency distribution of a numeric variable.',
    inputSchema: z.object({
      datasetName: z.string().describe('The name of the dataset'),
      variableName: z.string().describe('The name of the numeric variable'),
      numberOfBins: z.number().optional().describe('Number of bins for the histogram. Default is 7.')
    }),
    execute: async ({datasetName, variableName, numberOfBins = 7}): Promise<HistogramToolOutput> => {
      try {
        const values = await getValues(datasetName, variableName);
        const {histogramData, barDataIndexes} = createHistogramBins(values, numberOfBins);
        return {
          success: true,
          datasetName,
          variableName,
          histogramData,
          barDataIndexes
        };
      } catch (error) {
        return {
          success: false,
          datasetName,
          variableName,
          histogramData: [],
          barDataIndexes: [],
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  });

  const boxplotTool = tool({
    description:
      'Create a boxplot chart to show the distribution of numeric variables.',
    inputSchema: z.object({
      datasetName: z.string().describe('The name of the dataset'),
      variableNames: z
        .array(z.string())
        .describe('The names of the numeric variables to create boxplots for')
    }),
    execute: async ({datasetName, variableNames}): Promise<BoxplotToolOutput> => {
      try {
        const rawData: Record<string, number[]> = {};
        for (const variableName of variableNames) {
          rawData[variableName] = await getValues(datasetName, variableName);
        }
        const {boxplots, meanPoint} = createBoxplotData(rawData, 1.5);
        return {success: true, datasetName, variables: variableNames, boxplots, meanPoint, rawData};
      } catch (error) {
        return {
          success: false,
          datasetName,
          variables: variableNames,
          boxplots: [],
          meanPoint: [],
          rawData: {},
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  });

  const scatterplotTool = tool({
    description: 'Create a scatterplot to visualize the relationship between two numeric variables.',
    inputSchema: z.object({
      datasetName: z.string().describe('The name of the dataset'),
      xVariableName: z.string().describe('X-axis variable'),
      yVariableName: z.string().describe('Y-axis variable')
    }),
    execute: async ({datasetName, xVariableName, yVariableName}): Promise<ScatterplotToolOutput> => {
      try {
        const xData = await getValues(datasetName, xVariableName);
        const yData = await getValues(datasetName, yVariableName);
        const n = Math.min(xData.length, yData.length);
        let sumXY = 0, sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0;
        for (let i = 0; i < n; i++) {
          sumX += xData[i];
          sumY += yData[i];
          sumXY += xData[i] * yData[i];
          sumX2 += xData[i] * xData[i];
          sumY2 += yData[i] * yData[i];
        }
        const correlation =
          (n * sumXY - sumX * sumY) /
          Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        return {
          success: true,
          datasetName,
          xVariableName,
          yVariableName,
          xData,
          yData,
          correlation: Math.round(correlation * 1000) / 1000
        };
      } catch (error) {
        return {
          success: false,
          datasetName,
          xVariableName,
          yVariableName,
          xData: [],
          yData: [],
          correlation: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  });

  const bubbleChartTool = tool({
    description: 'Create a bubble chart to visualize three numeric variables (x, y, and size).',
    inputSchema: z.object({
      datasetName: z.string().describe('The name of the dataset'),
      xVariableName: z.string().describe('X-axis variable'),
      yVariableName: z.string().describe('Y-axis variable'),
      sizeVariableName: z.string().describe('Variable for bubble size')
    }),
    execute: async ({datasetName, xVariableName, yVariableName, sizeVariableName}): Promise<BubbleChartToolOutput> => {
      try {
        const xValues = await getValues(datasetName, xVariableName);
        const yValues = await getValues(datasetName, yVariableName);
        const sizeValues = await getValues(datasetName, sizeVariableName);
        return {
          success: true,
          datasetName,
          data: {
            variableX: {name: xVariableName, values: xValues},
            variableY: {name: yVariableName, values: yValues},
            variableSize: {name: sizeVariableName, values: sizeValues}
          }
        };
      } catch (error) {
        return {
          success: false,
          datasetName,
          data: {
            variableX: {name: xVariableName, values: []},
            variableY: {name: yVariableName, values: []},
            variableSize: {name: sizeVariableName, values: []}
          },
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  });

  const pcpTool = tool({
    description: 'Create a parallel coordinates plot to visualize multiple numeric variables.',
    inputSchema: z.object({
      datasetName: z.string().describe('The name of the dataset'),
      variableNames: z.array(z.string()).describe('The names of the numeric variables to display')
    }),
    execute: async ({datasetName, variableNames}): Promise<PCPToolOutput> => {
      try {
        const rawData: Record<string, number[]> = {};
        for (const varName of variableNames) {
          rawData[varName] = await getValues(datasetName, varName);
        }
        const pcp = computePCPData(rawData);
        return {success: true, datasetName, variables: variableNames, pcp, rawData};
      } catch (error) {
        return {
          success: false,
          datasetName,
          variables: variableNames,
          pcp: [],
          rawData: {},
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  });

  return {
    boxplotTool,
    histogramTool,
    scatterplotTool,
    bubbleChartTool,
    pcpTool
  };
}
