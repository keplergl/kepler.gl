import React, {useMemo} from 'react';

import {convertArrayToObjectByIndex} from 'utils/utils';

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
    // since getting the ordered array of layers will get them in correct order
    const datasetLayerSectionData = useMemo(() => {
      // Layers array converted to an object with indexes as keys
      const layersMap = convertArrayToObjectByIndex(layers);
      // Order layer objects in correct global layer order
      const orderedLayersArr = layerOrder.map(layer => layersMap[layer]);

      // Returns an array of all necessary data for each dataset to be displayed
      // dataset and dataset layers
      return Object.values(datasets).map(dataset => {
        // Extract layers for a dataset
        // since we are extracting the layers from already ordered layers
        // we know that the natural order of items in that array will be the correct
        // order of layers to be displayed
        const datasetLayersMap = orderedLayersArr.filter(
          layer => layer.config.dataId === dataset.id
        );
        const datasetLayers = Object.values(datasetLayersMap);

        return {dataset, datasetLayers};
      });
    }, [datasets, layers, layerOrder]);

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
