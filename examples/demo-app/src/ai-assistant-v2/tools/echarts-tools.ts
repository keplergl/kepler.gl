import {tool} from './ai-tool-shim';
import {z} from 'zod';
import {layerSetIsValid} from '@kepler.gl/actions';
import {KeplerContext} from '../types';
import {getValuesFromDataset, highlightRows, getConnector, datasetNameToTableName} from './utils';
import {tableExists} from './duckdb-cache';

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
  numberOfBins?: number;
  totalValues?: number;
  histogramData: (HistogramBin & {count: number})[];
  /**
   * Row indexes per bin (`barDataIndexes[i]` are the rows in bin `i`). Used by
   * the ECharts renderer for brush-selection → map highlighting. Not meant for
   * the LLM to read.
   */
  barDataIndexes?: number[][];
  /**
   * Which data source the values came from. `'kepler'` rows line up with the
   * map so brush-selection highlights features; `'duckdb'` rows don't, so the
   * brush is inert. The renderer uses this to decide whether to wire the
   * selection callback and whether to show the inert-brush note.
   */
  source?: 'kepler' | 'duckdb';
  details?: string;
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
  details?: string;
  error?: string;
};

export type ScatterplotToolOutput = {
  success: boolean;
  datasetName: string;
  xVariableName: string;
  yVariableName: string;
  totalPoints?: number;
  correlation: number;
  xStats?: {min: number; max: number; mean: number};
  yStats?: {min: number; max: number; mean: number};
  details?: string;
  error?: string;
};

export type BubbleChartToolOutput = {
  success: boolean;
  datasetName: string;
  xVariableName?: string;
  yVariableName?: string;
  sizeVariableName?: string;
  totalPoints?: number;
  details?: string;
  error?: string;
};

export type PCPToolOutput = {
  success: boolean;
  datasetName: string;
  variables: string[];
  pcp: Array<{name: string; min: number; max: number; mean: number; std: number}>;
  totalRows?: number;
  details?: string;
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
    const std = Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / (values.length - 1));
    return {name, min, max, mean, std};
  });
}

export function getEchartsTools(ctx: KeplerContext) {
  /**
   * Resolve a single column of numeric values from a kepler dataset, falling
   * back to DuckDB when the dataset isn't loaded in kepler (e.g. a table
   * created via SQL). Two DuckDB naming conventions coexist, so both are
   * probed: the verbatim name (used by `saveToDuckdb`, which writes
   * `resultDatasetName` directly) and `datasetNameToTableName(datasetName)`
   * → `tbl_<sanitized>` (used by `ensureKeplerDatasetsMaterialized` and
   * `loadTableIntoDuckDB`). Returns the values plus the source so the
   * histogram can decide whether brush-selection maps to map rows.
   */
  const resolveValues = async (
    datasetName: string,
    variableName: string
  ): Promise<{values: number[]; source: 'kepler' | 'duckdb'}> => {
    const visState = ctx.getVisState();
    try {
      const values = getValuesFromDataset(
        visState.datasets,
        visState.layers,
        datasetName,
        variableName
      ) as number[];
      return {values, source: 'kepler'};
    } catch (keplerErr) {
      // Not found in kepler — try DuckDB under both naming conventions.
      const verbatim = datasetName;
      const sanitized = datasetNameToTableName(datasetName);
      for (const tableName of [verbatim, sanitized]) {
        if (!(await tableExists(tableName))) continue;
        try {
          const db = await getConnector();
          const quotedVar = `"${String(variableName).replace(/"/g, '""')}"`;
          const quotedTable = `"${tableName.replace(/"/g, '""')}"`;
          const result = await db.query(`SELECT ${quotedVar} AS v FROM ${quotedTable}`);
          const values = result.toArray().map((row: any) => {
            const j = typeof row.toJSON === 'function' ? row.toJSON() : row;
            return j.v;
          }) as number[];
          return {values, source: 'duckdb'};
        } catch {
          // Table exists but the column doesn't — keep probing the other name.
        }
      }
      throw new Error(
        `Could not find variable "${variableName}". It is not in kepler ` +
          `dataset "${datasetName}" (${
            keplerErr instanceof Error ? keplerErr.message : 'not found'
          }), and was not found in DuckDB tables "${verbatim}" or ` +
          `"${sanitized}". Confirm the dataset/variable name via data.query / ` +
          `SHOW TABLES rather than guessing.`
      );
    }
  };

  const getValues = async (datasetName: string, variableName: string) =>
    (await resolveValues(datasetName, variableName)).values;

  const onSelected = (datasetName: string, selectedIndices: number[]) => {
    const visState = ctx.getVisState();
    const triggerLayerReRender = (layer: any, isValid: boolean) => {
      ctx.dispatch(layerSetIsValid(layer, isValid));
    };
    highlightRows(
      visState.datasets,
      visState.layers,
      datasetName,
      selectedIndices,
      triggerLayerReRender
    );
  };

  const histogramTool = tool({
    description: 'Create a histogram to show the frequency distribution of a numeric variable.',
    inputSchema: z.object({
      datasetName: z.string().describe('The name of the dataset'),
      variableName: z.string().describe('The name of the numeric variable'),
      numberOfBins: z
        .number()
        .optional()
        .describe('Number of bins for the histogram. Default is 7.')
    }),
    execute: async ({datasetName, variableName, numberOfBins = 7}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const {values, source} = await resolveValues(datasetName, variableName);
        const {histogramData, barDataIndexes} = createHistogramBins(values, numberOfBins);
        return {
          success: true,
          datasetName,
          variableName,
          numberOfBins,
          totalValues: values.length,
          histogramData: histogramData.map((bin, i) => ({
            ...bin,
            count: barDataIndexes[i].length
          })),
          barDataIndexes,
          source,
          details: `Histogram for ${variableName} (source: ${source}): ${histogramData
            .map(
              (b, i) =>
                `[${b.binStart.toFixed(2)}-${b.binEnd.toFixed(2)}]: ${barDataIndexes[i].length}`
            )
            .join(', ')}`
        };
      } catch (error) {
        return {
          success: false,
          datasetName,
          variableName,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  });

  const boxplotTool = tool({
    description: 'Create a boxplot chart to show the distribution of numeric variables.',
    inputSchema: z.object({
      datasetName: z.string().describe('The name of the dataset'),
      variableNames: z
        .array(z.string())
        .describe('The names of the numeric variables to create boxplots for')
    }),
    execute: async ({datasetName, variableNames}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const rawData: Record<string, number[]> = {};
        for (const variableName of variableNames) {
          rawData[variableName] = await getValues(datasetName, variableName);
        }
        const {boxplots, meanPoint} = createBoxplotData(rawData, 1.5);
        return {
          success: true,
          datasetName,
          variables: variableNames,
          boxplots,
          meanPoint,
          details: `Boxplot for ${variableNames.join(', ')}: ${boxplots
            .map(b => `${b.name} (median=${b.q2.toFixed(2)}, IQR=${b.iqr.toFixed(2)})`)
            .join('; ')}`
        };
      } catch (error) {
        return {
          success: false,
          datasetName,
          variables: variableNames,
          boxplots: [],
          meanPoint: [],
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  });

  const scatterplotTool = tool({
    description:
      'Create a scatterplot to visualize the relationship between two numeric variables.',
    inputSchema: z.object({
      datasetName: z.string().describe('The name of the dataset'),
      xVariableName: z.string().describe('X-axis variable'),
      yVariableName: z.string().describe('Y-axis variable')
    }),
    execute: async ({datasetName, xVariableName, yVariableName}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const xData = await getValues(datasetName, xVariableName);
        const yData = await getValues(datasetName, yVariableName);
        const n = Math.min(xData.length, yData.length);
        let sumXY = 0,
          sumX = 0,
          sumY = 0,
          sumX2 = 0,
          sumY2 = 0;
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
          totalPoints: n,
          correlation: Math.round(correlation * 1000) / 1000,
          xStats: {min: Math.min(...xData), max: Math.max(...xData), mean: sumX / n},
          yStats: {min: Math.min(...yData), max: Math.max(...yData), mean: sumY / n},
          details: `Scatterplot for ${xVariableName} vs ${yVariableName} (${n} points, r=${(
            Math.round(correlation * 1000) / 1000
          ).toFixed(3)})`
        };
      } catch (error) {
        return {
          success: false,
          datasetName,
          xVariableName,
          yVariableName,
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
    execute: async (
      {datasetName, xVariableName, yVariableName, sizeVariableName},
      {abortSignal}
    ) => {
      try {
        abortSignal?.throwIfAborted();
        const xValues = await getValues(datasetName, xVariableName);
        const yValues = await getValues(datasetName, yVariableName);
        const sizeValues = await getValues(datasetName, sizeVariableName);
        const n = xValues.length;
        return {
          success: true,
          datasetName,
          xVariableName,
          yVariableName,
          sizeVariableName,
          totalPoints: n,
          xStats: {
            min: Math.min(...xValues),
            max: Math.max(...xValues),
            mean: xValues.reduce((a, b) => a + b, 0) / n
          },
          yStats: {
            min: Math.min(...yValues),
            max: Math.max(...yValues),
            mean: yValues.reduce((a, b) => a + b, 0) / n
          },
          sizeStats: {
            min: Math.min(...sizeValues),
            max: Math.max(...sizeValues),
            mean: sizeValues.reduce((a, b) => a + b, 0) / n
          },
          details: `Bubble chart: ${xVariableName} vs ${yVariableName} (size: ${sizeVariableName}, ${n} points)`
        };
      } catch (error) {
        return {
          success: false,
          datasetName,
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
    execute: async ({datasetName, variableNames}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const rawData: Record<string, number[]> = {};
        for (const varName of variableNames) {
          rawData[varName] = await getValues(datasetName, varName);
        }
        const pcp = computePCPData(rawData);
        return {
          success: true,
          datasetName,
          variables: variableNames,
          pcp,
          totalRows: rawData[variableNames[0]]?.length || 0,
          details: `Parallel coordinates for ${variableNames.join(', ')}: ${pcp
            .map(p => `${p.name} [${p.min.toFixed(2)}, ${p.max.toFixed(2)}]`)
            .join('; ')}`
        };
      } catch (error) {
        return {
          success: false,
          datasetName,
          variables: variableNames,
          pcp: [],
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
