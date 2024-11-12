// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {CHANNEL_SCALES, SCALE_TYPE_NAMES} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';
import {ColorUI, LayerVisConfig} from '@kepler.gl/types';
import {camelize} from '@kepler.gl/utils';
import {Layer, VisualChannel} from '@kepler.gl/layers';
import {default as React, useCallback} from 'react';
import {Field} from '@kepler.gl/types';
import ItemSelector from '../../common/item-selector/item-selector';
import {PanelLabel, SidePanelSection} from '../../common/styled-components';
import ColorScaleSelectorFactory from './color-scale-selector';

const SizeScaleSelector = ({...dropdownSelectProps}: any) => (
  <ItemSelector {...dropdownSelectProps} />
);

export type DimensionScaleSelectorProps = {
  layer: Layer;
  channel: VisualChannel;
  label?: string;
  onChange: (
    newConfig: {[key: string]: Field | null | string},
    key: string,
    newVisConfig?: Partial<LayerVisConfig>
  ) => void;
  setColorUI: (range: string, newConfig: {[key in keyof ColorUI]: ColorUI[key]}) => void;
};

DimensionScaleSelectorFactory.deps = [ColorScaleSelectorFactory];

function DimensionScaleSelectorFactory(
  ColorScaleSelector: ReturnType<typeof ColorScaleSelectorFactory>
): React.FC<DimensionScaleSelectorProps> {
  const DimensionScaleSelector: React.FC<DimensionScaleSelectorProps> = ({
    layer,
    channel,
    label,
    onChange,
    setColorUI
  }) => {
    const {channelScaleType, domain, field, key, range, scale} = channel;
    const scaleType = scale ? layer.config[scale] : null;
    const layerScaleOptions = layer.getScaleOptions(key);
    const scaleOptions = layerScaleOptions.map(op => ({
      label: SCALE_TYPE_NAMES[op] || op,
      value: op
    }));
    const disabled = scaleOptions.length < 2;
    const isColorScale = channelScaleType === CHANNEL_SCALES.color;

    const onSelect = useCallback(
      (val, newRange) => onChange({[scale]: val}, key, newRange ? {[range]: newRange} : undefined),
      [onChange, range, scale, key]
    );
    const _setColorUI = useCallback(newConfig => setColorUI(range, newConfig), [range, setColorUI]);

    const dropdownSelectProps = {
      disabled,
      selectedItems: scaleOptions.filter(op => op.value === scaleType),
      options: scaleOptions,
      multiSelect: false,
      searchable: false,
      onChange: onSelect,
      displayOption: 'label',
      getOptionValue: 'value'
    };

    return (
      <SidePanelSection>
        <PanelLabel>
          <FormattedMessage
            id={label ? `scale.${camelize(label)}` : 'misc.scale'}
            defaultMessage={label}
          />
        </PanelLabel>
        {isColorScale ? (
          <ColorScaleSelector
            {...dropdownSelectProps}
            layer={layer}
            field={layer.config[field]}
            onSelect={onSelect}
            scaleType={scaleType}
            domain={layer.config[domain]}
            range={layer.config.visConfig[range]}
            setColorUI={_setColorUI}
            colorUIConfig={layer.config.colorUI?.[range]}
          />
        ) : (
          <SizeScaleSelector {...dropdownSelectProps} />
        )}
      </SidePanelSection>
    );
  };
  return DimensionScaleSelector;
}

export default DimensionScaleSelectorFactory;
