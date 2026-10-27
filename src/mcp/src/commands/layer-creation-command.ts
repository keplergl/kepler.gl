// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {RoomCommand} from './types';
import {z} from 'zod';
import {GEOJSON_FIELDS} from '@kepler.gl/constants';
import {LayerClasses} from '@kepler.gl/layers';
import type KeplerTable from '@kepler.gl/table';
import type {Datasets} from '@kepler.gl/table';
import {findDefaultLayer, findMapBounds} from '@kepler.gl/reducers';
import {addLayer as addLayerAction, fitBounds} from '@kepler.gl/actions';
import type {KeplerContext} from './types';

/**
 * Unique layer id. Date.now()-based ids can collide when multiple layers are
 * created within the same millisecond (rapid successive tool calls), producing
 * duplicate layer ids and unpredictable reducer behavior. Append a random
 * suffix — the same Math.random().toString(36) trick kepler's generateHashId
 * uses — so ids stay unique.
 */
function uniqueLayerId(prefix = 'layer'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function guessDefaultLayer(
  dataset: KeplerTable,
  layerType: string,
  options?: {countColumn?: string}
) {
  if (layerType === 'heatmap') {
    if (dataset.fieldPairs && dataset.fieldPairs.length > 0) {
      const props = dataset.fieldPairs.map(fieldPair => ({
        isVisible: true,
        label: 'Heatmap',
        columns: fieldPair.pair
      }));
      const layer = new LayerClasses.heatmap(props[0]);
      return layer;
    }
  } else if (layerType === 'hexagon') {
    if (dataset.fieldPairs && dataset.fieldPairs.length > 0) {
      const props = dataset.fieldPairs.map(fieldPair => ({
        isVisible: true,
        label: 'Hexbin',
        columns: fieldPair.pair
      }));
      const layer = new LayerClasses.hexagon(props[0]);
      return layer;
    }
  } else if (layerType === 'cluster') {
    if (dataset.fieldPairs && dataset.fieldPairs.length > 0) {
      const props = dataset.fieldPairs.map(fieldPair => ({
        isVisible: true,
        label: 'Cluster',
        columns: fieldPair.pair
      }));
      const layer = new LayerClasses.cluster(props[0]);
      return layer;
    }
  } else if (layerType === 'trip') {
    const layers = findDefaultLayer(dataset, [LayerClasses.trip] as any);
    const layer = layers.find(l => l.type === layerType);
    if (layer) return layer;
    throw new Error(
      `Failed to create a trip layer. Trip layer requires id, lat, lng, and timestamp columns.`
    );
  } else if (layerType === 'flow') {
    // Flow layers are never auto-detected (findDefaultLayerProps returns
    // {props: []}), so build one explicitly from the first two point lat/lng
    // field pairs — the same source/target pair logic the default arc layer
    // uses: pair[0] = origin (lat0/lng0), pair[1] = destination (lat1/lng1).
    // The count column (flow magnitude) is optional; without it every flow
    // renders at weight 1.
    const pairs = dataset.fieldPairs || [];
    if (pairs.length < 2) {
      throw new Error(
        `Failed to create a flow layer. Flow layer requires two point lat/lng pairs ` +
          `(origin + destination), e.g. origin_lat/origin_lng and dest_lat/dest_lng.`
      );
    }
    const columns: any = {
      lat0: pairs[0].pair.lat,
      lng0: pairs[0].pair.lng,
      lat1: pairs[1].pair.lat,
      lng1: pairs[1].pair.lng
    };
    if (options?.countColumn && dataset.getColumnFieldIdx(options.countColumn) >= 0) {
      columns.count = {
        value: options.countColumn,
        fieldIdx: dataset.getColumnFieldIdx(options.countColumn)
      };
    }
    // LayerClasses' computed keys (keyMirror) aren't statically named, so
    // access flow like the trip branch accesses trip: through an `as any` cast.
    const layer = new (LayerClasses as any).flow({
      isVisible: true,
      label: `${pairs[0].defaultName} -> ${pairs[1].defaultName} flow`,
      columns
    });
    return layer;
  }
  const defaultLayers = findDefaultLayer(dataset, LayerClasses as any);
  const layer = defaultLayers.find(l => l.type === layerType);
  // Return null (not a fallback to the first default layer) when the requested
  // type can't be created — silently substituting a different layer type (e.g.
  // requesting "h3" and getting a point layer) violates the command contract
  // and makes failures hard to diagnose. The caller errors clearly on null.
  return layer || null;
}

/** Column names the flow field layer resolves when the caller doesn't name them. */
const FLOW_FIELD_ALTITUDE_COLUMNS = ['altitude', 'alt', 'elevation', 'elev', 'elv', 'height', 'z'];
const FLOW_FIELD_MODES = ['UV', 'SPEED_DIR', 'ELEVATION'] as const;
type FlowFieldMode = (typeof FLOW_FIELD_MODES)[number];

type FlowFieldOptions = {
  mode?: FlowFieldMode;
  uColumn?: string;
  vColumn?: string;
  speedColumn?: string;
  directionColumn?: string;
  altitudeColumn?: string;
  colorBySpeed?: boolean;
};

/**
 * Flow Field is a vector/streamline layer: each row is a sample point carrying
 * a position plus a direction — u/v components, speed/direction, or an altitude
 * whose downhill gradient supplies the direction. Unlike the origin→destination
 * `flow` layer it needs no second point pair, and unlike `trip` it animates
 * itself, so no time filter belongs on it.
 */
function buildFlowFieldLayer(
  dataset: KeplerTable,
  position: {latitudeColumn?: string; longitudeColumn?: string},
  options: FlowFieldOptions = {}
) {
  const hasColumn = (name?: string) => !!name && dataset.getColumnFieldIdx(name) >= 0;
  const columnRef = (name: string) => {
    const fieldIdx = dataset.getColumnFieldIdx(name);
    if (fieldIdx < 0) {
      const available = dataset.fields?.map((f: any) => f.name).join(', ') ?? '';
      throw new Error(
        `Column "${name}" not found in dataset "${dataset.label}". Available columns: ${available}`
      );
    }
    return {value: name, fieldIdx};
  };

  // Position: explicit lat/lng, else the dataset's first detected point pair,
  // else a GeoJSON geometry column (one position per feature).
  let positionColumns: Record<string, any> | null = null;
  if (position.latitudeColumn && position.longitudeColumn) {
    positionColumns = {
      lat: columnRef(position.latitudeColumn),
      lng: columnRef(position.longitudeColumn)
    };
  } else {
    const pair = dataset.fieldPairs?.[0]?.pair;
    if (pair?.lat && pair?.lng) {
      positionColumns = {lat: pair.lat, lng: pair.lng};
    } else {
      const geoField = dataset.fields?.find(
        (f: any) => f.type === 'geojson' || GEOJSON_FIELDS.geojson.includes(f.name)
      );
      if (geoField) {
        positionColumns = {geojson: {value: geoField.name, fieldIdx: geoField.fieldIdx}};
      }
    }
  }
  if (!positionColumns) {
    throw new Error(
      'A flow field layer needs a position: lat/lng columns (auto-detected, or pass ' +
        'latitudeColumn/longitudeColumn) or a GeoJSON geometry column.'
    );
  }

  const altitudeName =
    options.altitudeColumn || FLOW_FIELD_ALTITUDE_COLUMNS.find(name => hasColumn(name)) || null;

  const mode: FlowFieldMode | null =
    options.mode ||
    (options.uColumn || options.vColumn || (hasColumn('u') && hasColumn('v'))
      ? 'UV'
      : options.speedColumn ||
        options.directionColumn ||
        (hasColumn('speed') && hasColumn('direction'))
      ? 'SPEED_DIR'
      : altitudeName
      ? 'ELEVATION'
      : null);
  if (!mode) {
    throw new Error(
      'A flow field layer needs a vector: u/v columns, speed/direction columns, or an ' +
        'altitude column (pass flowField.uColumn/vColumn/speedColumn/directionColumn/' +
        'altitudeColumn when the names differ).'
    );
  }

  let flowColumns: Record<string, any>;
  if (mode === 'UV') {
    flowColumns = {
      u: columnRef(options.uColumn || 'u'),
      v: columnRef(options.vColumn || 'v')
    };
  } else if (mode === 'SPEED_DIR') {
    flowColumns = {
      speed: columnRef(options.speedColumn || 'speed'),
      direction: columnRef(options.directionColumn || 'direction')
    };
  } else {
    if (!altitudeName) {
      throw new Error(
        'A flow field layer in ELEVATION mode needs an altitude column (pass flowField.altitudeColumn).'
      );
    }
    flowColumns = {altitude: columnRef(altitudeName)};
  }

  // UV and SPEED_DIR may also carry an altitude, which lifts the streamlines.
  const altitudeColumn =
    mode === 'ELEVATION' || !altitudeName ? {} : {altitude: columnRef(altitudeName)};

  const layer = new (LayerClasses as any).flowField({
    isVisible: true,
    label: 'Flow Field',
    color: [255, 255, 255],
    columnMode: mode,
    columns: {...positionColumns, ...flowColumns, ...altitudeColumn}
  });
  if (options.colorBySpeed) {
    layer.config.visConfig = {...layer.config.visConfig, colorBySpeed: true};
  }
  return layer;
}

function buildLayerConfig(
  layer: any,
  datasetId: string,
  layerName: string | undefined,
  sourceName: string,
  layerType: string
) {
  const layerId = layer.id || uniqueLayerId();
  const columns = layer.config?.columns || {};

  return {
    id: layerId,
    type: layer.type,
    config: {
      ...layer.config,
      dataId: datasetId,
      isVisible: true,
      label: layerName || `${sourceName}-${layerType}`,
      columns: Object.keys(columns).reduce<Record<string, any>>((acc, key) => {
        const column = columns[key];
        if (column) {
          acc[key] = column.value;
        }
        return acc;
      }, {}),
      visConfig: {
        ...layer.config?.visConfig
      }
    }
  };
}

function applyColorConfig(
  newLayer: any,
  dataset: KeplerTable,
  args: {
    simpleColor?: string;
    colorBy?: string;
    colorType?: 'breaks' | 'unique';
    colorMap?: Array<{value: string | number | null; color: string}>;
  }
) {
  if (args.simpleColor) {
    const color = args.simpleColor
      .replace(/[^\d,]/g, '')
      .split(',')
      .map(Number);
    if (color.length === 3) {
      newLayer.config.color = color;
    }
  }

  const {colorBy, colorType, colorMap: providedColorMap} = args;

  if (colorBy) {
    const colorField = dataset.fields.find(f => f.name === colorBy);
    if (!colorField) {
      throw new Error(`Field ${colorBy} not found.`);
    }

    // For categorical (customOrdinal) color maps, every value becomes the scale
    // domain, so it must be a real value present in the data. The agent must not
    // invent category labels — get them via geoda.analysis (analysis: 'classify',
    // method: 'unique values'). Rejecting here turns a silent wrong render into a
    // recoverable error. Only run this when colorType is explicitly 'unique':
    // an omitted colorType defaults to a continuous (breaks) scale, whose
    // colorMap values are break boundaries, not data values.
    if (colorType === 'unique' && providedColorMap) {
      // Validate without materializing the whole column: scan rows, deleting
      // matches from a small `wanted` set (early-exit when all are found),
      // while collecting a small sample of actual values for the error message.
      // Scan ALL rows — a bounded sample (prefix OR fixed-stride) can
      // systematically miss a category that exists later in the data and
      // falsely report it as "not found". The early-exit keeps the common case
      // (all categories found early) fast; only a genuinely missing category
      // costs a full scan, which is the price of an accurate error.
      const wanted = new Set(providedColorMap.map(c => c.value));
      const sample: unknown[] = [];
      const seen = new Set<unknown>();
      for (let i = 0; i < dataset.length && wanted.size > 0; i++) {
        const v = dataset.getValue(colorBy, i);
        if (wanted.has(v)) {
          wanted.delete(v);
        } else if (!seen.has(v) && sample.length < 20) {
          seen.add(v);
          sample.push(v);
        }
      }
      if (wanted.size > 0) {
        const missing = [...wanted];
        throw new Error(
          `colorMap value(s) ${missing
            .map(v => JSON.stringify(v))
            .join(', ')} not found in field "${colorBy}". ` +
            `Actual unique values: ${sample.map(v => JSON.stringify(v)).join(', ')}${
              sample.length >= 20 ? ', …' : ''
            }. ` +
            `Call geoda.analysis (analysis: 'classify', method: 'unique values') to get the real values.`
        );
      }
    }

    // colorType is optional; when omitted, default to a continuous (breaks)
    // scale so numeric fields colored via colorBy aren't mis-colored as
    // categorical. Only an explicit 'unique' selects the categorical scale.
    const colorScale = colorType === 'unique' ? 'customOrdinal' : 'custom';

    // Only force a custom palette when the caller provided an explicit
    // colorMap. A synthetic single-entry colorMap ({value: null, color:
    // '#333333'}) would route through kepler's custom colorMap scale path and
    // render everything as the no-value/unknown color; without an explicit
    // colorMap, bind the color field and let kepler.gl's default color range
    // apply.
    const colorRange = providedColorMap
      ? ({
          name: 'color.customPalette',
          type: 'custom',
          category: 'Custom',
          colors: providedColorMap.map(c => c.color),
          colorMap: providedColorMap.map(c => [c.value, c.color])
        } as const)
      : null;

    if (newLayer.type === 'heatmap') {
      if (colorRange && providedColorMap && providedColorMap.length > 1) {
        newLayer.config.visConfig['colorRange'] = {...colorRange};
      }
    } else {
      newLayer.config['colorScale'] = colorScale;
      newLayer.config['colorField'] = colorField;
      newLayer.config['strokeColorScale'] = colorScale;
      newLayer.config['strokeColorField'] = colorField;
      newLayer.config.visConfig['filled'] = true;
      if (colorRange) {
        newLayer.config.visConfig['colorRange'] = colorRange;
        newLayer.config.visConfig['strokeColorRange'] = colorRange;
      }
    }
  }
}

export const addLayerCommandId = 'map.add-layer' as const;

export function getAddLayerCommand(ctx: KeplerContext): RoomCommand {
  return {
    id: addLayerCommandId,
    name: 'Add map layer',
    group: 'Map',
    description: `Add a kepler.gl map layer from a dataset.
IMPORTANT: generated layer names must be unique.

LAYER TYPES:
- point: Point markers (requires lat/lng columns)
- flow: Origin->destination flow map (requires two point lat/lng pairs, auto-detected)
- flowField: Animated streamlines over a vector field (u/v, speed/direction, or altitude)
- h3: H3 hexagon cells (requires hexId column)
- geojson: Polygon/geometry features (uses geometry column, usually auto-detected)
- hexagon: Hexagonal binning of points
- heatmap: Heat map visualization
- cluster: Clustered point visualization
- arc/line: Arc or line connections between points
- grid: Grid binning
- trip: Animated trip (flights, deliveries, vessels)
- s2: S2 geometry cells

FLOW MAPS (layerType 'flow'):
For origin->destination flows use layerType 'flow' — a dedicated flow layer that draws
locations and weighted flows between them. It needs TWO point lat/lng pairs in the
dataset (source pair + destination pair), which are auto-detected. Prefer 'flow' over
'arc' for O-D flows; 'arc' draws straight great-circle lines without location clustering
or flow aggregation. To weight the flows by a value column (flow magnitude), pass
countColumn with the column name — omit it to render all flows at weight 1.

FLOW FIELD (layerType 'flowField'):
Animated streamlines over a vector field — wind, currents, or downhill flow. It is NOT
the origin->destination 'flow' layer: 'flow' joins two point pairs, 'flowField' draws
many short lines through a field of vectors, one row per sample point.
The direction comes from one of three column sets, auto-detected in this order:
- u/v components (default mode 'UV'), optionally with an altitude column
- speed + direction (mode 'SPEED_DIR')
- altitude only (mode 'ELEVATION'): the downhill gradient gives the direction
Position is lat/lng (auto-detected, or latitudeColumn/longitudeColumn) or a GeoJSON
geometry column. When the dataset names the columns differently, pass flowField.mode
plus flowField.uColumn/vColumn/speedColumn/directionColumn/altitudeColumn.
Set flowField.colorBySpeed true to color lines by local speed; otherwise simpleColor
applies. colorBy/colorMap do not apply to this layer. Do NOT add a time filter — the
flow field animates itself.

BASIC MAP:
- Use datasetName, latitudeColumn/longitudeColumn (for point maps), and layerType
- Omit color-related parameters for simple visualization, use simpleColor instead.

COLOR MAPPING:
- If user requests color visualization, use available columns in the dataset
- Use geoda.analysis (analysis: 'classify') to classify data into bins or unique values when needed
- For continuous data (colorType 'breaks'):
  [{value: 0, color: '#fee5d9'}, {value: 50, color: '#fcae91'}, {value: 100, color: '#fb6a4a'}, {value: null, color: '#de2d26'}]
  The last entry with value: null represents the color for the highest values
- For categorical data (colorType 'unique'):
  [{value: 'category1', color: '#1f77b4'}, {value: 'category2', color: '#ff7f0e'}]
  HARD RULE: the colorMap values MUST be the actual unique values present in the data.
  Call geoda.analysis (analysis: 'classify', method: 'unique values') first and use the
  returned uniqueValues verbatim. NEVER invent category labels from the field name —
  the command rejects values that do not exist in the data.
- If the user doesn't specify colors, omit colorBy/colorMap — kepler.gl applies its default color range automatically

For geojson datasets:
- Use geometryColumn: '_geojson' and layerType: 'geojson' even for point collections
`,
    metadata: {readOnly: false, riskLevel: 'medium', idempotent: false},
    inputSchema: z.object({
      datasetName: z
        .string()
        .describe('The name (label) or id of the dataset. Prefer the label when known.'),
      latitudeColumn: z.string().optional(),
      longitudeColumn: z.string().optional(),
      layerName: z
        .string()
        .optional()
        .describe('Generate a unique name for the layer based on the context.'),
      layerType: z.enum([
        'point',
        'flow',
        'flowField',
        'arc',
        'line',
        'grid',
        'hexagon',
        'geojson',
        'cluster',
        'heatmap',
        'h3',
        'trip',
        's2'
      ]),
      flowField: z
        .object({
          mode: z.enum(FLOW_FIELD_MODES).optional(),
          uColumn: z.string().optional(),
          vColumn: z.string().optional(),
          speedColumn: z.string().optional(),
          directionColumn: z.string().optional(),
          altitudeColumn: z.string().optional(),
          colorBySpeed: z.boolean().optional()
        })
        .optional()
        .describe(
          'For layerType "flowField" only: how the vector field is encoded. The mode is ' +
            'inferred from the columns (u/v, speed/direction, otherwise altitude); the ' +
            '*Column fields name the columns when they differ from those defaults.'
        ),
      simpleColor: z
        .string()
        .optional()
        .describe(
          'The color of the layer e.g. [255, 0, 0]. Only used for simple map visualization (no colorBy, colorType, colorMap).'
        ),
      colorBy: z.string().optional(),
      colorType: z.enum(['breaks', 'unique']).optional(),
      countColumn: z
        .string()
        .optional()
        .describe(
          'For layerType "flow" (and only flow): a numeric column whose value weights each flow (flow magnitude). Omit to render all flows at weight 1.'
        ),
      colorMap: z
        .array(
          z.object({
            value: z.union([z.string(), z.number(), z.null()]),
            color: z.string()
          })
        )
        .optional()
    }) as any,
    execute: async (_execCtx, input) => {
      const args = (input ?? {}) as {
        datasetName: string;
        layerName?: string;
        latitudeColumn?: string;
        longitudeColumn?: string;
        layerType: string;
        simpleColor?: string;
        colorBy?: string;
        colorType?: 'breaks' | 'unique';
        colorMap?: Array<{value: string | number | null; color: string}>;
        countColumn?: string;
        flowField?: FlowFieldOptions;
      };
      const {
        datasetName,
        layerName,
        latitudeColumn,
        longitudeColumn,
        layerType,
        simpleColor,
        colorBy,
        colorType,
        colorMap,
        countColumn,
        flowField
      } = args;
      try {
        // Runtime guard: the bridge/webMCP call execute without zod parsing, so
        // a missing/invalid layerType must not fall through to
        // guessDefaultLayer's first-default-layer fallback (layerType is
        // required by the command contract).
        const VALID_LAYER_TYPES = [
          'point',
          'flow',
          'flowField',
          'arc',
          'line',
          'grid',
          'hexagon',
          'geojson',
          'cluster',
          'heatmap',
          'h3',
          'trip',
          's2'
        ];
        if (!layerType || !VALID_LAYER_TYPES.includes(layerType)) {
          throw new Error(
            `Invalid layerType "${String(layerType)}". Must be one of: ${VALID_LAYER_TYPES.join(
              ', '
            )}.`
          );
        }

        const visState = ctx.getVisState();
        const datasets: Datasets = visState.datasets;

        const datasetId = Object.keys(datasets).find(
          dataId => datasets[dataId].label === datasetName || dataId === datasetName
        );
        if (!datasetId) {
          throw new Error(`Dataset ${datasetName} not found.`);
        }

        const dataset = datasets[datasetId];
        // The flow field layer resolves its own columns (position + vector, in
        // one of three modes), so it does not go through guessDefaultLayer —
        // that path only auto-detects the u/v case and would ignore explicit
        // column names.
        let layer =
          layerType === 'flowField'
            ? buildFlowFieldLayer(dataset, {latitudeColumn, longitudeColumn}, flowField)
            : guessDefaultLayer(dataset, layerType, {countColumn});

        if (!layer) {
          if (layerType === 'point' && latitudeColumn && longitudeColumn) {
            // Validate both columns exist before building the config —
            // getColumnFieldIdx returns -1 for a missing column, and an
            // invalid fieldIdx would dispatch a broken layer config (empty
            // render / confusing runtime errors).
            const latIdx = dataset.getColumnFieldIdx(latitudeColumn);
            const lngIdx = dataset.getColumnFieldIdx(longitudeColumn);
            if (latIdx < 0 || lngIdx < 0) {
              const missing = latIdx < 0 ? latitudeColumn : longitudeColumn;
              const available = dataset.fields?.map((f: any) => f.name).join(', ') ?? '';
              throw new Error(
                `Column "${missing}" not found in dataset "${datasetName}". Available columns: ${available}`
              );
            }
            layer = {
              id: uniqueLayerId(),
              type: 'point',
              config: {
                dataId: datasetId,
                label: layerName || `${datasetName}-${layerType}`,
                columns: {
                  lat: {value: latitudeColumn, fieldIdx: latIdx},
                  lng: {value: longitudeColumn, fieldIdx: lngIdx}
                },
                visConfig: {}
              }
            } as any;
          }
        }
        if (!layer) {
          throw new Error(
            `Could not create ${layerType} layer. Check that the dataset has the required columns.`
          );
        }

        const newLayer = buildLayerConfig(layer, datasetId, layerName, datasetName, layerType);
        applyColorConfig(newLayer, dataset, {simpleColor, colorBy, colorType, colorMap});

        ctx.dispatch(addLayerAction(newLayer, datasetId));

        // Center the map on the new layer's data bounds. `addDataToMap` with
        // `autoCreateLayers: false` (used by `map.load-data`) never fits bounds
        // because no layer exists at load time, and `addLayerUpdater` does not
        // center either — so fit here explicitly.
        const addedLayer = ctx.getVisState().layers.find(l => l.id === newLayer.id);
        const bounds = addedLayer ? findMapBounds([addedLayer]) : null;
        if (bounds) {
          ctx.dispatch(fitBounds(bounds));
        }

        const temporalFields = dataset.fields
          ?.filter((f: any) => f.type === 'timestamp' || f.type === 'date')
          .map((f: any) => f.name);
        const hasTemporalFields = temporalFields && temporalFields.length > 0;

        return {
          success: true,
          commandId: addLayerCommandId,
          data: {
            details: `Map layer ${newLayer.id} has been added to the map.`,
            dateTimeColumns: hasTemporalFields ? temporalFields : undefined,
            dateTimeHint: hasTemporalFields
              ? `DateTime columns detected: ${temporalFields.join(
                  ', '
                )}. You can call addTimeFilter with one of these columns to enable time-range animation on the map.`
              : undefined
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: addLayerCommandId,
          error: error instanceof Error ? error.message : 'Unknown error',
          data: {
            instruction:
              'Try to fix the error. If the error persists, ask the user to try with different parameters.'
          }
        };
      }
    }
  };
}
