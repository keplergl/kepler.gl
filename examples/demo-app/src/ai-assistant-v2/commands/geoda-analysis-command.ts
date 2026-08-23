/**
 * The single `geoda.analysis` command consolidating ALL GeoDa operations.
 *
 * Per the migration design, every GeoDa feature (spatial weights, LISA, global
 * Moran, spatial regression, data classification, rate, standardization,
 * thiessen polygons, MST, cartogram) is exposed as ONE RoomCommand whose input
 * is a `z.discriminatedUnion('analysis', [...])` — the same pattern `executeApi`
 * uses for `apiName`. The model picks the operation via the `analysis` field:
 *
 *   executeApi({
 *     call: { apiName: "executeCommand", args: { commandId: "geoda.analysis", input: { analysis: "lisa", datasetName, variableName, method, weightsId } } },
 *     reasoning: "Run LISA on the income variable"
 *   })
 *
 * The geometry ops (area/buffer/centroid/dissolve/length/perimeter/spatial-join)
 * are intentionally NOT here — the LLM writes the DuckDB spatial SQL and runs it
 * via `geo.spatial-query` (see `geo-commands.ts`).
 *
 * The implementations below are moved verbatim from the old per-operation
 * commands (`spatial-analysis-commands.ts` and `geo-commands.ts`); no logic is
 * duplicated. The shared helpers (`getValues`, `getGeometries`, `onToolCompleted`,
 * `globalWeightsCache`/`getWeightsId`/`getCachedWeightsById`) live here.
 */

import type {RoomCommand} from '@sqlrooms/room-store';
import {z} from 'zod';
import {Feature, FeatureCollection} from 'geojson';
import {
  createWeights,
  CreateWeightsProps,
  WeightsMeta,
  equalIntervalBreaks,
  hinge15Breaks,
  hinge30Breaks,
  naturalBreaks,
  percentileBreaks,
  quantileBreaks,
  standardDeviationBreaks,
  getCartogram,
  getMinimumSpanningTree,
  getThiessenPolygons,
  deviationFromMean,
  standardizeMAD,
  rangeAdjust,
  rangeStandardize,
  standardize,
  excessRisk,
  empiricalBayes
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
import {KeplerContext} from '../types';
import {
  getValuesFromDataset,
  getGeometriesFromDataset,
  datasetNameToTableName
} from '../tools/utils';
import {saveToDuckdb, getTableAsGeoJSON} from '../tools/duckdb-cache';

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

/**
 * Discriminated-union input schema for `geoda.analysis`. Each operation carries
 * only the fields it needs; the `analysis` field selects the operation.
 */
const AnalysisInput = z.discriminatedUnion(
  'analysis',
  [
  z.object({
    analysis: z.literal('spatial-weights'),
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
  }),
  z.object({
    analysis: z.literal('lisa'),
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
  }),
  z.object({
    analysis: z.literal('global-moran'),
    datasetName: z.string(),
    variableName: z.string(),
    weightsId: z
      .string()
      .optional()
      .describe('ID of spatial weights. If not provided, create weights first.')
  }),
  z.object({
    analysis: z.literal('regression'),
    datasetName: z.string(),
    dependentVariable: z.string(),
    independentVariables: z.array(z.string()),
    modelType: z.enum(['classic', 'spatial-lag', 'spatial-error']),
    weightsId: z
      .string()
      .optional()
      .describe('ID of spatial weights (required for spatial models)')
  }),
  z.object({
    analysis: z.literal('classify'),
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
  }),
  z.object({
    analysis: z.literal('rate'),
    datasetName: z.string(),
    eventVariable: z.string(),
    baseVariable: z.string(),
    method: z
      .enum(['excessRisk', 'empiricalBayes'])
      .optional()
      .describe('Rate method (default: excessRisk)'),
    outputDatasetName: z.string()
  }),
  z.object({
    analysis: z.literal('standardize'),
    datasetName: z.string(),
    variableName: z.string(),
    method: z.enum([
      'deviationFromMean',
      'standardizeMAD',
      'rangeAdjust',
      'rangeStandardize',
      'standardize'
    ]),
    outputDatasetName: z.string()
  }),
  z.object({
    analysis: z.literal('thiessen-polygons'),
    datasetName: z.string(),
    outputDatasetName: z.string()
  }),
  z.object({
    analysis: z.literal('mst'),
    datasetName: z.string(),
    outputDatasetName: z.string()
  }),
  z.object({
    analysis: z.literal('cartogram'),
    datasetName: z.string(),
    weightVariable: z.string().describe('Property name to use as weight'),
    iterations: z
      .number()
      .optional()
      .describe('Number of iterations for cartogram optimization (default 100)'),
    outputDatasetName: z.string()
  })
  ],
  {
    // The model frequently omits the `analysis` discriminator entirely. The
    // default Zod message ("Invalid discriminator value. Expected ...") reads
    // as if the value were wrong when it is actually missing — say exactly what
    // to do instead.
    error: issue => ({
      message: `Missing or invalid required field "analysis". Must be one of: ${
        'options' in issue ? (issue.options as string[]).map(String).join(', ') : 'see the command description'
      }`
    })
  }
);

export function getGeodaAnalysisCommand(ctx: KeplerContext): RoomCommand {
  const getValues = async (datasetName: string, variableName: string) => {
    const visState = ctx.getVisState();
    return getValuesFromDataset(
      visState.datasets,
      visState.layers,
      datasetName,
      variableName
    ) as number[];
  };

  const getGeometries = async (datasetName: string): Promise<Feature[]> => {
    const visState = ctx.getVisState();
    let geoms = getGeometriesFromDataset(
      visState.datasets,
      visState.layers,
      visState.layerData,
      datasetName
    );
    if (geoms.length === 0) {
      // Tables are saved under `datasetNameToTableName(name)` → `tbl_<sanitized>`.
      const geojson = await getTableAsGeoJSON(datasetNameToTableName(datasetName));
      if (geojson) {
        geoms = geojson.features;
      }
    }
    return geoms as Feature[];
  };

  const onToolCompleted = async (toolName: string, result: any) => {
    // save to duckdb cache under the canonical `tbl_<sanitized>` name so
    // `geo.spatial-query` / `data.query` placeholders (`__tbl0__` etc.) resolve.
    await saveToDuckdb(datasetNameToTableName(toolName), result);
  };

  const runSpatialWeights = async (args: z.infer<typeof AnalysisInput>) => {
    if (args.analysis !== 'spatial-weights') throw new Error('Unexpected analysis type');
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
    } = args;
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
      weightsId: id,
      weightsMeta: w.weightsMeta,
      details: `Weights created using ${type} for ${datasetName}. weightsId: ${id}`
    };
  };

  const runLisa = async (args: z.infer<typeof AnalysisInput>) => {
    if (args.analysis !== 'lisa') throw new Error('Unexpected analysis type');
    const {
      datasetName,
      variableName,
      method,
      weightsId,
      permutation = 999,
      significanceThreshold = 0.05,
      k,
      quantile
    } = args;

    let weights: number[][] | null = null;
    if (weightsId) {
      const cached = getCachedWeightsById(weightsId);
      if (cached) {
        weights = cached.weights;
      }
    }

    if (!weights) {
      throw new Error(
        'Weights not found. Please create spatial weights first using the geoda.analysis spatial-weights operation.'
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
      ...(globalMoranI != null ? {globalMoranI} : {}),
      datasetName,
      variableName,
      significanceThreshold,
      clusterColorAndLabels,
      totalObservations: values.length,
      details: `LISA (${method}) analysis completed for ${variableName} on ${datasetName}. ${clusterColorAndLabels
        .map(c => `${c.label}: ${c.numberOfObservations}`)
        .join(', ')}`
    };
  };

  const runGlobalMoran = async (args: z.infer<typeof AnalysisInput>) => {
    if (args.analysis !== 'global-moran') throw new Error('Unexpected analysis type');
    const {datasetName, variableName, weightsId} = args;

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
      globalMoranI: slope,
      details: `Global Moran's I is ${slope.toFixed(4)} for ${variableName} on ${datasetName}.`,
      datasetName,
      variableName,
      totalObservations: values.length
    };
  };

  const runRegression = async (args: z.infer<typeof AnalysisInput>) => {
    if (args.analysis !== 'regression') throw new Error('Unexpected analysis type');
    const {datasetName, dependentVariable, independentVariables, modelType, weightsId} = args;

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
      modelType,
      dependentVariable,
      independentVariables,
      result,
      details: `${modelType} regression completed for ${dependentVariable} ~ ${independentVariables.join(
        ' + '
      )} on ${datasetName}.`
    };
  };

  const runClassify = async (args: z.infer<typeof AnalysisInput>) => {
    if (args.analysis !== 'classify') throw new Error('Unexpected analysis type');
    const {datasetName, variableName, method, k, hinge = 1.5} = args;

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
      datasetName,
      variableName,
      method,
      ...(k != null ? {k} : {}),
      ...(breaks ? {breaks} : {}),
      ...(uniqueValues ? {uniqueValues} : {}),
      details: `Classified ${variableName} using ${method}${k ? ` with ${k} bins` : ''}.`
    };
  };

  const runRate = async (args: z.infer<typeof AnalysisInput>) => {
    if (args.analysis !== 'rate') throw new Error('Unexpected analysis type');
    const {datasetName, eventVariable, baseVariable, method = 'excessRisk', outputDatasetName} =
      args;

    const eventValues = await getValues(datasetName, eventVariable);
    const baseValues = await getValues(datasetName, baseVariable);

    let rateValues: number[];
    if (method === 'empiricalBayes') {
      rateValues = empiricalBayes(baseValues, eventValues);
    } else {
      rateValues = excessRisk(baseValues, eventValues);
    }

    const outputVariableName = `${eventVariable}_${method}_rate`;
    await onToolCompleted(outputDatasetName, {
      type: 'columnData',
      content: {[outputVariableName]: rateValues}
    });

    return {
      details: `Rate (${method}) for ${eventVariable}/${baseVariable} on ${datasetName} -> ${outputDatasetName} (column: ${outputVariableName}).`,
      outputDatasetName,
      outputVariableName,
      count: rateValues.length
    };
  };

  const runStandardize = async (args: z.infer<typeof AnalysisInput>) => {
    if (args.analysis !== 'standardize') throw new Error('Unexpected analysis type');
    const {datasetName, variableName, method, outputDatasetName} = args;

    const values = await getValues(datasetName, variableName);

    let standardizedValues: number[] | undefined;
    switch (method) {
      case 'deviationFromMean':
        standardizedValues = await deviationFromMean(values);
        break;
      case 'standardizeMAD':
        standardizedValues = await standardizeMAD(values);
        break;
      case 'rangeAdjust':
        standardizedValues = await rangeAdjust(values);
        break;
      case 'rangeStandardize':
        standardizedValues = await rangeStandardize(values);
        break;
      case 'standardize':
        standardizedValues = await standardize(values);
        break;
      default:
        throw new Error(`Invalid standardization method: ${method}`);
    }

    if (!standardizedValues) {
      throw new Error(`Failed to standardize ${variableName} using ${method}`);
    }

    const outputVariableName = `${variableName}_${method}`;
    await onToolCompleted(outputDatasetName, {
      type: 'columnData',
      content: {[outputVariableName]: standardizedValues}
    });

    return {
      details: `Standardized ${variableName} using ${method} -> ${outputDatasetName} (column: ${outputVariableName}).`,
      outputDatasetName,
      outputVariableName,
      count: standardizedValues.length
    };
  };

  const runThiessenPolygons = async (args: z.infer<typeof AnalysisInput>) => {
    if (args.analysis !== 'thiessen-polygons') throw new Error('Unexpected analysis type');
    const {datasetName, outputDatasetName} = args;

    const geometries = await getGeometries(datasetName);
    if (!geometries || geometries.length === 0)
      throw new Error(`Dataset ${datasetName} is empty or not found`);

    const thiessenFeatures = await getThiessenPolygons({geoms: geometries});
    const geojson: FeatureCollection = {
      type: 'FeatureCollection',
      features: thiessenFeatures
    };
    await onToolCompleted(outputDatasetName, {type: 'geojson', content: geojson});
    return {
      details: `Thiessen polygons from ${geometries.length} features -> ${outputDatasetName}.`,
      outputDatasetName
    };
  };

  const runMst = async (args: z.infer<typeof AnalysisInput>) => {
    if (args.analysis !== 'mst') throw new Error('Unexpected analysis type');
    const {datasetName, outputDatasetName} = args;

    const geometries = await getGeometries(datasetName);
    if (!geometries || geometries.length === 0)
      throw new Error(`Dataset ${datasetName} is empty or not found`);

    const mstFeatures = await getMinimumSpanningTree({geoms: geometries});
    const geojson: FeatureCollection = {
      type: 'FeatureCollection',
      features: mstFeatures
    };
    await onToolCompleted(outputDatasetName, {type: 'geojson', content: geojson});
    return {
      details: `MST with ${mstFeatures.length} edges from ${geometries.length} features -> ${outputDatasetName}.`,
      outputDatasetName
    };
  };

  const runCartogram = async (args: z.infer<typeof AnalysisInput>) => {
    if (args.analysis !== 'cartogram') throw new Error('Unexpected analysis type');
    const {datasetName, weightVariable, iterations = 100, outputDatasetName} = args;

    const geometries = await getGeometries(datasetName);
    if (!geometries || geometries.length === 0)
      throw new Error(`Dataset ${datasetName} is empty or not found`);

    const values = await getValues(datasetName, weightVariable);
    const cartogramFeatures: Feature[] = await getCartogram(geometries, values, iterations);

    const geojson: FeatureCollection = {
      type: 'FeatureCollection',
      features: cartogramFeatures.map((feature, index) => ({
        ...feature,
        properties: {
          ...feature.properties,
          [weightVariable]: values[index]
        }
      }))
    };
    await onToolCompleted(outputDatasetName, {type: 'geojson', content: geojson});
    return {
      details: `Cartogram from ${cartogramFeatures.length} features (${weightVariable}) -> ${outputDatasetName}.`,
      outputDatasetName
    };
  };

  return {
    id: 'geoda.analysis',
    name: 'GeoDa spatial analysis',
    group: 'GeoDa',
    description:
      'Run any GeoDa spatial analysis operation: spatial-weights, lisa, global-moran, regression, classify, rate, standardize, thiessen-polygons, mst, cartogram. Pick the operation via the "analysis" field.',
    metadata: {readOnly: false, riskLevel: 'medium', idempotent: false},
    inputSchema: AnalysisInput as any,
    execute: async (_execCtx, input) => {
      const args = input as z.infer<typeof AnalysisInput>;
      try {
        let data: Record<string, unknown>;
        switch (args.analysis) {
          case 'spatial-weights':
            data = await runSpatialWeights(args);
            break;
          case 'lisa':
            data = await runLisa(args);
            break;
          case 'global-moran':
            data = await runGlobalMoran(args);
            break;
          case 'regression':
            data = await runRegression(args);
            break;
          case 'classify':
            data = await runClassify(args);
            break;
          case 'rate':
            data = await runRate(args);
            break;
          case 'standardize':
            data = await runStandardize(args);
            break;
          case 'thiessen-polygons':
            data = await runThiessenPolygons(args);
            break;
          case 'mst':
            data = await runMst(args);
            break;
          case 'cartogram':
            data = await runCartogram(args);
            break;
        }
        return {success: true, commandId: 'geoda.analysis', data};
      } catch (error) {
        return {
          success: false,
          commandId: 'geoda.analysis',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  };
}
