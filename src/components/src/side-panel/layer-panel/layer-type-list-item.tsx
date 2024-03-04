// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType} from 'react';
import styled, {withTheme} from 'styled-components';
import {KEPLER_UNFOLDED_BUCKET} from '@kepler.gl/constants';
import classNames from 'classnames';
import {FormattedMessage} from '@kepler.gl/localization';
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
    background-image: url(${`${KEPLER_UNFOLDED_BUCKET}/images/kepler.gl-layer-icon-bg.png`});
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
  const LayerTypeListItem: React.FC<WithThemeProps> = ({value, isTile, theme, className}) => (
    <StyledListItem
      className={classNames('layer-type-selector__item__inner', className, {
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
