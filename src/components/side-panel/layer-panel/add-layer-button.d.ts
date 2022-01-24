import React from 'react';
import {Datasets} from 'reducers/vis-state-updaters';
import {IntlShape} from 'react-intl';

export type AddLayerButtonProps = {
  datasets: Datasets;
  onOptionSelected: (dataset) => {};
  typeaheadPlaceholder?: string;
  intl: IntlShape;
};

export default function AddLayerButtonFactory(): React.Component<AddLayerButtonProps>;
