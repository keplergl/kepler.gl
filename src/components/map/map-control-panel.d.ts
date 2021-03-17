import React from 'react';

export type MapControlPanelProps = {
  header?: string;
  scale?: number;
  onClick: () => void;
  onPinClick?: () => void;
  pinnable?: boolean;
  disableClose?: boolean;
  isExport?: boolean;
  logoComponent?: Element;
};

export type MapControlPanelComponent = React.FunctionComponent<MapControlPanelProps>;
