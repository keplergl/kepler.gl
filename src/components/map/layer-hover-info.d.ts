import {FunctionComponent} from 'react';

export type RowProps = {
  name: string,
  value: string,
  deltaValue?: string | null,
  url?: string
};

export type RowComponent = React.FunctionComponent<RowProps>;

export const StyledLayerName: FunctionComponent<any>;