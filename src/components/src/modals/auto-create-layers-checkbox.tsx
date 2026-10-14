// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {FC} from 'react';
import {useIntl} from 'react-intl';
import styled from 'styled-components';

import Checkbox from '../common/checkbox';
import {Docs} from '../common/icons';
import TippyTooltip from '../common/tippy-tooltip';

type AutoCreateLayersCheckboxProps = {
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

const AutoCreateLayersRow = styled.div.attrs({
  className: 'auto-create-layers'
})`
  display: flex;
  align-items: center;

  .kg-checkbox {
    margin-left: 0;
  }

  .kg-checkbox__label {
    margin-bottom: 0;
    margin-left: 0;
    color: ${props => props.theme.textColorLT};
  }
`;

const InfoButton = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  color: ${props => props.theme.subtextColorLT};
  cursor: help;

  &:hover {
    color: ${props => props.theme.textColorLT};
  }
`;

const AutoCreateLayersCheckbox: FC<AutoCreateLayersCheckboxProps> = ({
  checked,
  onToggle,
  disabled = false
}) => {
  const intl = useIntl();
  const label = intl.formatMessage({id: 'modal.loadData.autoCreateLayers'});
  const info = intl.formatMessage({id: 'modal.loadData.autoCreateLayersInfo'});

  return (
    <AutoCreateLayersRow>
      <Checkbox
        id="auto-create-layers"
        type="checkbox"
        label={label}
        checked={checked}
        disabled={disabled}
        onChange={onToggle}
      />
      <TippyTooltip placement="top" isLightTheme render={() => <div>{info}</div>}>
        <InfoButton aria-label={info}>
          <Docs height="16px" />
        </InfoButton>
      </TippyTooltip>
    </AutoCreateLayersRow>
  );
};

export default AutoCreateLayersCheckbox;
