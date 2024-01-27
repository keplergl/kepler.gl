// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import ErrorBoundary from '../common/error-boundary';
import NotificationItemFactory from '../notification-panel/notification-item';
const NotificationItem = NotificationItemFactory();

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({error}) => {
  const notification = useMemo(
    () => ({
      type: 'error',
      message: error,
      id: 'cloud-export-error'
    }),
    [error]
  );

  return (
    <ErrorBoundary>
      <NotificationItem notification={notification} isExpanded />
    </ErrorBoundary>
  );
};

export default ErrorDisplay;
