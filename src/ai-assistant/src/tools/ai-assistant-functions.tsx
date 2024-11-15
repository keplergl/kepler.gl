import React, {ReactNode, useEffect, useState} from 'react';
import {MapStyleSelectorFactory, appInjector} from '@kepler.gl/components';
import {MapStyle} from '@kepler.gl/reducers';
import {mapStyleChange, ActionHandler} from '@kepler.gl/actions';
import {DEFAULT_MAP_STYLES} from '@kepler.gl/constants';
import {
  CallbackFunctionProps,
  CustomFunctionCall,
  CustomFunctionContext,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
  RegisterFunctionCallingProps
} from 'ai-assistant';

export function basemapFunctionDefinition(
  context: CustomFunctionContext<ActionHandler<typeof mapStyleChange> | MapStyle>
): RegisterFunctionCallingProps {
  return {
    name: 'basemap',
    description: 'change basemap',
    properties: {
      styleType: {
        type: 'string',
        description:
          'The name of the basemap style. Required. If not provided, please ask user to specify the style. Valid values are "dark-matter", "dark-matter-nolabels", "no_map", "positron", "positron-nolabels", "voyager", "voyager-nolabels"'
      }
    },
    required: ['styleType'],
    callbackFunction: basemapCallback,
    callbackFunctionContext: context,
    callbackMessage: customBasemapMessageCallback
  };
}

type BasemapCallbackResult = {
  success: boolean;
  styleType: string;
  details?: string;
};

type BasemapFunctionContext = {
  mapStyleChange: (styleType: string) => void;
  mapStyle: MapStyle;
};

type OutputResultProps = BasemapCallbackResult | ErrorCallbackResult;

type OutputDataProps = BasemapFunctionContext;

type BasemapCallbackOutput = CustomFunctionOutputProps<OutputResultProps, OutputDataProps>;

type BasemapCallbackArgs = {
  styleType: string;
};

function basemapCallback({
  functionName,
  functionArgs,
  functionContext
}: CallbackFunctionProps): BasemapCallbackOutput {
  const {styleType} = functionArgs as BasemapCallbackArgs;
  const {mapStyleChange, mapStyle} = functionContext as BasemapFunctionContext;

  // check if styleType is valid
  if (!DEFAULT_MAP_STYLES.find(style => style.id === styleType)) {
    return {
      type: 'basemap',
      name: functionName,
      result: {
        success: false,
        details: `Invalid basemap style: ${styleType}. The valid values are ${DEFAULT_MAP_STYLES.map(
          style => style.id
        ).join(', ')}`
      }
    };
  }

  // change the basemap style
  // mapStyleChange(styleType);

  return {
    type: 'basemap',
    name: functionName,
    result: {
      success: true,
      styleType,
      details: `Yes, I can help to change the basemap style to ${styleType}.`
    },
    data: {
      mapStyleChange,
      mapStyle
    }
  };
}

const MapStyleSelector = appInjector.get(MapStyleSelectorFactory);

function BasemapMessage({functionArgs, output}: CustomFunctionCall) {
  const {styleType} = functionArgs as BasemapCallbackArgs;
  const outputData = output.data as BasemapFunctionContext;

  const [isSelecting, setIsSelecting] = useState(false);

  const [selectedMapStyle, setSelectedMapStyle] = useState(styleType);

  useEffect(() => {
    outputData?.mapStyleChange(styleType);
  }, [outputData, styleType]);

  if (!outputData) {
    return null;
  }

  const onChangeBasemap = (id: string) => {
    mapStyleChange(id);
    setSelectedMapStyle(id);
  };

  const onToggleActive = () => {
    setIsSelecting(!isSelecting);
  };

  return (
    <div>
      <MapStyleSelector
        mapStyle={{...outputData.mapStyle, styleType: selectedMapStyle}}
        isSelecting={isSelecting}
        onChange={onChangeBasemap}
        toggleActive={onToggleActive}
      />
    </div>
  );
}

function customBasemapMessageCallback(props: CustomFunctionCall): ReactNode | null {
  return <BasemapMessage {...props} />;
}
