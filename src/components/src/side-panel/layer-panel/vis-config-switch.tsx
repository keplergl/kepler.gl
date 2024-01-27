// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import InfoHelperFactory from '../../common/info-helper';
import Switch from '../../common/switch';
import {SidePanelSection, PanelLabel} from '../../common/styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {capitalizeFirstLetter} from '@kepler.gl/utils';
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
