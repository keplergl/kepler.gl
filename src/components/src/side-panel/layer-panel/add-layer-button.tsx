// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import AddByDatasetButton from '../add-by-dataset-button';
import {Datasets} from '@kepler.gl/table';

export type AddLayerButtonProps = {
  datasets: Datasets;
  onAdd: (dataId: string) => void;
};

function AddLayerButtonFactory() {
  const AddLayerButton: React.FC<AddLayerButtonProps> = ({datasets, onAdd}) => {
    return (
      <AddByDatasetButton
        datasets={datasets}
        className="add-layer-button"
        width="110px"
        onAdd={onAdd}
        buttonIntlId="layerManager.addLayer"
      />
    );
  };

  return AddLayerButton;
}
export default AddLayerButtonFactory;
