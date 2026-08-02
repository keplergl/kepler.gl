import type {RoomCommand} from '@sqlrooms/room-store';
import {z} from 'zod';
import {Feature} from 'geojson';
import {createWeights, CreateWeightsProps, WeightsMeta} from '@geoda/core';
import {
  equalIntervalBreaks,
  hinge15Breaks,
  hinge30Breaks,
  naturalBreaks,
  percentileBreaks,
  quantileBreaks,
  standardDeviationBreaks
} from '@geoda/core';
import {
  localMoran,
  localGeary,
  localG,
  localGStar,
  quantileLisa,
  spatialLag,
  LocalMoranResult
} from '@geoda/lisa';
import {linearRegression, spatialLagRegression, spatialError} from '@geoda/regression';
import {SpatialGeometry} from '@geoda/core';
import {KeplerContext} from '../types';
import {getValuesFromDataset, getGeometriesFromDataset} from './utils';
import {getTableAsGeoJSON} from './duckdb-cache';

type WeightsCache = Record<
  string,
  {
    datasetId: string;
    weights: number[][];
    weightsMeta: WeightsMeta;
  }
>;

const globalWeightsCache: WeightsCache = {};

function getWeightsId(datasetId: string, weightsProps: CreateWeightsProps): string {
  const parts = ['w', datasetId, weightsProps.weightsType];

  if (weightsProps.weightsType === 'queen' || weightsProps.weightsType === 'rook') {
    parts.push(
      String(weightsProps.orderOfContiguity || 1),
      weightsProps.includeLowerOrder ? 'lower' : '',
      String(weightsProps.precisionThreshold || 0)
    );
  } else if (weightsProps.weightsType === 'knn') {
    parts.push(String(weightsProps.k));
  } else if (weightsProps.weightsType === 'threshold') {
    const distStr = weightsProps.distanceThreshold
      ? weightsProps.distanceThreshold.toFixed(1)
      : '0';
    parts.push(distStr, weightsProps.isMile ? 'mile' : 'km');
  }

  return parts.filter(Boolean).join('-');
}

function getCachedWeightsById(weightsId: string) {
  return globalWeightsCache[weightsId] || null;
}

export function getSpatialAnalysisTools(ctx: KeplerContext): Record<string, RoomCommand> {
  const getValues = async (datasetName: string, variableName: string) => {
    const visState = ctx.getVisState();
    return getValuesFromDataset(
      visState.datasets,
      visState.layers,
      datasetName,
      variableName
    ) as number[];
  };

  const getGeometries = async (datasetName: string): Promise<SpatialGeometry> => {
    const visState = ctx.getVisState();
    let geoms = getGeometriesFromDataset(
      visState.datasets,
      visState.layers,
      visState.layerData,
      datasetName
    );
    if (geoms.length === 0) {
      const geojson = await getTableAsGeoJSON(datasetName);
      if (geojson) {
        geoms = geojson.features;
      }
    }
    return geoms as Feature[];
  };

  const spatialWeights: RoomCommand = {
    id: 'geoda.spatial-weights',
    name: 'Spatial weights matrix',
    group: 'GeoDa',
    description: 'Create a spatial weights matrix for spatial analysis.',
    inputSchema: z.object({
      datasetName: z.string(),
      type: z.enum(['queen', 'rook', 'knn', 'threshold']),
      k: z.number().optional().describe('Number of neighbors for knn weights'),
      orderOfContiguity: z.number().optional(),
      includeLowerOrder: z.boolean().optional(),
      precisionThreshold: z.number().optional(),
      distanceThreshold: z
        .number()
        .optional()
        .describe('Distance threshold for threshold-based weights'),
      isMile: z.boolean().optional(),
      useCentroids: z.boolean().optional()
    }) as any,
    execute: async (_execCtx, input) => {
      const {
        datasetName,
        type,
        k,
        orderOfContiguity,
        includeLowerOrder,
        precisionThreshold,
        distanceThreshold,
        isMile,
        useCentroids
      } = (input ?? {}) as {
        datasetName: string;
        type: 'queen' | 'rook' | 'knn' | 'threshold';
        k?: number;
        orderOfContiguity?: number;
        includeLowerOrder?: boolean;
        precisionThreshold?: number;
        distanceThreshold?: number;
        isMile?: boolean;
        useCentroids?: boolean;
      };
      try {
        const geometries = await getGeometries(datasetName);
        if (!geometries || (geometries as unknown[]).length === 0) {
          throw new Error(`Dataset ${datasetName} has no geometries`);
        }

        const weightsProps: CreateWeightsProps = {
          weightsType: type,
          k,
          isQueen: type === 'queen',
          distanceThreshold,
          isMile,
          useCentroids,
          precisionThreshold,
          orderOfContiguity,
          includeLowerOrder,
          geometries
        };

        const id = getWeightsId(datasetName, weightsProps);

        let w: {weightsMeta: WeightsMeta; weights: number[][]};
        const existing = globalWeightsCache[id];
        if (existing) {
          w = {weightsMeta: existing.weightsMeta, weights: existing.weights};
        } else {
          w = await createWeights(weightsProps);
        }
        w.weightsMeta.id = id;

        globalWeightsCache[id] = {
          datasetId: datasetName,
          ...w
        };

        return {
          success: true,
          commandId: 'geoda.spatial-weights',
          data: {
            weightsId: id,
            weightsMeta: w.weightsMeta,
            details: `Weights created using ${type} for ${datasetName}. weightsId: ${id}`
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: 'geoda.spatial-weights',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  };

  const lisa: RoomCommand = {
    id: 'geoda.lisa',
    name: 'LISA cluster analysis',
    group: 'GeoDa',
    description:
      'Apply Local Indicators of Spatial Association (LISA) statistics to identify local clusters and spatial outliers.',
    inputSchema: z.object({
      datasetName: z.string(),
      variableName: z.string(),
      method: z
        .enum(['localMoran', 'localGeary', 'localG', 'localGStar', 'quantileLisa'])
        .describe('The LISA method to use'),
      weightsId: z.string().optional().describe('ID of spatial weights to use'),
      permutation: z.number().optional().describe('Number of permutations (default 999)'),
      significanceThreshold: z
        .number()
        .optional()
        .describe('Significance threshold for filtering results (default 0.05)'),
      k: z.number().optional().describe('Number of quantiles for quantile LISA'),
      quantile: z.number().optional().describe('Quantile value for quantile LISA')
    }) as any,
    execute: async (_execCtx, input) => {
      const {
        datasetName,
        variableName,
        method,
        weightsId,
        permutation = 999,
        significanceThreshold = 0.05,
        k,
        quantile
      } = (input ?? {}) as {
        datasetName: string;
        variableName: string;
        method: 'localMoran' | 'localGeary' | 'localG' | 'localGStar' | 'quantileLisa';
        weightsId?: string;
        permutation?: number;
        significanceThreshold?: number;
        k?: number;
        quantile?: number;
      };
      try {
        let weights: number[][] | null = null;
        if (weightsId) {
          const cached = getCachedWeightsById(weightsId);
          if (cached) {
            weights = cached.weights;
          }
        }

        if (!weights) {
          throw new Error(
            'Weights not found. Please create spatial weights first using the spatialWeights tool.'
          );
        }

        const values = await getValues(datasetName, variableName);

        let lm: LocalMoranResult;

        if (method === 'localMoran') {
          lm = await localMoran({
            data: values,
            neighbors: weights,
            permutation,
            significanceCutoff: significanceThreshold
          });
        } else if (method === 'localGeary') {
          lm = await localGeary({
            data: values,
            neighbors: weights,
            permutation,
            significanceCutoff: significanceThreshold
          });
        } else if (method === 'localG') {
          lm = await localG({
            data: values,
            neighbors: weights,
            permutation,
            significanceCutoff: significanceThreshold
          });
        } else if (method === 'localGStar') {
          lm = await localGStar({
            data: values,
            neighbors: weights,
            permutation,
            significanceCutoff: significanceThreshold
          });
        } else if (method === 'quantileLisa') {
          if (!k || !quantile) {
            throw new Error('k and quantile are required for quantile LISA');
          }
          lm = await quantileLisa({
            k,
            quantile,
            data: values,
            neighbors: weights,
            permutation,
            significanceCutoff: significanceThreshold
          });
        } else {
          throw new Error(`Invalid LISA method: ${method}`);
        }

        let globalMoranI: number | null = null;
        if (method === 'localMoran') {
          globalMoranI = lm.lisaValues.reduce((a, b) => a + b, 0) / lm.lisaValues.length;
        }

        const clusterColorAndLabels = lm.labels.map((label, i) => ({
          value: i,
          label,
          color: lm.colors[i],
          numberOfObservations: lm.clusters.filter(c => c === i).length
        }));

        return {
          success: true,
          commandId: 'geoda.lisa',
          data: {
            ...(globalMoranI != null ? {globalMoranI} : {}),
            datasetName,
            variableName,
            significanceThreshold,
            clusterColorAndLabels,
            totalObservations: values.length,
            details: `LISA (${method}) analysis completed for ${variableName} on ${datasetName}. ${clusterColorAndLabels
              .map(c => `${c.label}: ${c.numberOfObservations}`)
              .join(', ')}`
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: 'geoda.lisa',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  };

  const globalMoran: RoomCommand = {
    id: 'geoda.global-moran',
    name: "Global Moran's I",
    group: 'GeoDa',
    description:
      "Calculate Global Moran's I for a given variable to test for spatial autocorrelation.",
    inputSchema: z.object({
      datasetName: z.string(),
      variableName: z.string(),
      weightsId: z
        .string()
        .optional()
        .describe('ID of spatial weights. If not provided, create weights first.')
    }) as any,
    execute: async (_execCtx, input) => {
      const {datasetName, variableName, weightsId} = (input ?? {}) as {
        datasetName: string;
        variableName: string;
        weightsId?: string;
      };
      try {
        let weights: number[][] | null = null;
        if (weightsId) {
          const cached = getCachedWeightsById(weightsId);
          if (cached) {
            weights = cached.weights;
          }
        }

        if (!weights) {
          throw new Error(
            "Weights not found. Cannot calculate Global Moran's I without weights. Please create weights first."
          );
        }

        const values = await getValues(datasetName, variableName);
        const lagValues = spatialLag(values, weights);

        const n = values.length;
        const meanX = values.reduce((a, b) => a + b, 0) / n;
        let numerator = 0;
        let denomX = 0;
        for (let i = 0; i < n; i++) {
          const dx = values[i] - meanX;
          const dy = lagValues[i] - meanX;
          numerator += dx * dy;
          denomX += dx * dx;
        }
        const slope = denomX > 0 ? numerator / denomX : 0;

        return {
          success: true,
          commandId: 'geoda.global-moran',
          data: {
            globalMoranI: slope,
            details: `Global Moran's I is ${slope.toFixed(4)} for ${variableName} on ${datasetName}.`,
            datasetName,
            variableName,
            totalObservations: values.length
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: 'geoda.global-moran',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  };

  const classify: RoomCommand = {
    id: 'data.classify',
    name: 'Classify numeric variable',
    group: 'Data',
    description:
      'Classify numerical data into bins using various statistical methods (quantile, natural breaks, equal interval, etc.).',
    inputSchema: z.object({
      datasetName: z.string(),
      variableName: z.string(),
      method: z.enum([
        'quantile',
        'natural breaks',
        'equal interval',
        'percentile',
        'box',
        'standard deviation',
        'unique values'
      ]),
      k: z
        .number()
        .optional()
        .describe('Number of bins (required for quantile, natural breaks, equal interval)'),
      hinge: z.number().optional().describe('Hinge value for box method (default 1.5)')
    }) as any,
    execute: async (_execCtx, input) => {
      const {datasetName, variableName, method, k, hinge = 1.5} = (input ?? {}) as {
        datasetName: string;
        variableName: string;
        method:
          | 'quantile'
          | 'natural breaks'
          | 'equal interval'
          | 'percentile'
          | 'box'
          | 'standard deviation'
          | 'unique values';
        k?: number;
        hinge?: number;
      };
      try {
        const values = await getValues(datasetName, variableName);

        let breaks: number[] | undefined;
        let uniqueValues: unknown[] | undefined;

        switch (method) {
          case 'quantile':
            breaks = await quantileBreaks(k!, values);
            break;
          case 'natural breaks':
            breaks = await naturalBreaks(k!, values);
            break;
          case 'equal interval':
            breaks = await equalIntervalBreaks(k!, values);
            break;
          case 'percentile':
            breaks = await percentileBreaks(values);
            break;
          case 'box':
            breaks = hinge === 3.0 ? await hinge30Breaks(values) : await hinge15Breaks(values);
            break;
          case 'standard deviation':
            breaks = await standardDeviationBreaks(values);
            break;
          case 'unique values':
            uniqueValues = [...new Set(values)];
            break;
          default:
            breaks = await quantileBreaks(k!, values);
            break;
        }

        return {
          success: true,
          commandId: 'data.classify',
          data: {
            datasetName,
            variableName,
            method,
            ...(k != null ? {k} : {}),
            ...(breaks ? {breaks} : {}),
            ...(uniqueValues ? {uniqueValues} : {}),
            details: `Classified ${variableName} using ${method}${k ? ` with ${k} bins` : ''}.`
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: 'data.classify',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  };

  const regression: RoomCommand = {
    id: 'geoda.regression',
    name: 'Spatial regression',
    group: 'GeoDa',
    description: `Apply spatial regression analysis. Supports OLS (classic), spatial-lag, and spatial-error models.
Note: Run spatial diagnostics with OLS first to determine if a spatial regression model is needed.`,
    inputSchema: z.object({
      datasetName: z.string(),
      dependentVariable: z.string(),
      independentVariables: z.array(z.string()),
      modelType: z.enum(['classic', 'spatial-lag', 'spatial-error']),
      weightsId: z
        .string()
        .optional()
        .describe('ID of spatial weights (required for spatial models)')
    }) as any,
    execute: async (_execCtx, input) => {
      const {datasetName, dependentVariable, independentVariables, modelType, weightsId} = (input ?? {}) as {
        datasetName: string;
        dependentVariable: string;
        independentVariables: string[];
        modelType: 'classic' | 'spatial-lag' | 'spatial-error';
        weightsId?: string;
      };
      try {
        const yValues = await getValues(datasetName, dependentVariable);
        const xValues = await Promise.all(
          independentVariables.map(varName => getValues(datasetName, varName))
        );

        let weights: number[][] | undefined;
        if (weightsId) {
          const cached = getCachedWeightsById(weightsId);
          if (cached) {
            weights = cached.weights;
          }
        }

        if (!weights && (modelType === 'spatial-lag' || modelType === 'spatial-error')) {
          throw new Error('Weights are required for spatial-lag or spatial-error models');
        }

        let result: unknown;
        const regressionProps = {
          y: yValues,
          x: xValues,
          yName: dependentVariable,
          xNames: independentVariables,
          datasetName,
          ...(weights ? {weights, weightsId} : {})
        };

        if (modelType === 'classic') {
          result = await linearRegression(regressionProps);
        } else if (modelType === 'spatial-lag') {
          result = await spatialLagRegression(regressionProps);
        } else if (modelType === 'spatial-error') {
          result = await spatialError(regressionProps);
        }

        return {
          success: true,
          commandId: 'geoda.regression',
          data: {
            modelType,
            dependentVariable,
            independentVariables,
            result,
            details: `${modelType} regression completed for ${dependentVariable} ~ ${independentVariables.join(
              ' + '
            )} on ${datasetName}.`
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: 'geoda.regression',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  };

  return {
    'geoda.lisa': lisa,
    'geoda.global-moran': globalMoran,
    'geoda.spatial-weights': spatialWeights,
    'geoda.regression': regression,
    'data.classify': classify
  };
}