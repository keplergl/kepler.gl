/**
 * The single `executeApi` tool exposed to skill sub-agents.
 *
 * Replaces the previous 3-dispatcher surface (`queryDuckDB`, `kepler`, `geoda`)
 * from `skillTools.ts` with one unified tool matching the spatial-agent
 * command pattern:
 *
 *   executeApi({
 *     call: { apiName: "executeCommand", args: { commandId: "map.get-boundary", input: {} } },
 *     reasoning: "Get map viewport bbox to scope results to visible area"
 *   })
 *
 * Two apiNames:
 *  - `listCommands`    — enumerate available command ids.
 *  - `executeCommand`  — run a command by id with optional `input`.
 *
 * All 31 existing command actions are routed through the
 * `BUILTIN_COMMAND_HANDLERS` map in `handleCommands.ts`. Handlers forward to
 * the command registry — no command logic is duplicated.
 */

import {z} from 'zod';
import type {StoreApi} from '@sqlrooms/room-store';
import {tool} from '../../tools/ai-tool-shim';
import {normalizeExecuteApiInput} from './normalizeInput';
import {buildCommandHandlers, ListCommandsArgs, ExecuteCommandArgs} from './handleCommands';
import type {ApiHandler, ExecuteApiOutput} from './types';

export {normalizeExecuteApiInput} from './normalizeInput';
export type {ExecuteApiOutput} from './types';

export const EXECUTE_API_TOOL_NAME = 'executeApi' as const;

/**
 * Shared `describe()` text for the `reasoning` field. Asks for a short
 * domain-language status phrase shown in the user-facing activity log,
 * rather than a rationale that references internal machinery.
 */
const ACTIVITY_REASONING_DESCRIPTION =
  'A short, user-facing status phrase in plain domain terms describing what is happening, shown ' +
  'in the activity log (e.g. "Fetching the city boundary", "Building the map layer"). Do NOT ' +
  'mention skill names/ids, orchestration, sub-agents, or internal tooling.';

/**
 * The model's primary reference for the `executeApi` tool. Lists every
 * command id grouped by domain with a one-line input description, plus the
 * two top-level apiNames. Mirrors the spatial-agent `EXECUTE_API_GUIDANCE`
 * approach: a single dense string the model can scan to pick the right
 * command without calling `listCommands` first.
 */
export const EXECUTE_API_GUIDANCE = `Always call as: { call: { apiName: "<name>", args: { ...typed args... } }, reasoning: "<why>" }. Pass call as an object, NOT a stringified JSON. The args field is named "args" — never "apiArguments".

- listCommands: List available application commands (id, inputRequired). Call this before executeCommand when you don't know the exact command ID.

- executeCommand: Execute an application command by id. Args: commandId and optional input matching the command's input schema.
  Well-known commands (call directly without listCommands):

  MAP commands (mutate the kepler.gl map):
  - "map.set-basemap": Change the basemap style. input: { styleType }. Valid styleType: "no_map", "dark-matter", "positron", "voyager", "satellite", "dark", "light", "muted", "muted_night".
  - "map.add-layer": Add a new map layer from a dataset. input: { datasetName, layerType, latitudeColumn?, longitudeColumn?, layerName?, simpleColor?, colorBy?, colorType?, colorMap? }. layerType: point|arc|line|grid|hexagon|geojson|cluster|heatmap|h3|trip|s2. For geojson datasets use geometryColumn "_geojson". Call this after map.load-data / map.save-data / map.create-table / data.filter / data.load-to-map to create a layer — those commands do NOT auto-create layers.
  - "map.update-layer-color": Update an existing layer's color palette. input: { layerId, numberOfColors, customColors }. customColors is an array of hex color strings; numberOfColors must equal its length.
  - "map.load-data": Load a dataset from a URL into kepler.gl. Does NOT create a layer — call map.add-layer to visualize. input: { url }.
  - "map.get-boundary": Get the current map viewport bounding box. input: {} (empty). Returns { boundary: { nw: [lon, lat], se: [lon, lat] } }.
  - "map.save-data": Save a DuckDB table as a kepler.gl map dataset. Does NOT create a layer — call map.add-layer to visualize. input: { datasetNames: string[] }.
  - "map.create-table": Create a new kepler.gl dataset via SQL. Does NOT create a layer — call map.add-layer to visualize. input: { datasetName, variableNames, sql, resultDatasetName }. Use __TABLE__ as the table-name placeholder in sql.
  - "map.add-time-filter": Animate a NON-trip layer over a TIMESTAMP/DATE column. input: { datasetName, dateTimeColumn, interval? }. interval: 1-second|1-minute|1-hour|1-day|1-week|1-month|3-month|1-year (auto-detected when omitted). DO NOT use for trip layers (they have built-in animation). Returns { filterIndex, interval }.
  - "map.toggle-time-filter": Show/hide the enlarged time controller at the bottom of the map. input: { action: "show"|"hide", filterIndex? }. A time filter must already exist (create via map.add-time-filter).
  - "map.split-view": Enable/disable dual-map comparison. input: { action: "enable"|"disable", layerIdsForMap0?, layerIdsForMap1? }. Provide layer-id arrays to assign layers per panel; without them all layers show on both panels.
  - "map.get-dataset-context": Get all loaded datasets with their fields and layer configurations. input: {} (empty). Returns { datasets: [{datasetName, datasetId, fields, layers}] }.

  DATA commands (DuckDB SQL):
  - "data.query": Execute a generic SELECT SQL query and save the result. input: { datasetName, variableNames, sql, resultDatasetName }. Use __TABLE__ as the table-name placeholder. Returns a truncated preview + totalRows.
  - "data.filter": Filter a dataset via SQL and add the result to kepler.gl. Does NOT create a layer — call map.add-layer to visualize. input: { datasetName, variableNames, sql, resultDatasetName }. Use __TABLE__ as the placeholder.
  - "data.create-table": Create a new table via SQL (add/rename/change columns). input: { datasetName, variableNames, sql, resultDatasetName }. Use __TABLE__ as the placeholder.
  - "data.merge-tables": Merge two tables via SQL (JOIN or UNION). input: { datasetNameA, datasetNameB, sql }. Use __TABLE_A__ and __TABLE_B__ as placeholders.
  - "data.load-to-map": Load a saved DuckDB table onto the kepler.gl map. Does NOT create a layer — call map.add-layer to visualize. input: { datasetName }.
  GEODA commands (spatial analysis) — all via the single "geoda.analysis" command; pick the operation with the "analysis" field:
  - "geoda.analysis" (analysis: "spatial-weights"): Create a spatial weights matrix. input: { datasetName, type, k?, orderOfContiguity?, includeLowerOrder?, precisionThreshold?, distanceThreshold?, isMile?, useCentroids? }. type: queen|rook|knn|threshold. Returns { weightsId }.
  - "geoda.analysis" (analysis: "lisa"): LISA (Local Moran/Geary/G/GStar/quantileLisa) cluster analysis. input: { datasetName, variableName, method, weightsId?, permutation?, significanceThreshold?, k?, quantile? }. Create weights first via the spatial-weights operation.
  - "geoda.analysis" (analysis: "global-moran"): Global Moran's I for spatial autocorrelation. input: { datasetName, variableName, weightsId? }.
  - "geoda.analysis" (analysis: "regression"): Spatial regression (classic / spatial-lag / spatial-error). input: { datasetName, dependentVariable, independentVariables, modelType, weightsId? }. modelType: classic|spatial-lag|spatial-error.
  - "geoda.analysis" (analysis: "classify"): Classify a numeric variable into bins. input: { datasetName, variableName, method, k?, hinge? }. method: quantile|natural breaks|equal interval|percentile|box|standard deviation|unique values. Returns { breaks? } or { uniqueValues? }.
  - "geoda.analysis" (analysis: "rate"): Rate calculation (excess risk / empirical Bayes). input: { datasetName, eventVariable, baseVariable, method?, outputDatasetName }.
  - "geoda.analysis" (analysis: "standardize"): Standardize a variable. input: { datasetName, variableName, method, outputDatasetName }. method: deviationFromMean|standardizeMAD|rangeAdjust|rangeStandardize|standardize.
  - "geoda.analysis" (analysis: "thiessen-polygons"): Voronoi polygons from geometries (GeoDa). input: { datasetName, outputDatasetName }.
  - "geoda.analysis" (analysis: "mst"): Minimum spanning tree from geometries (GeoDa). input: { datasetName, outputDatasetName }.
  - "geoda.analysis" (analysis: "cartogram"): Dorling cartogram from polygons + weight variable (GeoDa). input: { datasetName, weightVariable, iterations?, outputDatasetName }.

  GEO commands (geo tools):
  - "geo.routing": Mapbox routing directions between two points. input: { origin: {longitude, latitude}, destination: {longitude, latitude}, mode?, datasetName }.
  - "geo.isochrone": Mapbox isochrone polygons from a point. input: { origin: {longitude, latitude}, timeLimit?, distanceLimit?, profile?, datasetName }.
  - "geo.geocode": Geocode an address to lat/lng. input: { address, datasetName }.
  - "geo.spatial-query": DuckDB spatial SQL (ST_* functions). input: { datasetNames: string[], outputDatasetName, sqlQuery, reasoning }. Use __tbl0__, __tbl1__, ... as table placeholders. The geometry column stores GeoJSON strings — wrap with ST_GeomFromGeoJSON(geometry). IMPORTANT: in DuckDB the geometry column is ALWAYS named "geometry" (never "_geojson" — that is the kepler.gl map-side name). The result includes each input table's real column names in "tableSchemas" — read them before writing your SQL. ALSO covers geometry operations (area/length/perimeter/buffer/centroid/dissolve/spatial-join) — write the SQL yourself (e.g. ST_Area_Spheroid, ST_Length_Spheroid, ST_Perimeter_Spheroid, ST_Centroid, ST_Union_Agg, ST_Intersects; buffer via ST_Transform to EPSG:3857, ST_Buffer, transform back). Returns a firstFiveRows preview of the result properties so you can read scalar values. After saving, call data.load-to-map to visualize the result.
  - "geo.grid": Rectangular grid of polygons over a dataset's bbox (Turf). input: { datasetName, rows, columns, outputDatasetName }.
  - "geo.roads": Fetch road networks from OpenStreetMap (Overpass API). input: { datasetName?, mapBounds?, outputDatasetName? }. Bounds resolve from datasetName (its bbox), else mapBounds, else the current map viewport.
  - "geo.us-boundary": Fetch US state/county/zipcode boundaries. input: { type: state|county|zipcode, ids: string[], outputDatasetName? }. ids: lowercase state names, 5-digit county FIPS codes, or 5-digit zipcodes (enumerate zipcodes from your own knowledge).

  CHART commands (analytical charts & summary statistics):
  - "chart.histogram": Frequency distribution of one numeric variable. DRAWS a chart inline. input: { datasetName, variableName, numberOfBins? }. Default bins: 7. Returns bin counts + details string.
  - "chart.boxplot": Quartile/mean/std/IQR stats for several variables. Numbers only, NO chart. input: { datasetName, variableNames: string[] }.
  - "chart.scatterplot": Correlation + min/max/mean for two variables. Numbers only, NO chart. input: { datasetName, xVariableName, yVariableName }.
  - "chart.bubble": x/y/size stats for three variables. Numbers only, NO chart. input: { datasetName, xVariableName, yVariableName, sizeVariableName }.
  - "chart.pcp": min/max/mean/std per variable, many at once. Numbers only, NO chart. input: { datasetName, variableNames: string[] }.
  Only "chart.histogram" draws a chart; the other four return numbers only — restate the statistics in your reply and do NOT claim a chart was drawn.

  Reference geography: US state/county/zipcode boundaries are fetched via geo.us-boundary (public GitHub datasets); road networks via geo.roads (OpenStreetMap Overpass). Building footprints and POIs are NOT fetched by a built-in command — the user loads such data into kepler.gl via map.load-data (a URL) or by importing files directly. If a task needs data the user has not provided, ask the user to load it first.`;

/**
 * Build the `executeApi` tool parameterized by the room-store. The command
 * handlers are constructed once per call; they delegate `executeCommand` /
 * `listCommands` to `store.commands` (the registry populated in `store.ts`).
 */
export function createExecuteApiTool(store: StoreApi<any>) {
  const {listCommandsHandler, executeCommandHandler} = buildCommandHandlers(store);

  const HANDLERS: Record<string, ApiHandler> = {
    listCommands: listCommandsHandler,
    executeCommand: executeCommandHandler
  };

  const ExecuteApiCall = z.discriminatedUnion('apiName', [
    z.object({apiName: z.literal('listCommands'), args: ListCommandsArgs}),
    z.object({apiName: z.literal('executeCommand'), args: ExecuteCommandArgs})
  ]);

  return tool({
    description: EXECUTE_API_GUIDANCE,
    inputSchema: z.preprocess(
      normalizeExecuteApiInput,
      z.object({
        call: ExecuteApiCall,
        reasoning: z.string().describe(ACTIVITY_REASONING_DESCRIPTION).optional().default('')
      })
    ),
    execute: async ({call}, options): Promise<ExecuteApiOutput> => {
      const apiCtx = {
        args: call.args,
        abortSignal: options?.abortSignal
      };

      try {
        const result = await HANDLERS[call.apiName].run(apiCtx);
        return {...result, apiName: call.apiName};
      } catch (error) {
        return {
          success: false,
          apiName: call.apiName,
          error: `API ${call.apiName} failed: ${
            error instanceof Error ? error.message : String(error)
          }`
        };
      }
    },
    toModelOutput: ({output}: {output: ExecuteApiOutput}) => {
      const modelResult: Record<string, unknown> = {
        success: output.success
      };
      if (output.apiName != null) modelResult.apiName = output.apiName;
      if (output.details != null) modelResult.details = output.details;
      if (output.nextStep != null) modelResult.nextStep = output.nextStep;
      if (output.instruction != null) modelResult.instruction = output.instruction;
      if (output.error != null) modelResult.error = output.error;
      // Surface the data-bearing fields the model is documented to consume.
      // Without these, multi-step flows break: e.g. geoda.analysis classify's `breaks`
      // can't be passed to map.add-layer's colorMap, and map.get-boundary's
      // `boundary` can't scope a subsequent spatial query.
      if (output.boundary != null) modelResult.boundary = output.boundary;
      if (output.breaks != null) modelResult.breaks = output.breaks;
      if (output.uniqueValues != null) modelResult.uniqueValues = output.uniqueValues;
      if (output.weightsId != null) modelResult.weightsId = output.weightsId;
      if (output.weightsMeta != null) modelResult.weightsMeta = output.weightsMeta;
      if (output.globalMoranI != null) modelResult.globalMoranI = output.globalMoranI;
      if (output.clusterColorAndLabels != null)
        modelResult.clusterColorAndLabels = output.clusterColorAndLabels;
      if (output.totalObservations != null)
        modelResult.totalObservations = output.totalObservations;
      if (output.result != null) modelResult.result = output.result;
      if (output.datasetName != null) modelResult.datasetName = output.datasetName;
      if (output.resultDatasetName != null)
        modelResult.resultDatasetName = output.resultDatasetName;
      if (output.truncatedQueryResult != null)
        modelResult.truncatedQueryResult = output.truncatedQueryResult;
      if (output.totalRows != null) modelResult.totalRows = output.totalRows;
      if (output.firstFiveRows != null) modelResult.firstFiveRows = output.firstFiveRows;
      if (output.firstTwoRows != null) modelResult.firstTwoRows = output.firstTwoRows;
      if (output.savedDatasetNames != null)
        modelResult.savedDatasetNames = output.savedDatasetNames;
      if (output.outputDatasetName != null)
        modelResult.outputDatasetName = output.outputDatasetName;
      if (output.outputVariableName != null)
        modelResult.outputVariableName = output.outputVariableName;
      if (output.tableSchemas != null) modelResult.tableSchemas = output.tableSchemas;
      if (output.dateTimeColumns != null) modelResult.dateTimeColumns = output.dateTimeColumns;
      if (output.dateTimeHint != null) modelResult.dateTimeHint = output.dateTimeHint;
      if (output.datasets != null) modelResult.datasets = output.datasets;
      if (output.integerTemporalColumns != null)
        modelResult.integerTemporalColumns = output.integerTemporalColumns;
      if (output.integerTemporalHint != null)
        modelResult.integerTemporalHint = output.integerTemporalHint;
      // Chart command outputs. `barDataIndexes`, `histogramData` (raw bins),
      // `source`, `meanPoint` are renderer-only and intentionally NOT surfaced
      // — the `details` string already carries the human/model-facing summary.
      if (output.commandId != null) modelResult.commandId = output.commandId;
      if (output.variableNames != null) modelResult.variableNames = output.variableNames;
      if (output.xVariableName != null) modelResult.xVariableName = output.xVariableName;
      if (output.yVariableName != null) modelResult.yVariableName = output.yVariableName;
      if (output.sizeVariableName != null) modelResult.sizeVariableName = output.sizeVariableName;
      if (output.numberOfBins != null) modelResult.numberOfBins = output.numberOfBins;
      if (output.totalValues != null) modelResult.totalValues = output.totalValues;
      if (output.boxplots != null) modelResult.boxplots = output.boxplots;
      if (output.correlation != null) modelResult.correlation = output.correlation;
      if (output.xStats != null) modelResult.xStats = output.xStats;
      if (output.yStats != null) modelResult.yStats = output.yStats;
      if (output.sizeStats != null) modelResult.sizeStats = output.sizeStats;
      if (output.pcp != null) modelResult.pcp = output.pcp;
      if (output.totalPoints != null) modelResult.totalPoints = output.totalPoints;
      return {
        type: 'text' as const,
        value: JSON.stringify(modelResult)
      };
    }
  });
}
