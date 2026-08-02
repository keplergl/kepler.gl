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
  children?: (chunks: React.ReactNode[]) => React.ReactElement;
};

const EnhancedFormattedMessage: React.FC<EnhancedFormattedMessageProps> = props => (
  <FormattedMessage
    // Use id as default Message to prevent error being thrown
    defaultMessage={props.defaultMessage || props.id}
    id={props.id}
    values={props.values ?? undefined}
    {...(props.children ? {children: props.children as any} : {})}
  />
);

export default EnhancedFormattedMessage;
