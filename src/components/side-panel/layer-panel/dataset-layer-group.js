import React, {useMemo} from 'react';

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

    const datasetLayerSectionData = useMemo(() => {
      return Object.values(datasets).map(dataset => {
        // Global layer order will contain the correct order of layers
        // We just empty the positions in layers array (for each dataset)
        // where the layer doesn't belong to a dataset and set it to null
        const datasetLayers = layers.map(layer =>
          layer.config.dataId === dataset.id ? layer : null
        );

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
