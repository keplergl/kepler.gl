// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import Switch from '../../common/switch';
import {SidePanelSection} from '../../common/styled-components';
import {FormattedMessage} from '@kepler.gl/localization';

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
  };
  onChange: (config: {limitSearch: boolean}) => void;
};

function GeocoderConfigFactory() {
  const GeocoderConfig = ({config, onChange}: GeocoderConfigProps) => (
    <SidePanelSection>
      <LimitSwitchWrapper>
        <FormattedMessage id="geocoder.limitSearch" />
        <Switch
          checked={config.limitSearch}
          id="limit-search-toggle"
          onChange={() => {
            onChange({
              ...config,
              limitSearch: !config.limitSearch
            });
          }}
          secondary
        />
      </LimitSwitchWrapper>
    </SidePanelSection>
  );

  return GeocoderConfig;
}

export default GeocoderConfigFactory;
