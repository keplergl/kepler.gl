// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled, {withTheme} from 'styled-components';
import classNames from 'classnames';

import {KEPLER_UNFOLDED_BUCKET} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';

import {Add} from '../common/icons';

export const DUMMY_ITEM_ID = 'dummy';

export type EffectTypeListItemProps = {
  value: {type: string; name: string};
  className?: string;
  isTile?: boolean;
  theme: any;
};

const StyledListItem = styled.div`
  border-radius: 2px;
  height: 89px;
  transition: background-color 0.4s;

  :hover {
    background-color: ${props => props.theme.effectTypeIconBgHoverColor};
  }

  .effect-type-selector__item__icon {
    display: flex;
    background-image: url(${`${KEPLER_UNFOLDED_BUCKET}/images/kepler.gl-layer-icon-bg.png`});
    background-size: ${props => props.theme.effectTypeIconSizeL}px
      ${props => props.theme.effectTypeIconSizeL}px;
    height: ${props => props.theme.effectTypeIconSizeL}px;
    width: ${props => props.theme.effectTypeIconSizeL}px;
    border-radius: 2px;

    .effect-preview {
      height: ${props => props.theme.effectTypeIconSizeL}px;
      width: ${props => props.theme.effectTypeIconSizeL}px;
    }
  }

  .effect-type-selector__item__label {
    text-transform: capitalize;
    font-size: 10px;
    text-align: center;
    color: ${props => props.theme.effectPanelTextMain};
    max-width: ${props => props.theme.effectTypeIconSizeL}px;
    line-height: 14px;
    padding-top: 2px;
  }
`;

const StyledAddButton = styled(Add)`
  margin-right: 8px;
  height: 16px;
`;

const StyledPlaceholderButton = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-left: 3px;
  margin-right: 3px;
  letter-spacing: 0.3px;
  font-family: ${props => props.theme.effectPanelAddEffectFontFamily};
  font-weight: 500;
`;

/**
 * Transforms an effect type from camel case into a name of the image in kebab case.
 * @param {string} type
 * @returns {string}
 */
const getImageUrl = type => {
  const kebab = type.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? '-' : '') + $.toLowerCase()
  );
  return `${KEPLER_UNFOLDED_BUCKET}/images/effects/${kebab}.png`;
};

export function EffectTypeListItemFactory() {
  const EffectTypeListItem: React.FC<EffectTypeListItemProps> = ({value, isTile, className}) => {
    if (value?.type === DUMMY_ITEM_ID) {
      return (
        <StyledPlaceholderButton>
          <StyledAddButton />
          <FormattedMessage id={'effectManager.addEffect'} />
        </StyledPlaceholderButton>
      );
    }

    return (
      <StyledListItem
        className={classNames('effect-type-selector__item__inner', className, {
          list: !isTile
        })}
      >
        <div className="effect-type-selector__item__icon">
          <img className="effect-preview" src={getImageUrl(value.type)} />
        </div>
        <div className="effect-type-selector__item__label">
          <FormattedMessage id={`effect.type.${value.type}`} defaultMessage={value.name} />
        </div>
      </StyledListItem>
    );
  };

  return withTheme(EffectTypeListItem);
}

export default EffectTypeListItemFactory;
