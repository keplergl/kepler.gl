import {ActionHandler, addLayer} from '@kepler.gl/actions';
import {Datasets} from '@kepler.gl/table';
import {
  CallbackFunctionProps,
  CustomFunctionContext,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
  RegisterFunctionCallingProps
} from 'react-ai-assist';

export type ColorScaleConfig = {
  colorScale: string;
  customColorScale?: number[];
  customColors?: string[];
};

export function colorScaleFunctionDefinition(
  context: CustomFunctionContext<ActionHandler<typeof addLayer> | Datasets>
): RegisterFunctionCallingProps {
  return {
    name: 'configureColorScale',
    description: 'Configure color scale settings for a layer',
    properties: {
      colorScale: {
        type: 'string',
        description:
          'The color scale type. Default is "quantile". The possible values are "quantile", "quantize", "ordinal" or "custom"'
      },
      customColorScale: {
        type: 'array',
        items: {
          type: 'number'
        },
        description: 'The custom color scale breakpoints. Only used when colorScale is "custom".'
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
    required: ['colorScale'],
    callbackFunction: validateColorScaleCallback,
    callbackFunctionContext: context
  };
}

type ColorScaleCallbackArgs = {
  colorScale: string;
  customColorScale?: number[];
  customColors?: string[];
};

type ColorScaleCallbackResult = {
  success: boolean;
  details?: string;
  colorScale: string;
  customColorScale?: number[];
  customColors?: string[];
};

type OutputResultProps = ColorScaleCallbackResult | ErrorCallbackResult;

type ColorScaleCallbackOutput = CustomFunctionOutputProps<OutputResultProps>;

export function validateColorScale({
  colorScale,
  customColorScale,
  customColors
}: ColorScaleConfig): {isValid: boolean; error?: string} {
  // check colorScale is valid
  if (!['quantile', 'quantize', 'ordinal', 'custom'].includes(colorScale)) {
    return {
      isValid: false,
      error: `Invalid color scale: ${colorScale}. The valid values are "quantile", "quantize", "ordinal" or "custom"`
    };
  }

  // check if customColorScale is available when using custom scale
  if (colorScale === 'custom' && !customColorScale) {
    return {
      isValid: false,
      error: 'Custom color scale is required when colorScale is "custom"'
    };
  }

  // check if customColors array length matches customColorScale
  if (customColorScale && customColors) {
    if (customColors.length !== customColorScale.length + 1) {
      return {
        isValid: false,
        error: 'Custom colors array must contain exactly one more color than the number of scale breakpoints'
      };
    }
  }

  return {isValid: true};
}

function validateColorScaleCallback({
  functionName,
  functionArgs
}: CallbackFunctionProps): ColorScaleCallbackOutput {
  const {colorScale, customColorScale, customColors} = functionArgs as ColorScaleCallbackArgs;

  const validation = validateColorScale({colorScale, customColorScale, customColors});

  if (!validation.isValid) {
    return {
      type: 'colorScale',
      name: functionName,
      result: {
        success: false,
        details: validation.error
      }
    };
  }

  return {
    type: 'colorScale',
    name: functionName,
    result: {
      success: true,
      details: 'Color scale configuration is valid',
      colorScale,
      customColorScale,
      customColors
    }
  };
}
