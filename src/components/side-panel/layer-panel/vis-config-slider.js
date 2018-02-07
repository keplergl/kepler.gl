import React from 'react';
import PropTypes from 'prop-types';
import {
  SidePanelSection,
  PanelLabel
} from 'components/common/styled-components';
import {capitalizeFirstLetter} from 'utils/utils';

import RangeSlider from 'components/common/range-slider';

const propTypes = {
  layer: PropTypes.object.isRequired,
  property: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.func
  ]),
  range: PropTypes.arrayOf(PropTypes.number).isRequired,
  step: PropTypes.number,
  isRanged: PropTypes.bool,
  disabled: PropTypes.bool,
  inputTheme: PropTypes.bool
};

export const VisConfigSlider = ({
  layer: {config},
  property,
  label,
  range,
  step,
  isRanged,
  disabled,
  onChange,
  inputTheme
}) => (
  <SidePanelSection disabled={Boolean(disabled)}>
    {label ? (
      <PanelLabel>
        {typeof label === 'string'
          ? label
          : typeof label === 'function'
            ? label(config)
            : capitalizeFirstLetter(property)}
      </PanelLabel>
    ) : null}
    <RangeSlider
      range={range}
      value0={isRanged ? config.visConfig[property][0] : range[0]}
      value1={
        isRanged ? config.visConfig[property][1] : config.visConfig[property]
      }
      step={step}
      isRanged={Boolean(isRanged)}
      onChange={value => onChange({[property]: isRanged ? value : value[1]})}
      inputTheme={inputTheme}
      showInput
    />
  </SidePanelSection>
);

VisConfigSlider.propTypes = propTypes;

export default VisConfigSlider;
