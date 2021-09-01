import {Layer} from '../layers';
import {SplitMapLayers} from '../reducers/vis-state-updaters';
import React from 'react';

export function prepareLayersToRender(
  layers: Layer[],
  layerData: any[],
  mapLayers: SplitMapLayers | undefined
): {[id: string]: boolean};

export type MapContainerProps = {
  // TODO
  primary: boolean;
};

export default function MapContainerFactory(): React.Component<MapContainerProps>;

export const Attribution: React.FC<{}>;
