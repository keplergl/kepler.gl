import React, {useMemo} from 'react';

import {convertArrayToObjectByIndex, filterObjectByPredicate} from 'utils/utils';

import DatasetLayerSectionFactory from './dataset-layer-section';

DatasetLayerGroupFactory.deps = [DatasetLayerSectionFactory];

function DatasetLayerGroupFactory(DatasetLayerSection) {
  const DatasetLayerGroup = props => {
    const {
      datasets,
      showDatasetTable,
      layers,
      updateTableColor,
      showDeleteDataset,
      removeDataset,
      layerOrder,
      layerClasses,
      uiStateActions,
      visStateActions
    } = props;

    // Extracting the layer order for layers of each dataset is not necessary
    // since the global layer order will be passed down to LayerList component
    // this means the order will be kept when rendering the layers
    const datasetLayerSectionData = useMemo(() => {
      // Layers array converted to an object with indexes as keys
      const layersMap = convertArrayToObjectByIndex(layers);
      // Returns an array of all necessary data for each dataset to be displayed
      // dataset and dataset layers
      return Object.values(datasets).map(dataset => {
        // Extract layers for a dataset
        const datasetLayersMap = filterObjectByPredicate(
          layersMap,
          (key, value) => value.config.dataId === dataset.id
        );
        const datasetLayers = Object.values(datasetLayersMap);

        return {dataset, datasetLayers};
      });
    }, [datasets, layers]);

    return datasetLayerSectionData.map(dlsData => (
      <DatasetLayerSection
        key={dlsData.dataset.id}
        dataset={dlsData.dataset}
        layers={dlsData.datasetLayers}
        showDatasetTable={showDatasetTable}
        updateTableColor={updateTableColor}
        showDeleteDataset={showDeleteDataset}
        removeDataset={removeDataset}
        layerOrder={layerOrder}
        layerClasses={layerClasses}
        uiStateActions={uiStateActions}
        visStateActions={visStateActions}
      />
    ));
  };

  return DatasetLayerGroup;
}

export default DatasetLayerGroupFactory;
