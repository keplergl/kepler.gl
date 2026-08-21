import type {RoomCommand} from '@sqlrooms/room-store';
import {z} from 'zod';
import {LayerClasses} from '@kepler.gl/layers';
import KeplerTable, {Datasets} from '@kepler.gl/table';
import {findDefaultLayer, findMapBounds} from '@kepler.gl/reducers';
import {addLayer as addLayerAction, fitBounds} from '@kepler.gl/actions';
import {KeplerContext} from '../../types';

export function guessDefaultLayer(dataset: KeplerTable, layerType: string) {
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
  }
  const defaultLayers = findDefaultLayer(dataset, LayerClasses as any);
  const layer = defaultLayers.find(l => l.type === layerType);
  return layer || (defaultLayers.length > 0 ? defaultLayers[0] : null);
}

function buildLayerConfig(
  layer: any,
  datasetId: string,
  layerName: string | undefined,
  sourceName: string,
  layerType: string
) {
  const layerId = layer.id || `layer_${Date.now()}`;
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

  const {colorBy, colorType, colorMap = [{value: null, color: '#333333'}]} = args;

  if (colorBy) {
    const colorField = dataset.fields.find(f => f.name === colorBy);
    if (!colorField) {
      throw new Error(`Field ${colorBy} not found.`);
    }
    const colorScale = colorType === 'breaks' ? 'custom' : 'customOrdinal';
    const colors = colorMap.map(c => c.color);
    const keplerColorMap = colorMap.map(c => [c.value, c.color]);
    const colorRange = {
      name: 'color.customPalette',
      type: 'custom',
      category: 'Custom',
      colors,
      colorMap: keplerColorMap
    } as const;

    if (newLayer.type === 'heatmap') {
      if (colors.length > 1) {
        newLayer.config.visConfig['colorRange'] = {...colorRange};
      }
    } else {
      newLayer.config['colorScale'] = colorScale;
      newLayer.config['colorField'] = colorField;
      newLayer.config['strokeColorScale'] = colorScale;
      newLayer.config['strokeColorField'] = colorField;
      newLayer.config.visConfig['filled'] = true;
      newLayer.config.visConfig['colorRange'] = colorRange;
      newLayer.config.visConfig['strokeColorRange'] = colorRange;
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
- h3: H3 hexagon cells (requires hexId column)
- geojson: Polygon/geometry features (uses geometry column, usually auto-detected)
- hexagon: Hexagonal binning of points
- heatmap: Heat map visualization
- cluster: Clustered point visualization
- arc/line: Arc or line connections between points
- grid: Grid binning
- trip: Animated trip (flights, deliveries, vessels)
- s2: S2 geometry cells

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
- Generate colorBrewer colors automatically if user doesn't specify colors

For geojson datasets:
- Use geometryColumn: '_geojson' and layerType: 'geojson' even for point collections
`,
    inputSchema: z.object({
      datasetName: z.string().describe('The name of the dataset. Note: do NOT use the datasetId.'),
      latitudeColumn: z.string().optional(),
      longitudeColumn: z.string().optional(),
      layerName: z
        .string()
        .optional()
        .describe('Generate a unique name for the layer based on the context.'),
      layerType: z.enum([
        'point',
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
      simpleColor: z
        .string()
        .optional()
        .describe(
          'The color of the layer e.g. [255, 0, 0]. Only used for simple map visualization (no colorBy, colorType, colorMap).'
        ),
      colorBy: z.string().optional(),
      colorType: z.enum(['breaks', 'unique']).optional(),
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
        colorMap
      } = args;
      try {
        const visState = ctx.getVisState();
        const datasets: Datasets = visState.datasets;

        const datasetId = Object.keys(datasets).find(
          dataId => datasets[dataId].label === datasetName || dataId === datasetName
        );
        if (!datasetId) {
          throw new Error(`Dataset ${datasetName} not found.`);
        }

        const dataset = datasets[datasetId];
        let layer = guessDefaultLayer(dataset, layerType);

        if (!layer) {
          if (layerType === 'point' && latitudeColumn && longitudeColumn) {
            layer = {
              id: `layer_${Date.now()}`,
              type: 'point',
              config: {
                dataId: datasetId,
                label: layerName || `${datasetName}-${layerType}`,
                columns: {
                  lat: {
                    value: latitudeColumn,
                    fieldIdx: dataset.getColumnFieldIdx(latitudeColumn)
                  },
                  lng: {
                    value: longitudeColumn,
                    fieldIdx: dataset.getColumnFieldIdx(longitudeColumn)
                  }
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
