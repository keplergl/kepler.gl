import React from 'react';
import {MapControls} from '../../reducers';

export type LocalePanelProps = {
  availableLocales: ReadonlyArray<string>;
  onSetLocale: (locale: string) => void;
  locale: string;
  onToggleMapControl: (control: string) => void;
  mapControls: MapControls;
};

export type LocalePanelComponent = React.FunctionComponent<LocalePanelProps>;
