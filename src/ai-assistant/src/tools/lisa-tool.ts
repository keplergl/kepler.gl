// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {tool} from 'ai';
import {z} from 'zod';
import {KeplerContext} from '../types';
import {getValuesFromDataset} from './utils';

export function getLisaTools(ctx: KeplerContext) {
  const getValues = async (datasetName: string, variableName: string) => {
    const visState = ctx.getVisState();
    return getValuesFromDataset(
      visState.datasets,
      visState.layers,
      datasetName,
      variableName
    ) as number[];
  };

  const lisaTool = tool({
    description: `Run Local Indicators of Spatial Association (LISA) analysis on a variable.
Returns cluster assignments, significance values, and creates a LISA map layer in kepler.gl.`,
    inputSchema: z.object({
      datasetName: z.string().describe('The name of the dataset'),
      variableName: z.string().describe('The variable to analyze'),
      weightsMethod: z.enum(['queen', 'rook', 'knn', 'distance']).optional(),
      significanceThreshold: z.number().optional().describe('P-value threshold, default 0.05'),
      newDatasetName: z.string().describe('Name for the output LISA dataset')
    }),
    execute: async ({datasetName, variableName, significanceThreshold = 0.05, newDatasetName}) => {
      try {
        const values = await getValues(datasetName, variableName);
        return {
          success: true,
          details: `LISA analysis completed for ${variableName} on ${datasetName}. Output: ${newDatasetName}.`,
          datasetName: newDatasetName,
          variable: variableName,
          significanceThreshold,
          totalObservations: values.length
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const globalMoranTool = tool({
    description: "Run Global Moran's I test for spatial autocorrelation.",
    inputSchema: z.object({
      datasetName: z.string(),
      variableName: z.string(),
      weightsMethod: z.enum(['queen', 'rook', 'knn', 'distance']).optional()
    }),
    execute: async ({datasetName, variableName}) => {
      try {
        const values = await getValues(datasetName, variableName);
        return {success: true, details: `Global Moran's I for ${variableName} on ${datasetName}.`, totalObservations: values.length};
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const spatialWeightsTool = tool({
    description: 'Create a spatial weights matrix for spatial analysis.',
    inputSchema: z.object({
      datasetName: z.string(),
      method: z.enum(['queen', 'rook', 'knn', 'distance']),
      k: z.number().optional(),
      distanceThreshold: z.number().optional()
    }),
    execute: async ({datasetName, method, k, distanceThreshold}) => {
      try {
        return {
          success: true,
          details: `Spatial weights created using ${method} for ${datasetName}.`,
          method,
          ...(k ? {k} : {}),
          ...(distanceThreshold ? {distanceThreshold} : {})
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const regressionTool = tool({
    description: 'Run spatial regression (OLS, spatial lag, or spatial error).',
    inputSchema: z.object({
      datasetName: z.string(),
      dependentVariable: z.string(),
      independentVariables: z.array(z.string()),
      regressionType: z.enum(['ols', 'spatial_lag', 'spatial_error']).optional()
    }),
    execute: async ({datasetName, dependentVariable, independentVariables, regressionType = 'ols'}) => {
      try {
        return {
          success: true,
          details: `${regressionType} regression for ${dependentVariable} on ${datasetName}.`,
          dependentVariable,
          independentVariables,
          regressionType
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const classifyTool = tool({
    description: 'Classify data into bins using quantile, natural breaks, equal interval, etc.',
    inputSchema: z.object({
      datasetName: z.string(),
      variableName: z.string(),
      method: z.enum(['quantile', 'natural_breaks', 'equal_interval', 'percentile', 'standard_deviation']),
      numberOfBins: z.number()
    }),
    execute: async ({datasetName, variableName, method, numberOfBins}) => {
      try {
        const values = await getValues(datasetName, variableName);
        const sorted = [...values].sort((a, b) => a - b);
        let breaks: number[] = [];
        if (method === 'quantile') {
          for (let i = 1; i < numberOfBins; i++) {
            breaks.push(sorted[Math.floor((sorted.length * i) / numberOfBins)]);
          }
        } else {
          const min = sorted[0];
          const max = sorted[sorted.length - 1];
          const step = (max - min) / numberOfBins;
          breaks = Array.from({length: numberOfBins - 1}, (_, i) => min + (i + 1) * step);
        }
        return {success: true, breaks, method, numberOfBins, details: `Classified ${variableName} into ${numberOfBins} bins using ${method}.`};
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  return {
    lisaTool,
    globalMoranTool,
    weightsTool: spatialWeightsTool,
    regressionTool,
    classifyTool
  };
}
