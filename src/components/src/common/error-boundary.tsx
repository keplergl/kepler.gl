// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ErrorInfo} from 'react';
import console from 'global/console';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true, error};
  }
  state = {hasError: false};
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
