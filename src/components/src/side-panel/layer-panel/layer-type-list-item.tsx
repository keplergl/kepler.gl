// Copyright (c) 2023 Uber Technologies, Inc.
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

import React, {ComponentType} from 'react';
import styled, {withTheme} from 'styled-components';
import {CLOUDFRONT} from '@kepler.gl/constants';
import classNames from 'classnames';
import {FormattedMessage} from '@kepler.gl/localization';
import {BaseProps} from '../../common/icons';

type LayerTypeListItemProps = {
  value: {
    icon: ComponentType<Partial<BaseProps>>;
    label: string;
  };
  isTile: boolean;
};

type WithThemeProps = LayerTypeListItemProps & {theme: Record<string, string>};

export type LayerTypeListItemType = React.FC<LayerTypeListItemProps>;

const StyledListItem = styled.div`
  &.list {
    display: flex;
    align-items: center;

    .layer-type-selector__item__icon {
      color: ${props => props.theme.activeColor};
      background-size: ${props => props.theme.layerTypeIconSizeSM}px
        ${props => props.theme.layerTypeIconSizeSM}px;
      height: ${props => props.theme.layerTypeIconSizeSM}px;
      width: ${props => props.theme.layerTypeIconSizeSM}px;
      margin-right: 12px;
    }
  }

  .layer-type-selector__item__icon {
    color: ${props => props.theme.labelColor};
    display: flex;
    background-image: url(${`${CLOUDFRONT}/kepler.gl-layer-icon-bg.png`});
    background-size: ${props => props.theme.layerTypeIconSizeL}px
      ${props => props.theme.layerTypeIconSizeL}px;
    height: ${props => props.theme.layerTypeIconSizeL}px;
    width: ${props => props.theme.layerTypeIconSizeL}px;
  }

  .layer-type-selector__item__label {
    text-transform: capitalize;
    font-size: 12px;
    text-align: center;
    color: ${props => props.theme.selectColor};
  }
`;

export function LayerTypeListItemFactory() {
  const LayerTypeListItem: React.FC<WithThemeProps> = ({value, isTile, theme}) => (
    <StyledListItem
      className={classNames('layer-type-selector__item__inner', {
        list: !isTile
      })}
    >
      <div className="layer-type-selector__item__icon">
        <value.icon height={`${isTile ? theme.layerTypeIconSizeL : theme.layerTypeIconSizeSM}px`} />
      </div>
      <div className="layer-type-selector__item__label">
        <FormattedMessage
          id={`layer.type.${value.label.toLowerCase()}`}
          defaultMessage={value.label}
        />
      </div>
    </StyledListItem>
  );

  return withTheme(LayerTypeListItem);
}

export default LayerTypeListItemFactory;
