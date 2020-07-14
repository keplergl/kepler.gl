import React from 'react';
import {LoaderObject} from '@loaders.gl/loader-utils';

export type KeplerGlProps = {
  mapStyles: object[];
  mapStylesReplaceDefault: boolean;
  mapboxApiUrl: string;
  width: number;
  height: number;
  appName: string;
  version: string;
  sidePanelWidth: number;
  theme: object;
  cloudProviders: object[];
};

export default function KeplerGlFactory(): React.Component<KeplerGlProps>;
