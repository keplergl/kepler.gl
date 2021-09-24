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

import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {PanelLabel, SidePanelSection} from 'components/common/styled-components';

import RangeSliderFactory from 'components/common/range-slider';
import {FormattedMessage} from 'localization';
import {Checkbox} from 'components';

const InputWrapper = styled.div`
  display: flex;
  line-height: 12px;
  margin-bottom: 12px;
`;

const CustomInputWrapper = styled.div`
  display: flex;
`;

const CustomInputLabel = styled.label`
  color: ${props => props.theme.textColor};
  font-weight: 500;
  letter-spacing: 0.2px;
  font-size: ${props => props.theme.layerConfigGroupLabelLabelFontSize};
  padding-right: 15px;

  &:last-child {
    position: absolute;
    right: 0;
    padding: 0;
  }
`;

const RangeInput = styled.input`
  ${props => props.theme.input};
  font-size: ${props => props.theme.sliderInputFontSize};
  width: 44px;
  overflow: auto;
  height: 20px;
  margin-top: 5px;
`;

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
  }) => {
    const [custom, setCustom] = useState(false);
    const [values, setValues] = useState({
      value: '',
      value0: '',
      value1: ''
    });

    const updateField = e => {
      setValues({
        ...values,
        [e.target.name]: e.target.value
      });
    };

    const onKeyPress = useCallback(
      e => {
        if (e.key === 'Enter') {
          const val = e.target.value;
          switch (e.target.name) {
            case 'value':
              config.visConfig[property] = range[1] = Number(val);
              break;
            case 'value0':
              config.visConfig.radiusRange[0] = range[0] = Number(val);
              break;
            case 'value1':
              config.visConfig.radiusRange[1] = range[1] = Number(val);
              break;
            default:
              break;
          }
        }
      },
      [config.visConfig, property, range]
    );

    const renderCustomInput = () => {
      return (
        <CustomInputWrapper>
          {isRanged ? (
            <InputWrapper>
              <CustomInputLabel>
                min
                <RangeInput
                  type="number"
                  name="value0"
                  value={values.value0}
                  onChange={updateField}
                  onKeyPress={onKeyPress}
                />
              </CustomInputLabel>
              <CustomInputLabel>
                max
                <RangeInput
                  type="number"
                  name="value1"
                  value={values.value1}
                  onChange={updateField}
                  onKeyPress={onKeyPress}
                />
              </CustomInputLabel>
            </InputWrapper>
          ) : (
            <InputWrapper>
              <RangeInput
                type="number"
                name="value"
                value={values.value}
                onChange={updateField}
                onKeyPress={onKeyPress}
              />
            </InputWrapper>
          )}
        </CustomInputWrapper>
      );
    };

    return (
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

        <InputWrapper>
          <CustomInputLabel>custom input</CustomInputLabel>
          <Checkbox
            id={`property.${property}`}
            checked={custom}
            onChange={() => setCustom(!custom)}
          />
        </InputWrapper>

        {!custom ? (
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
        ) : (
          renderCustomInput()
        )}
      </SidePanelSection>
    );
  };

  VisConfigSlider.propTypes = propTypes;

  return VisConfigSlider;
}
