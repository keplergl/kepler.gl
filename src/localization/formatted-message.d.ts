import React from 'react';

declare type FormattedMessageType = {
  id: string;
  defaultMessage?: string;
  defaultValue?: string;
  values?: {
    [key: string]: string | number;
  };
  children?: () => React.ReactElement;
};

declare const EnhancedFormattedMessage: React.FC<FormattedMessageType>;

export default EnhancedFormattedMessage;
