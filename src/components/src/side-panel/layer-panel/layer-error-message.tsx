// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

import {FormattedMessage} from '@kepler.gl/localization';

const LayerErrorMessageContent = styled.div.attrs({
  className: 'layer-error-message-content'
})`
  background-color: ${props => props.theme.notificationColors.error || '#000'};
  color: #fff;
  display: block;
  width: 100%;
  font-size: 11px;
  padding: 1em;
  border-radius: 4px;
`;

type LayerErrorMessageProps = {
  errorMessage: string;
};

const LayerErrorMessage: React.FC<LayerErrorMessageProps> = ({errorMessage}) => {
  return (
    <LayerErrorMessageContent>
      <FormattedMessage id={'layer.layerUpdateError'} values={{errorMessage}} />
    </LayerErrorMessageContent>
  );
};

export default LayerErrorMessage;
