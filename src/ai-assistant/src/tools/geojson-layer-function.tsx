import {ActionHandler, addLayer} from '@kepler.gl/actions';
import {LayerClasses} from '@kepler.gl/layers';
import {Datasets} from '@kepler.gl/table';
import {
  CallbackFunctionProps,
  CustomFunctionContext,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
  RegisterFunctionCallingProps
} from 'react-ai-assist';
import {checkDatasetNotExists, checkFieldNotExists} from './utils';
import {createGeojsonLayerConfig} from './layer-utils';

export function addGeojsonLayerFunctionDefinition(
  context: CustomFunctionContext<ActionHandler<typeof addLayer> | Datasets>
): RegisterFunctionCallingProps {
  return {
    name: 'addGeojsonLayer',
    description: 'Add a new Geojson layer',
    properties: {
      datasetName: {
        type: 'string',
        description:
          'The name of the dataset. If not provided, the first dataset will be used. If no dataset, please ask user to load a dataset.'
      },
      // layerType: {
      //   type: 'string',
      //   description:
      //     'The type of the layer to add. If not provided, ask user to specify the type. Valid values are "point", "arc", "line", "grid", "hexagon", "geojson", "cluster", "heatmap", "h3", "trip" and "s2".'
      // },
      fieldName: {
        type: 'string',
        description:
          'The name of the field of the dataset. If not provided, show all field names from the dataset and ask user to specify one.'
      },
      colorScale: {
        type: 'string',
        description:
          'The color scale of the layer. Default is "quantile". The possible values are "quantile", "quantize", "ordinal" or "custom"'
      },
      customColorScale: {
        type: 'array',
        items: {
          type: 'number'
        },
        description: 'The custom color scale of the layer. Only used when colorScale is "custom".'
      },
      customColors: {
        type: 'array',
        items: {
          type: 'string'
        },
        description: 'The custom hex colors of the layer. Only used when colorScale is "custom".'
      }
    },
    required: ['datasetName', 'fieldName'],
    callbackFunction: addLayerCallback,
    callbackFunctionContext: context
  };
}

type AddLayerCallbackArgs = {
  datasetName: string;
  layerType: string;
  fieldName: string;
  colorScale: string;
  customColorScale: number[];
  customColors: string[];
};

type AddLayerFunctionContext = {
  datasets: Datasets;
  addLayer: ActionHandler<typeof addLayer>;
};

type AddLayerCallbackResult = {
  success: boolean;
  layerId: string;
  datasetId: string;
  layerLabel: string;
  details?: string;
};

type OutputResultProps = AddLayerCallbackResult | ErrorCallbackResult;

type OutputDataProps = {
  layerId: string;
};

type AddLayerCallbackOutput = CustomFunctionOutputProps<OutputResultProps, OutputDataProps>;

function addLayerCallback({
  functionName,
  functionArgs,
  functionContext
}: CallbackFunctionProps): AddLayerCallbackOutput {
  const {datasetName, fieldName, colorScale, customColorScale, customColors} =
    functionArgs as AddLayerCallbackArgs;
  const {datasets, addLayer} = functionContext as AddLayerFunctionContext;

  // check if dataset exists
  const datasetError = checkDatasetNotExists(datasets, datasetName, functionName);
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (datasetError || !datasetId) {
    return datasetError as AddLayerCallbackOutput;
  }

  // check if field exists in the dataset
  const dataset = datasets[datasetId];
  const fieldError = checkFieldNotExists(dataset, fieldName, functionName);
  const field = dataset.fields.find(f => f.name === fieldName);
  if (fieldError || !field) {
    return fieldError as AddLayerCallbackOutput;
  }

  // check colorScale is valid
  if (!['quantile', 'quantize', 'ordinal', 'custom'].includes(colorScale)) {
    return {
      type: 'layer',
      name: functionName,
      result: {
        success: false,
        details: `Invalid color scale: ${colorScale}. The valid values are "quantile", "quantize", "ordinal" or "custom"`
      }
    };
  }

  // check if customColorScale is available
  if (colorScale === 'custom' && !customColorScale) {
    return {
      type: 'layer',
      name: functionName,
      result: {
        success: false,
        details: 'Custom color scale is required when colorScale is "custom"'
      }
    };
  }

  // create a new GeojsonLayer
  const GeojsonLayer = LayerClasses.geojson;
  const result = GeojsonLayer.findDefaultLayerProps(dataset);
  const layer = new GeojsonLayer(result.props[0]);

  // construct new layer config for addLayer() action
  const newLayer = createGeojsonLayerConfig({
    layer,
    dataset,
    field,
    colorScale,
    customColorScale,
    customColors,
    colorRange: layer.config.visConfig.colorRange
  });

  addLayer(newLayer, datasetId);

  return {
    type: 'layer',
    name: functionName,
    result: {
      success: true,
      layerId: newLayer.id,
      datasetId,
      layerLabel: newLayer.config.label,
      details: `New Geojson layer with ${field.name} and ${colorScale} color scale added successfully.`
    },
    data: {layerId: newLayer.id}
  };
}
