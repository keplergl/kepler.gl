// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import DimensionScaleSelectorFactory from './dimension-scale-selector';

AggrScaleSelectorFactory.deps = [DimensionScaleSelectorFactory];
export function AggrScaleSelectorFactory(DimensionScaleSelector) {
  const AggrScaleSelector = ({channel, layer, onChange, setColorUI}) => {
    const {key} = channel;
    const scaleOptions = layer.getScaleOptions(key);

    return Array.isArray(scaleOptions) && scaleOptions.length > 1 ? (
      <DimensionScaleSelector
        layer={layer}
        channel={channel}
        label={`${key} Scale`}
        onChange={onChange}
        setColorUI={setColorUI}
      />
    ) : null;
  };

  return AggrScaleSelector;
}

export default AggrScaleSelectorFactory;
