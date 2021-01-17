// Copyright (c) 2021 Uber Technologies, Inc.
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
import PropTypes from 'prop-types';
import {PanelLabel, SidePanelSection} from 'components/common/styled-components';

import RangeSliderFactory from 'components/common/range-slider';
import {FormattedMessage} from 'localization';

const propTypes = {
  layer: PropTypes.object.isRequired,
  property: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.func]),
  range: PropTypes.arrayOf(PropTypes.number).isRequired,
  step: PropTypes.number,
  isRanged: PropTypes.bool,
  disabled: PropTypes.bool,
  inputTheme: PropTypes.bool
};

VisConfigSliderFactory.deps = [RangeSliderFactory];

export default function VisConfigSliderFactory(RangeSlider) {
  const VisConfigSlider = ({
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
          {typeof label === 'string' ? (
            <FormattedMessage id={label} />
          ) : typeof label === 'function' ? (
            <FormattedMessage id={label(config)} />
          ) : (
            <FormattedMessage id={`property.${property}`} />
          )}
        </PanelLabel>
      ) : null}
      <RangeSlider
        range={range}
        value0={isRanged ? config.visConfig[property][0] : range[0]}
        value1={isRanged ? config.visConfig[property][1] : config.visConfig[property]}
        step={step}
        isRanged={Boolean(isRanged)}
        onChange={value => onChange({[property]: isRanged ? value : value[1]})}
        inputTheme={inputTheme}
        showInput
      />
    </SidePanelSection>
  );

  VisConfigSlider.propTypes = propTypes;

  return VisConfigSlider;
}
