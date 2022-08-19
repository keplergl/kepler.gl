// Copyright (c) 2022 Uber Technologies, Inc.
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
import styled from 'styled-components';
import InfoHelperFactory from 'components/common/info-helper';
import Switch from 'components/common/switch';
import {SidePanelSection, PanelLabel} from 'components/common/styled-components';
import {FormattedMessage} from '@kepler.gl/localization'
import {capitalizeFirstLetter} from 'utils/utils';
import {Layer} from '@kepler.gl/layers';

type VisConfigSwitchProps = {
  layer: Layer;
  property: string;
  onChange: (v: Record<string, boolean>) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
};

const StyledVisConfigSwitch = styled.div`
  display: flex;
  justify-content: space-between;

  .vis-config-switch__title {
    display: flex;
  }
`;

VisConfigSwitchFactory.deps = [InfoHelperFactory];
function VisConfigSwitchFactory(InfoHelper: ReturnType<typeof InfoHelperFactory>) {
  const VisConfigSwitch: React.FC<VisConfigSwitchProps> = ({
    layer: {id, config},
    property,
    onChange,
    label,
    description,
    disabled
  }) => (
    <SidePanelSection disabled={Boolean(disabled)}>
      <StyledVisConfigSwitch className="vis-config-switch">
        <div className="vis-config-switch__title">
          {label ? (
            <PanelLabel>
              {(label && <FormattedMessage id={label} />) || capitalizeFirstLetter(property)}
            </PanelLabel>
          ) : null}
          {description ? (
            <div>
              <InfoHelper description={description} id={`${id}-${property}-description`} />
            </div>
          ) : null}
        </div>
        <div className="vis-config-switch__switch">
          <Switch
            checked={config.visConfig[property]}
            id={`${id}-${property}-switch`}
            onChange={() => onChange({[property]: !config.visConfig[property]})}
          />
        </div>
      </StyledVisConfigSwitch>
    </SidePanelSection>
  );

  return VisConfigSwitch;
}
export default VisConfigSwitchFactory;
