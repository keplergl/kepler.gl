// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import {SidePanelSection} from 'components/common/styled-components';
import styled from 'styled-components';
import Switch from 'components/common/switch';
import {FormattedMessage} from 'react-intl';

const LimitSwitchWrapper = styled.div`
  color: ${props => props.theme.labelColor};
  display: flex;
  font-size: ${props => props.theme.inputFontSize};
  justify-content: space-between;
  line-height: 11px;
  margin-bottom: 8px;
`;

function GeocoderConfigFactory() {
  const GeocoderConfig = ({config, onChange}) => (
    <SidePanelSection>
      <LimitSwitchWrapper>
        <FormattedMessage id="geocoder.limit" />
        <Switch
          checked={config.limitSearch}
          id="limit-toggle"
          onChange={() => {
            const newConfig = {
              ...config,
              limitSearch: !config.limitSearch
            };
            onChange(newConfig);
          }}
          secondary
        />
      </LimitSwitchWrapper>
    </SidePanelSection>
  );

  return GeocoderConfig;
}

export default GeocoderConfigFactory;
