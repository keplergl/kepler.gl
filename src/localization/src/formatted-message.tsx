// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {FormattedMessage} from 'react-intl';

type EnhancedFormattedMessageProps = {
  id: string;
  defaultMessage?: string;
  defaultValue?: string;
  values?: {
    [key: string]: string | number | null;
  };
  children?: () => React.ReactElement;
};

const EnhancedFormattedMessage: React.FC<EnhancedFormattedMessageProps> = props => (
  <FormattedMessage
    // Us id as default Message to prevent error being thrown
    defaultMessage={props.defaultMessage || props.id}
    {...props}
  />
);

export default EnhancedFormattedMessage;
