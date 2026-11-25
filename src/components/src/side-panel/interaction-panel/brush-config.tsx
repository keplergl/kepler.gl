// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {injectIntl, IntlShape} from 'react-intl';
import type {Brush} from '@kepler.gl/types';
import ItemSelector from '../../common/item-selector/item-selector';
import RangeSliderFactory from '../../common/range-slider';
import Switch from '../../common/switch';

import {PanelLabel, SidePanelSection} from '../../common/styled-components';
import {BRUSH_CONFIG} from '@kepler.gl/reducers';
import {FormattedMessage} from '@kepler.gl/localization';

BrushConfigFactory.deps = [RangeSliderFactory];

type BrushConfigProps = {
  config: Brush['config'];
  onChange: (config: Brush['config']) => void;
  intl: IntlShape;
};

const endpoints = ['source_target', 'source', 'target'] as const;

function BrushConfigFactory(RangeSlider: ReturnType<typeof RangeSliderFactory>) {
  const BrushConfig = ({config, onChange, intl}: BrushConfigProps) => (
    <SidePanelSection>
      <SidePanelSection>
        <Switch
          id="show-brush-toggle"
          label={<FormattedMessage id="misc.showBrush" />}
          checked={Boolean(config.showBrush)}
          onChange={() => onChange({...config, showBrush: !config.showBrush})}
          secondary
        />
      </SidePanelSection>
      <PanelLabel>
        <FormattedMessage id={'misc.brushRadius'} />
      </PanelLabel>
      <RangeSlider
        range={BRUSH_CONFIG.range}
        value0={0}
        value1={config.size ?? 2.5}
        step={0.1}
        isRanged={false}
        onChange={value => onChange({...config, size: value[1]})}
        inputTheme="secondary"
      />
      <SidePanelSection>
        <PanelLabel>
          <FormattedMessage id="misc.brushArcLineEndpoints" />
        </PanelLabel>
        <ItemSelector
          options={endpoints}
          selectedItems={
            config.endpoint === 'source' || config.endpoint === 'target'
              ? config.endpoint
              : 'source_target'
          }
          getOptionValue={endpoint => endpoint}
          displayOption={endpoint => intl.formatMessage({id: `misc.brushEndpoints.${endpoint}`})}
          onChange={endpoint => {
            if (endpoint === 'source_target' || endpoint === 'source' || endpoint === 'target') {
              onChange({...config, endpoint});
            }
          }}
          inputTheme="secondary"
          multiSelect={false}
          searchable={false}
        />
      </SidePanelSection>
    </SidePanelSection>
  );

  return injectIntl(BrushConfig);
}

export default BrushConfigFactory;
