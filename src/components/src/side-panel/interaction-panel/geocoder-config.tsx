// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import Switch from '../../common/switch';
import {PanelLabel, SidePanelSection} from '../../common/styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {GEOCODER_ICON_COLOR} from '@kepler.gl/constants';
import {RGBColor} from '@kepler.gl/types';
import ColorSelectorFactory from '../layer-panel/color-selector';

const LimitSwitchWrapper = styled.div`
  color: ${props => props.theme.labelColor};
  display: flex;
  font-size: ${props => props.theme.inputFontSize};
  justify-content: space-between;
  line-height: 11px;
  margin-bottom: 8px;
`;

type GeocoderConfigProps = {
  config: {
    limitSearch: boolean;
    color?: RGBColor;
  };
  onChange: (config: {limitSearch: boolean; color?: RGBColor}) => void;
};

GeocoderConfigFactory.deps = [ColorSelectorFactory];

function GeocoderConfigFactory(ColorSelector: ReturnType<typeof ColorSelectorFactory>) {
  const GeocoderConfig = ({config, onChange}: GeocoderConfigProps) => (
    <SidePanelSection>
      <LimitSwitchWrapper>
        <FormattedMessage id="geocoder.limitSearch" />
        <Switch
          checked={config?.limitSearch ?? false}
          id="limit-search-toggle"
          onChange={() => {
            onChange({
              ...config,
              limitSearch: !config?.limitSearch
            });
          }}
          secondary
        />
      </LimitSwitchWrapper>
      <PanelLabel>
        <FormattedMessage id="geocoder.pinColor" />
      </PanelLabel>
      <ColorSelector
        colorSets={[
          {
            selectedColor: config?.color ?? GEOCODER_ICON_COLOR,
            setColor: color => onChange({...config, color: color as RGBColor})
          }
        ]}
        inputTheme="secondary"
      />
    </SidePanelSection>
  );

  return GeocoderConfig;
}

export default GeocoderConfigFactory;
