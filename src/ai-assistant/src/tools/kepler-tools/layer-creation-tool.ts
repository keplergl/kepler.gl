// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {tool} from 'ai';
import {z} from 'zod';
import {LayerClasses} from '@kepler.gl/layers';
import KeplerTable, {Datasets} from '@kepler.gl/table';
import {findDefaultLayer} from '@kepler.gl/reducers';
import {addLayer as addLayerAction} from '@kepler.gl/actions';
import {KeplerContext} from '../../types';

export function guessDefaultLayer(dataset: KeplerTable, layerType: string) {
  if (layerType === 'hexagon') {
    if (dataset.fieldPairs && dataset.fieldPairs.length > 0) {
      const props = dataset.fieldPairs.map(fieldPair => ({
        isVisible: true,
        label: 'Hexbin',
        columns: fieldPair.pair
      }));
      const layer = new LayerClasses.hexagon(props[0]);
      return layer;
    }
  }
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
  }
  if (layerType === 'cluster') {
    if (dataset.fieldPairs && dataset.fieldPairs.length > 0) {
      const props = dataset.fieldPairs.map(fieldPair => ({
        isVisible: true,
        label: 'Cluster',
        columns: fieldPair.pair
      }));
      const layer = new LayerClasses.cluster(props[0]);
      return layer;
    }
  }
  if (layerType === 'trip') {
    const layers = findDefaultLayer(dataset, [LayerClasses.trip] as any);
    const layer = layers.find(l => l.type === layerType);
    if (layer) return layer;
    throw new Error(
      `Failed to create a trip layer. Trip layer requires id, lat, lng, and timestamp columns.`
    );
  }
  const defaultLayers = findDefaultLayer(dataset, LayerClasses);
  const layer = defaultLayers.find(l => l.type === layerType);
  return layer || (defaultLayers.length > 0 ? defaultLayers[0] : null);
}

export function getAddLayerTool(ctx: KeplerContext) {
  return tool({
    description: `Add a kepler.gl map layer from a dataset.
You can create basic map layer without color styling, or enhanced map layer with color visualization.

For basic maps:
- Simply use datasetName, latitudeColumn/longitudeColumn (for point maps), and layerType
- Omit color-related parameters for simple visualization

For colored maps:
- If user requests color visualization, use available columns in the dataset
- Use dataClassify tool to classify data into bins or unique values when needed
- For colorType 'breaks': [{value: 0, color: '#fff7bc'}, {value: 3, color: '#fec44f'}, {value: null, color: '#d95f0e'}]
- For colorType 'unique': [{value: 'a', color: '#1b9e77'}, {value: 'b', color: '#d95f02'}]
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
    }),
    execute: async args => {
      try {
        const {
          datasetName,
          layerName,
          latitudeColumn,
          longitudeColumn,
          layerType,
          colorBy,
          colorType,
          colorMap
        } = args;

        const visState = ctx.getVisState();
        const datasets: Datasets = visState.datasets;

        const datasetId = Object.keys(datasets).find(
          dataId => datasets[dataId].label === datasetName
        );
        if (!datasetId) {
          throw new Error(`Dataset ${datasetName} not found.`);
        }

        const dataset = datasets[datasetId];
        let layer = guessDefaultLayer(dataset, layerType);

        const layerId = layer?.id || `layer_${Date.now()}`;

        if (!layer) {
          if (layerType === 'point' && latitudeColumn && longitudeColumn) {
            layer = {
              id: layerId,
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
                }
              },
              visConfig: {}
            } as any;
          }
        }
        if (!layer) {
          throw new Error(`Invalid layer type: ${layerType}.`);
        }

        const columns = layer?.config?.columns || {};
        const newLayer = {
          id: layerId,
          type: layer.type,
          config: {
            ...layer.config,
            dataId: datasetId,
            label: layerName || `${datasetName}-${layerType}`,
            columns: Object.keys(columns).reduce((acc, key) => {
              const column = columns[key];
              if (column) {
                acc[key] = column.value;
              }
              return acc;
            }, {} as Record<string, any>)
          }
        };

        if (colorBy) {
          const colorField = dataset.fields.find(f => f.name === colorBy);
          if (!colorField) {
            throw new Error(`Field ${colorBy} not found.`);
          }
          const colorScale = colorType === 'breaks' ? 'custom' : 'customOrdinal';
          const colors = colorMap?.map(c => c.color);
          const keplerColorMap = colorMap?.map(c => [c.value, c.color]);
          const colorRange = {
            name: 'color.customPalette',
            type: 'custom',
            category: 'Custom',
            colors,
            colorMap: keplerColorMap
          };

          (newLayer.config as any)['colorScale'] = colorScale;
          (newLayer.config as any)['colorField'] = colorField;
          (newLayer.config as any)['strokeColorScale'] = colorScale;
          (newLayer.config as any)['strokeColorField'] = colorField;
          if ((newLayer.config as any).visConfig) {
            (newLayer.config as any).visConfig['colorRange'] = colorRange;
            (newLayer.config as any).visConfig['strokeColorRange'] = colorRange;
          }
        }

        ctx.dispatch(addLayerAction(newLayer, datasetId));

        return {
          success: true,
          details: `Map layer ${layerId} has been added to the map.`
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          instruction:
            'Try to fix the error. If the error persists, ask the user to try with different parameters.'
        };
      }
    }
  });
}
