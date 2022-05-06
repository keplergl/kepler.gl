import React, {useCallback, useState} from 'react';
import styled, {css} from 'styled-components';

import {RGBColor, RGBAColor} from '@kepler.gl/types';
import {rgbToHex} from '@kepler.gl/utils';
import {FormattedMessage} from '@kepler.gl/localization';

import {Tooltip} from '../../common/styled-components';
import {Portaled} from '../..';
import CustomPicker from '../layer-panel/custom-picker';
import {ColorBlock} from '../layer-panel/color-selector';

export type LayerGroupColorPickerProps = {
  slug: string;
  color: RGBAColor;
  onColorChange: (pd: RGBColor) => void;
  extraMarginRight: boolean;
  disabled: boolean;
};

const LayerGroupColorPickerWrapper = styled.div<LayerGroupColorPickerProps>`
  margin-right: ${props => (props.extraMarginRight ? 0 : 24)}px;
  cursor: pointer;
  ${props =>
    props.disabled &&
    css`
      cursor: none;
      pointer-events: none;
      opacity: 0.3;
    `}
`;

LayerGroupColorPickerFactory.deps = [];

function LayerGroupColorPickerFactory() {
  const LayerGroupColorPicker: React.FC<LayerGroupColorPickerProps> = ({
    slug,
    color,
    onColorChange,
    extraMarginRight,
    disabled
  }) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    const onColorBlockClick = useCallback(() => {
      setDisplayColorPicker(!displayColorPicker);
    }, [setDisplayColorPicker, displayColorPicker]);

    const onClosePicker = useCallback(() => {
      setDisplayColorPicker(false);
    }, [setDisplayColorPicker]);

    const onCustomPickerChange = useCallback(
      newColor => {
        onColorChange([newColor.rgb.r, newColor.rgb.g, newColor.rgb.b]);
      },
      [onColorChange]
    );

    return (
      <LayerGroupColorPickerWrapper extraMarginRight={extraMarginRight} disabled={disabled}>
        <ColorBlock
          color={color}
          onClick={onColorBlockClick}
          className="color-selector__selector__block"
          data-tip
          data-for={`update-color-${slug}`}
        />
        <Tooltip id={`update-color-${slug}`} effect="solid" delayShow={500}>
          <span>
            <FormattedMessage id={'Update color'} />
          </span>
        </Tooltip>
        <Portaled
          isOpened={displayColorPicker !== false}
          left={110}
          top={-50}
          onClose={onClosePicker}
        >
          <CustomPicker color={rgbToHex(color)} onChange={onCustomPickerChange} />
        </Portaled>
      </LayerGroupColorPickerWrapper>
    );
  };

  return LayerGroupColorPicker;
}

export default LayerGroupColorPickerFactory;
