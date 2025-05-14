// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import classNames from 'classnames';
import React, {ComponentType} from 'react';
import styled, {withTheme} from 'styled-components';

import {FormattedMessage} from '@kepler.gl/localization';
import {getApplicationConfig} from '@kepler.gl/utils';

import {BaseProps} from '../../common/icons';

export type LayerTypeListItemProps = {
  value: {
    icon: ComponentType<Partial<BaseProps>>;
    label: string;
  };
  isTile?: boolean;
  className?: string;
};

type WithThemeProps = LayerTypeListItemProps & {theme: Record<string, string>};

export type LayerTypeListItemType = React.FC<LayerTypeListItemProps>;

type StyledListItemProps = {
  cdnUrl: string;
};

const StyledListItem = styled.div<StyledListItemProps>`
  &.list {
    display: flex;
    align-items: center;
    overflow: hidden;

    .layer-type-selector__item__icon {
      color: ${props => props.theme.activeColor};
      background-size: ${props => props.theme.layerTypeIconSizeSM}px
        ${props => props.theme.layerTypeIconSizeSM}px;
      height: ${props => props.theme.layerTypeIconSizeSM}px;
      width: ${props => props.theme.layerTypeIconSizeSM}px;
      margin-right: 12px;
    }

    .layer-type-selector__item__label {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .layer-type-selector__item__icon {
    color: ${props => props.theme.labelColor};
    display: flex;
    background-image: url(${props => `${props.cdnUrl}/images/kepler.gl-layer-icon-bg.png`});
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
    max-width: ${props => props.theme.layerTypeIconSizeL}px;
  }
`;

export function LayerTypeListItemFactory() {
  const LayerTypeListItem: React.FC<WithThemeProps> = ({value, isTile, theme, className}) => (
    <StyledListItem
      className={classNames('layer-type-selector__item__inner', className, {
        list: !isTile
      })}
      cdnUrl={getApplicationConfig().cdnUrl}
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

  return withTheme(LayerTypeListItem) as React.FC<LayerTypeListItemProps>;
}

export default LayerTypeListItemFactory;
