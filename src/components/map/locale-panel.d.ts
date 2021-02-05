import React from 'react';
import {MapControls} from '../../reducers';

export type LocalePanelProps = {
  availableLocales: ReadnlyArray<string>;
  onSetLocale: (locale: string) => void;
  locale: string;
  onToggleMenuPanel: () => void;
  mapControls: MapControls;
};

export type LocalePanelComponent = React.FunctionComponent<LocalePanelProps>;
