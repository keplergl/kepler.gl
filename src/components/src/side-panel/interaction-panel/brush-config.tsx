// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import RangeSliderFactory from '../../common/range-slider';

import {PanelLabel, SidePanelSection} from '../../common/styled-components';
import {BRUSH_CONFIG} from '@kepler.gl/reducers';
import {FormattedMessage} from '@kepler.gl/localization';

BrushConfigFactory.deps = [RangeSliderFactory];

type BrushConfigProps = {
  config: {
    size: number;
  };
  onChange: (config: {size: number}) => void;
};

function BrushConfigFactory(RangeSlider: ReturnType<typeof RangeSliderFactory>) {
  const BrushConfig = ({config, onChange}: BrushConfigProps) => (
    <SidePanelSection>
      <PanelLabel>
        <FormattedMessage id={'misc.brushRadius'} />
      </PanelLabel>
      <RangeSlider
        range={BRUSH_CONFIG.range}
        value0={0}
        value1={config.size || 10 / 2}
        step={0.1}
        isRanged={false}
        onChange={value => onChange({...config, size: value[1]})}
        inputTheme="secondary"
      />
    </SidePanelSection>
  );

  return BrushConfig;
}

export default BrushConfigFactory;
