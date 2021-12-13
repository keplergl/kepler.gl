import React from 'react';
import {Layer, LayerClassesType} from 'layers';
import {Datasets} from 'reducers/vis-state-updaters';
import * as VisStateActions from 'actions/vis-state-actions';
import * as UIStateActions from 'actions/ui-state-actions';

export type LayerListProps = {
  datasets: Datasets;
  layerClasses: LayerClassesType;
  layers: Layer[];
  layerOrder: number[];
  uiStateActions: typeof UIStateActions;
  visStateActions: typeof VisStateActions;
  isSortable: Boolean;
};

export default function LayerListFactory(
  LayerPanel: React.Component
): React.Component<LayerListProps>;
