// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {tool} from 'ai';
import {z} from 'zod';
import {layerSetIsValid} from '@kepler.gl/actions';
import {KeplerContext} from '../types';
import {getValuesFromDataset, highlightRows} from './utils';

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

  const boxplotTool = tool({
    description:
      'Create a boxplot chart to show the distribution of numeric variables.',
    inputSchema: z.object({
      datasetName: z.string().describe('The name of the dataset'),
      variableNames: z
        .array(z.string())
        .describe('The names of the numeric variables to create boxplots for')
    }),
    execute: async ({datasetName, variableNames}) => {
      try {
        const allStats: Record<string, any> = {};
        for (const variableName of variableNames) {
          const values = await getValues(datasetName, variableName);
          const sorted = [...values].sort((a, b) => a - b);
          const n = sorted.length;
          allStats[variableName] = {
            min: sorted[0],
            q1: sorted[Math.floor(n * 0.25)],
            median: sorted[Math.floor(n * 0.5)],
            q3: sorted[Math.floor(n * 0.75)],
            max: sorted[n - 1],
            count: n
          };
        }
        return {success: true, statistics: allStats};
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const histogramTool = tool({
    description: 'Create a histogram to show the frequency distribution of a numeric variable.',
    inputSchema: z.object({
      datasetName: z.string().describe('The name of the dataset'),
      variableName: z.string().describe('The name of the numeric variable'),
      numberOfBins: z.number().optional().describe('Number of bins for the histogram')
    }),
    execute: async ({datasetName, variableName, numberOfBins = 10}) => {
      try {
        const values = await getValues(datasetName, variableName);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const binWidth = (max - min) / numberOfBins;
        const bins = Array.from({length: numberOfBins}, (_, i) => ({
          binStart: min + i * binWidth,
          binEnd: min + (i + 1) * binWidth,
          count: 0
        }));
        for (const v of values) {
          const binIndex = Math.min(Math.floor((v - min) / binWidth), numberOfBins - 1);
          bins[binIndex].count++;
        }
        return {success: true, bins, totalCount: values.length, min, max};
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
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
    execute: async ({datasetName, xVariableName, yVariableName}) => {
      try {
        const xValues = await getValues(datasetName, xVariableName);
        const yValues = await getValues(datasetName, yVariableName);
        const n = Math.min(xValues.length, yValues.length);
        let sumXY = 0, sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0;
        for (let i = 0; i < n; i++) {
          sumX += xValues[i];
          sumY += yValues[i];
          sumXY += xValues[i] * yValues[i];
          sumX2 += xValues[i] * xValues[i];
          sumY2 += yValues[i] * yValues[i];
        }
        const correlation =
          (n * sumXY - sumX * sumY) /
          Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        return {
          success: true,
          count: n,
          correlation: Math.round(correlation * 1000) / 1000,
          xRange: [Math.min(...xValues), Math.max(...xValues)],
          yRange: [Math.min(...yValues), Math.max(...yValues)]
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
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
    execute: async ({datasetName, xVariableName, yVariableName, sizeVariableName}) => {
      try {
        const xValues = await getValues(datasetName, xVariableName);
        const yValues = await getValues(datasetName, yVariableName);
        const sizeValues = await getValues(datasetName, sizeVariableName);
        return {
          success: true,
          count: xValues.length,
          xRange: [Math.min(...xValues), Math.max(...xValues)],
          yRange: [Math.min(...yValues), Math.max(...yValues)],
          sizeRange: [Math.min(...sizeValues), Math.max(...sizeValues)]
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const pcpTool = tool({
    description: 'Create a parallel coordinates plot to visualize multiple numeric variables.',
    inputSchema: z.object({
      datasetName: z.string().describe('The name of the dataset'),
      variableNames: z.array(z.string()).describe('The names of the numeric variables to display')
    }),
    execute: async ({datasetName, variableNames}) => {
      try {
        const ranges: Record<string, {min: number; max: number}> = {};
        for (const varName of variableNames) {
          const values = await getValues(datasetName, varName);
          ranges[varName] = {min: Math.min(...values), max: Math.max(...values)};
        }
        return {success: true, variableRanges: ranges};
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
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
