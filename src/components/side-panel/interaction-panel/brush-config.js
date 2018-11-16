import React from 'react';
import RangeSlider from 'components/common/range-slider';

import {
  PanelLabel,
  SidePanelSection
} from 'components/common/styled-components';
import {BRUSH_CONFIG} from 'utils/interaction-utils';

function BrushConfigFactory() {
  const BrushConfig = ({config, onChange}) => (
    <SidePanelSection>
      <PanelLabel>Brush Radius (km)</PanelLabel>
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
