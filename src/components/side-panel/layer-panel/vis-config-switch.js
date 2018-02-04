import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import InfoHelper from 'components/common/info-helper';
import Switch from 'components/common/switch';
import {SidePanelSection, PanelLabel} from 'components/common/styled-components';
import {capitalizeFirstLetter} from 'utils/utils';

const propTypes = {
  layer: PropTypes.object.isRequired,
  property: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.func
  ]),
  description: PropTypes.string,
  disabled: PropTypes.bool
};

const StyledVisConfigSwitch = styled.div`
  display: flex;
  justify-content: space-between;
  
  .vis-config-switch__title {
    display: flex;
  }
`;

const VisConfigSwitch = ({
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
        {label ? <PanelLabel>{label || capitalizeFirstLetter(property)}</PanelLabel> : null}
        {description ? (
          <div>
            <InfoHelper description={description} id={`${id}-${property}`} />
          </div>
        ) : null}
      </div>
      <div className="vis-config-switch__switch">
        <Switch
          checked={config.visConfig[property]}
          id={`${id}-${property}`}
          onChange={() => onChange({[property]: !config.visConfig[property]})}
        />
      </div>
    </StyledVisConfigSwitch>
  </SidePanelSection>
);

VisConfigSwitch.propTypes = propTypes;

export default VisConfigSwitch;
