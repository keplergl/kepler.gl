import React from 'react';
import {Datasets} from 'reducers/vis-state-updaters';

export type AddLayerButtonProps = {
  datasets: Datasets;
  onOptionSelected: (dataset, event) => {}
};

export default function AddLayerButtonFactory(): React.Component<AddLayerButtonProps>;
