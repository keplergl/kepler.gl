import React from 'react';

export type ProgressBarProps = {
  percent: string,
  height?: number,
  isLoading: boolean,
  barColor: any;
  trackColor?: any;
  theme: object;
};

const ProgressBar: React.FunctionCompoment<ProgressBarProps>;
export default ProgressBar;
