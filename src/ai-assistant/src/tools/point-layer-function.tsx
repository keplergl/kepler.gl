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
import {createPointLayerConfig} from './layer-utils';
import {validateColorScale, ColorScaleConfig} from './color-scale-function';

export function addPointLayerFunctionDefinition(
  context: CustomFunctionContext<ActionHandler<typeof addLayer> | Datasets>
): RegisterFunctionCallingProps {
  return {
    name: 'addPointLayer',
    description: 'Add a new Point layer using latitude and longitude fields',
    properties: {
      datasetName: {
        type: 'string',
        description:
          'The name of the dataset. If not provided, the first dataset will be used. If no dataset, please ask user to load a dataset.'
      },
      latitudeField: {
        type: 'string',
        description:
          'The name of the latitude field in the dataset. If not provided, will try to guess from common field names like "lat", "latitude", etc.'
      },
      longitudeField: {
        type: 'string',
        description:
          'The name of the longitude field in the dataset. If not provided, will try to guess from common field names like "lon", "lng", "longitude", etc.'
      },
      colorField: {
        type: 'string',
        description:
          'The name of the field to color the points by. If not provided, show all field names from the dataset and ask user to specify one.'
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
        description:
          'An array of hex color values. Must contain exactly one more color than the number of values in customColorScale.'
      }
    },
    required: ['datasetName', 'colorField'],
    callbackFunction: addPointLayerCallback,
    callbackFunctionContext: context
  };
}

type AddLayerCallbackArgs = {
  datasetName: string;
  latitudeField?: string;
  longitudeField?: string;
  colorField: string;
  colorScale?: string;
  customColorScale?: number[];
  customColors?: string[];
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

const COMMON_LAT_FIELDS = ['lat', 'latitude', 'LAT', 'LATITUDE'];
const COMMON_LON_FIELDS = ['lon', 'lng', 'longitude', 'LON', 'LNG', 'LONGITUDE'];

function guessCoordinateField(dataset: any, possibleNames: string[]): string | null {
  const fields = dataset.fields.map(f => f.name);
  return possibleNames.find(name => fields.includes(name)) || null;
}

function addPointLayerCallback({
  functionName,
  functionArgs,
  functionContext
}: CallbackFunctionProps): AddLayerCallbackOutput {
  const {
    datasetName,
    latitudeField,
    longitudeField,
    colorField,
    colorScale = 'quantile',
    customColorScale,
    customColors
  } = functionArgs as AddLayerCallbackArgs;
  const {datasets, addLayer} = functionContext as AddLayerFunctionContext;

  // check if dataset exists
  const datasetError = checkDatasetNotExists(datasets, datasetName, functionName);
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (datasetError || !datasetId) {
    return datasetError as AddLayerCallbackOutput;
  }

  const dataset = datasets[datasetId];

  // guess coordinate fields if not provided
  const latField = latitudeField || guessCoordinateField(dataset, COMMON_LAT_FIELDS);
  const lonField = longitudeField || guessCoordinateField(dataset, COMMON_LON_FIELDS);

  if (!latField || !lonField) {
    return {
      type: 'layer',
      name: functionName,
      result: {
        success: false,
        details: 'Could not find latitude and longitude fields. Please specify them explicitly.'
      }
    };
  }

  // check if fields exist in the dataset
  const latFieldError = checkFieldNotExists(dataset, latField, functionName);
  const lonFieldError = checkFieldNotExists(dataset, lonField, functionName);
  const colorFieldError = checkFieldNotExists(dataset, colorField, functionName);

  if (latFieldError || lonFieldError || colorFieldError) {
    return (latFieldError || lonFieldError || colorFieldError) as AddLayerCallbackOutput;
  }

  // Replace the color scale validation with:
  const colorScaleValidation = validateColorScale({
    colorScale,
    customColorScale,
    customColors
  });

  if (!colorScaleValidation.isValid) {
    return {
      type: 'layer',
      name: functionName,
      result: {
        success: false,
        details: colorScaleValidation.error
      }
    };
  }

  // create a new PointLayer
  const PointLayer = LayerClasses.point;
  const result = PointLayer.findDefaultLayerProps(dataset);
  const layer = new PointLayer(result.props[0]);

  // construct new layer config
  const newLayer = createPointLayerConfig({
    layer,
    dataset,
    latField,
    lonField,
    colorField,
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
      details: `New Point layer with ${colorField} color field added successfully using ${latField} and ${lonField} for coordinates.`
    },
    data: {layerId: newLayer.id}
  };
}
