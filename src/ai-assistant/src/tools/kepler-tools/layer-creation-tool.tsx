// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useDispatch} from 'react-redux';
import {LayerClasses} from '@kepler.gl/layers';
import KeplerTable, {Datasets} from '@kepler.gl/table';
import {findDefaultLayer} from '@kepler.gl/reducers';
import {addLayer as addLayerAction} from '@kepler.gl/actions';
import {extendedTool, generateId} from '@openassistant/utils';
import {z} from 'zod';
import {useEffect} from 'react';

export const addLayer = extendedTool<
  // parameters
  z.ZodObject<{
    datasetName: z.ZodString;
    latitudeColumn: z.ZodOptional<z.ZodString>;
    longitudeColumn: z.ZodOptional<z.ZodString>;
    layerType: z.ZodEnum<
      [
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
      ]
    >;
    colorBy: z.ZodOptional<z.ZodString>;
    colorType: z.ZodOptional<z.ZodEnum<['breaks', 'unique']>>;
    colorMap: z.ZodOptional<
      z.ZodArray<
        z.ZodObject<{
          value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNull]>;
          color: z.ZodString;
        }>
      >
    >;
  }>,
  // return type
  ExecuteAddLayerResult['llmResult'],
  // additional data
  ExecuteAddLayerResult['additionalData'],
  // context
  AddLayerFunctionContext
>({
  description: `Add a kepler.gl map layer from a dataset.
You can create basic map layer without color styling, or enhanced map layer with color visualization.

For basic maps:
- Simply use datasetName, geometryColumn (if needed), latitudeColumn/longitudeColumn (for point maps), and mapType
- Omit color-related parameters for simple visualization

For colored maps:
- If user requests color visualization, use available columns in the dataset
- Use dataClassify tool to classify data into bins or unique values when needed
- If dataClassify tool returns a list of k breaks
  a. For a list of k break values, you must create k+1 entries in the colorMap, with the last value being null.
  b. For example: for breaks = [0, 3, 10], the colorMap could be [{value: 0, color: '##fff7bc', label: '< 0'}, {value: 3, color: '#fec44f', label: '[0-3)'}, {value: null, color: '#d95f0e', label: '>= 3'}]
- If dataClassify tool returns a list of k unique values
  a. There should be k colors in the colorMap. For example: for uniqueValues = ['a', 'b', 'c'], the colorMap could be [{value: 'a', color: '#1b9e77'}, {value: 'b', color: '#d95f02'}, {value: 'c', color: '#7570b3'}]
- Generate colorBrewer colors automatically if user doesn't specify colors

For geojson datasets:
- Use geometryColumn: '_geojson' and mapType: 'geojson' even for point collections
`,
  parameters: z.object({
    datasetName: z
      .string()
      .describe('The name of the dataset. Note: please do NOT use the datasetId.'),
    latitudeColumn: z.string().optional(),
    longitudeColumn: z.string().optional(),
    layerName: z
      .string()
      .optional()
      .describe('If possible, generate a name for the layer based on the context.'),
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
  execute: executeAddLayer,
  component: AddLayerToolComponent
});

export type AddLayerTool = typeof addLayer;

type AddLayerArgs = {
  datasetName: string;
  layerName?: string;
  layerType: string;
  latitudeColumn?: string;
  longitudeColumn?: string;
  colorBy?: string;
  colorType?: string;
  colorMap?: Array<{value: string | number | null; color: string; label?: string}>;
};

function isAddLayerArgs(args: any): args is AddLayerArgs {
  return typeof args === 'object' && args !== null && 'datasetName' in args && 'layerType' in args;
}

type AddLayerFunctionContext = {
  getDatasets: () => Datasets;
};

function isAddLayerFunctionContext(context: any): context is AddLayerFunctionContext {
  return context && typeof context.getDatasets === 'function';
}

type ExecuteAddLayerResult = {
  llmResult: {
    success: boolean;
    layer?: string;
    details?: string;
    error?: string;
    instruction?: string;
  };
  additionalData?: {
    layer: object;
    datasetId: string;
  };
};

async function executeAddLayer(args, options): Promise<ExecuteAddLayerResult> {
  try {
    if (!isAddLayerArgs(args)) {
      throw new Error('Invalid addLayer arguments');
    }

    if (!isAddLayerFunctionContext(options.context)) {
      throw new Error('Invalid addLayer context');
    }

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

    const datasets = options.context.getDatasets();

    // check if dataset exists in kepler.gl
    const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
    if (!datasetId) {
      throw new Error(`Dataset ${datasetName} not found.`);
    }

    // check if field exists in the dataset
    const dataset = datasets[datasetId];

    // check if layerType is valid
    let layer = guessDefaultLayer(dataset, layerType);

    const layerId = layer?.id || `layer_${generateId()}`;

    if (!layer) {
      // for point layer, try to creat a point layer manually if LLM sugggests Lat/Lng fields
      if (layerType === 'point' && latitudeColumn && longitudeColumn) {
        layer = {
          id: layerId,
          type: 'point',
          config: {
            dataId: datasetId,
            label: layerName || `${datasetName}-${layerType}`,
            columns: {
              lat: {value: latitudeColumn, fieldIdx: dataset.getColumnFieldIdx(latitudeColumn)},
              lng: {value: longitudeColumn, fieldIdx: dataset.getColumnFieldIdx(longitudeColumn)}
            }
          },
          visConfig: {
            colorRange: {
              name: 'Ice And Fire',
              type: 'diverging',
              category: 'Uber',
              colors: ['#D50255', '#FEAD54', '#FEEDB1', '#E8FEB5', '#49E3CE', '#0198BD']
            }
          }
        } as any;
      }
    }
    if (!layer) {
      throw new Error(`Invalid layer type: ${layerType}.`);
    }

    const columns = layer?.config?.columns || {};

    // construct new layer config for addLayer() action
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
        }, {})
      }
    };

    if (colorBy) {
      const colorField = dataset.fields.find(f => f.name === colorBy);
      if (!colorField) {
        throw new Error(`Field ${colorBy} not found.`);
      }
      // create kepler.gl's colorMap from uniqueValues and breaks
      const colorScale = colorType === 'breaks' ? 'custom' : 'customOrdinal';
      const colors = colorMap?.map(color => color.color);
      const keplerColorMap = colorMap?.map(color => [color.value, color.color]);
      const colorRange = {
        name: 'color.customPalette',
        type: 'custom',
        category: 'Custom',
        colors,
        colorMap: keplerColorMap
      };

      newLayer.config['colorScale'] = colorScale;
      newLayer.config['colorField'] = colorField;
      newLayer.config['strokeColorScale'] = colorScale;
      newLayer.config['strokeColorField'] = colorField;
      newLayer.config.visConfig['colorRange'] = colorRange;
      newLayer.config.visConfig['strokeColorRange'] = colorRange;
      newLayer.config['visualChannels'] = {
        colorField: {
          name: colorBy,
          type: colorField?.type
        },
        colorScale
      };
    }

    return {
      llmResult: {
        success: true,
        layer: JSON.stringify(newLayer),
        details: `map layer ${layerId} will be added to the map.`
      },
      additionalData: {
        layer: newLayer,
        datasetId
      }
    };
  } catch (error) {
    return {
      llmResult: {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        instruction:
          'Try to fix the error. If the error persists, pause the execution and ask the user to try with different prompt and context.'
      }
    };
  }
}

export function guessDefaultLayer(dataset: KeplerTable, layerType: string) {
  // special case for hexagon layer, which could be implemented as findDefaultLayerProps() in hexagon-layer.tsx
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
  const defaultLayers = findDefaultLayer(dataset, LayerClasses);
  const layer = defaultLayers.find(l => l.type === layerType);
  return layer || defaultLayers.length > 0 ? defaultLayers[0] : null;
}

export function AddLayerToolComponent({layer, datasetId}) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addLayerAction(layer, datasetId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
