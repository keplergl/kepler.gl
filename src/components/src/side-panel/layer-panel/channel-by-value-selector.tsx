// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';

import {CHANNEL_SCALE_SUPPORTED_FIELDS} from '@kepler.gl/constants';
import {Layer, VisualChannel} from '@kepler.gl/layers';
import {KeplerTable} from '@kepler.gl/table';
import {ColorUI, Field, LayerVisConfig, NestedPartial} from '@kepler.gl/types';

import DimensionScaleSelectorFactory from './dimension-scale-selector';
import VisConfigByFieldSelectorFactory from './vis-config-by-field-selector';

export type ChannelByValueSelectorProps = {
  layer: Layer;
  channel: VisualChannel;
  onChange: (
    newConfig: {[key: string]: Field | null | string},
    key: string,
    newVisConfig?: Partial<LayerVisConfig>
  ) => void;
  fields: Field[];
  dataset: KeplerTable | undefined;
  description?: string;
  setColorUI: (prop: string, newConfig: NestedPartial<ColorUI>) => void;
  updateLayerVisConfig: (newConfig: Partial<LayerVisConfig>) => void;
  disabled?: boolean;
};

ChannelByValueSelectorFactory.deps = [
  VisConfigByFieldSelectorFactory,
  DimensionScaleSelectorFactory
];

export function ChannelByValueSelectorFactory(
  VisConfigByFieldSelector: ReturnType<typeof VisConfigByFieldSelectorFactory>,
  DimensionScaleSelector: ReturnType<typeof DimensionScaleSelectorFactory>
): React.FC<ChannelByValueSelectorProps> {
  const ChannelByValueSelector: React.FC<ChannelByValueSelectorProps> = ({
    layer,
    channel,
    onChange,
    fields,
    dataset,
    description,
    setColorUI,
    disabled
  }) => {
    const {channelScaleType, field, key, property, scale, defaultMeasure, supportedFieldTypes} =
      channel;
    const channelSupportedFieldTypes =
      supportedFieldTypes || CHANNEL_SCALE_SUPPORTED_FIELDS[channelScaleType];
    const supportedFields = fields.filter(({type}) => channelSupportedFieldTypes.includes(type));
    const showScale = !layer.isAggregated && layer.config[scale] && layer.config[field];
    const defaultDescription = 'layerConfiguration.defaultDescription';
    const updateField = useCallback(
      val => {
        onChange({[field]: val}, key);
      },
      [onChange, field, key]
    );

    return (
      <div className="channel-by-value-selector">
        <VisConfigByFieldSelector
          description={description || defaultDescription}
          fields={supportedFields}
          id={layer.id}
          key={`${key}-channel-selector`}
          property={property}
          disabled={disabled}
          placeholder={defaultMeasure || 'placeholder.selectField'}
          selectedField={layer.config[field]}
          updateField={updateField}
        />
        {showScale && !disabled ? (
          <DimensionScaleSelector
            layer={layer}
            channel={channel}
            dataset={dataset}
            label={`${property} scale`}
            setColorUI={setColorUI}
            onChange={onChange}
          />
        ) : null}
      </div>
    );
  };

  return ChannelByValueSelector;
}

export default ChannelByValueSelectorFactory;
