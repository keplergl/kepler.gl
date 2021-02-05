import React from 'react';

export type MapControlPanelProps = {
  children: Element;
  header?: string;
  scale?: number;
  onClick: () => void;
  isExport?: boolean;
  logoComponent?: Element;
};

export type MapControlPanelComponent = React.FunctionComponent<MapControlPanelProps>;
