import {FunctionComponent} from 'react';

export type ProgressBarProps = {
  percent: string,
  height?: number,
  isLoading: boolean,
  barColor: any;
  trackColor?: any;
  theme: object;
};

const ProgressBar: FunctionComponent<ProgressBarProps>;
export default ProgressBar;
