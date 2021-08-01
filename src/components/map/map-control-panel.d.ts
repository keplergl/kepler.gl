import React from 'react';

export type MapControlPanelProps = {
  header?: string;
  scale?: number;
  onClick: () => void;
  isExport?: boolean;
  logoComponent?: Element;
};

export type MapControlPanelComponent = React.FunctionComponent<MapControlPanelProps>;
