// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Datasets} from '@kepler.gl/table';
import AddByDatasetButton from '../add-by-dataset-button';

export type AddFilterButtonProps = {
  datasets: Datasets;
  onAdd: (dataId: string) => void;
};

function AddFilterButtonFactory() {
  const AddFilterButton: React.FC<AddFilterButtonProps> = ({datasets, onAdd}) => {
    return (
      <AddByDatasetButton
        datasets={datasets}
        className="add-filter-button"
        width="105px"
        onAdd={onAdd}
        buttonIntlId="filterManager.addFilter"
      />
    );
  };

  return AddFilterButton;
}

export default AddFilterButtonFactory;
