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

import React, {useState, useCallback, useEffect, useRef} from 'react';
import styled from 'styled-components';

import {PanelLabel, SidePanelSection} from 'components/common/styled-components';
import RangeSliderFactory from 'components/common/range-slider';
import {FormattedMessage} from '@kepler.gl/localization';
import {KeyEvent} from '@kepler.gl/constants';
import {Checkbox} from 'components';
import {Layer, LayerBaseConfig, clamp, isInRange} from '@kepler.gl/layers';

type LazyInputProps = {
  value: string | [string, string];
  name: string;
  onChange: (n: string | [string, string], v?: string | [string, string]) => void;
};

type CustomInputProps = {
  value: string | [string, string];
  isRanged: boolean;
  onChangeCustomInput: (v: [string, string]) => void;
};

type VisConfigSliderProps = {
  layer: Layer;
  property: string;
  onChange: (v: Record<string, number | string | number[] | string[]>) => void;
  label?: string | ((c: LayerBaseConfig) => string);
  range: [number, number];
  step?: number;
  isRanged: boolean;
  disabled?: boolean;
  inputTheme?: string;
  allowCustomValue?: boolean;
};

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

const LazyInput: React.FC<LazyInputProps> = ({value, onChange, name}) => {
  const [stateValue, setValue] = useState(value);
  const inputRef = useRef(null);
  useEffect(() => {
    setValue(value);
  }, [value]);

  const onKeyDown = useCallback(
    e => {
      switch (e.keyCode) {
        case KeyEvent.DOM_VK_ENTER:
        case KeyEvent.DOM_VK_RETURN:
          onChange(stateValue);
          if (inputRef !== null) {
            // @ts-ignore
            inputRef?.current.blur();
          }
          break;
        default:
          break;
      }
    },
    [onChange, stateValue]
  );

  const _onChange = useCallback(e => setValue(e.target.value), [setValue]);
  const onBlur = useCallback(() => onChange(name, stateValue), [onChange, name, stateValue]);

  return (
    <RangeInput
      type="number"
      ref={inputRef}
      value={stateValue}
      onChange={_onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      id={name}
    />
  );
};

const CustomInput: React.FC<CustomInputProps> = ({isRanged, value, onChangeCustomInput}) => {
  const onChangeInput = useCallback(
    (name, v) => {
      if (isRanged) onChangeCustomInput(name === 'value0' ? [v, value[1]] : [value[0], v]);
      else onChangeCustomInput(v);
    },
    [isRanged, value, onChangeCustomInput]
  );

  return (
    <CustomInputWrapper>
      {isRanged ? (
        <InputWrapper>
          <CustomInputLabel>
            min
            <LazyInput name="value0" value={value[0]} onChange={onChangeInput} />
          </CustomInputLabel>
          <CustomInputLabel>
            max
            <LazyInput name="value1" value={value[1]} onChange={onChangeInput} />
          </CustomInputLabel>
        </InputWrapper>
      ) : (
        <InputWrapper>
          <LazyInput name="value" value={value} onChange={onChangeInput} />
        </InputWrapper>
      )}
    </CustomInputWrapper>
  );
};

VisConfigSliderFactory.deps = [RangeSliderFactory];

export default function VisConfigSliderFactory(RangeSlider: ReturnType<typeof RangeSliderFactory>) {
  const VisConfigSlider: React.FC<VisConfigSliderProps> = ({
    layer: {config},
    property,
    label,
    range,
    step,
    isRanged,
    allowCustomValue,
    disabled,
    onChange,
    inputTheme
  }) => {
    const value = config.visConfig[property];
    const [custom, setCustom] = useState(false || !isInRange(value, range));

    const onChangeCheckbox = useCallback(() => {
      if (custom) {
        // we are swithcing from custom to not custom
        // adjust value to range
        const adjustedValue = isRanged
          ? [clamp(range, value[0]), clamp(range, value[1])]
          : clamp(range, value);
        onChange({[property]: adjustedValue});
      }
      setCustom(!custom);
    }, [onChange, property, isRanged, value, range, custom, setCustom]);

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

        {allowCustomValue ? (
          <InputWrapper>
            <CustomInputLabel>custom input</CustomInputLabel>
            <Checkbox id={`property.${property}`} checked={custom} onChange={onChangeCheckbox} />
          </InputWrapper>
        ) : null}

        {!custom ? (
          <RangeSlider
            range={range}
            value0={isRanged ? value[0] : range[0]}
            value1={isRanged ? value[1] : value}
            step={step}
            isRanged={Boolean(isRanged)}
            onChange={v => onChange({[property]: isRanged ? v : v[1]})}
            inputTheme={inputTheme}
            showInput
          />
        ) : (
          <CustomInput
            isRanged={isRanged}
            value={value}
            onChangeCustomInput={v => onChange({[property]: v})}
          />
        )}
      </SidePanelSection>
    );
  };

  return VisConfigSlider;
}
