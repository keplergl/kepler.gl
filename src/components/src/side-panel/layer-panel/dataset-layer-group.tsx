// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';

import DatasetLayerSectionFactory from './dataset-layer-section';
import {Layer, LayerClassesType} from '@kepler.gl/layers';
import {UIStateActions, VisStateActions, ActionHandler, MapStateActions} from '@kepler.gl/actions';
import {KeplerTable, Datasets} from '@kepler.gl/table';

type DatasetLayerGroupProps = {
  datasets: Datasets;
  layers: Layer[];
  layerOrder: string[];
  layerClasses: LayerClassesType;
  showDeleteDataset: boolean;
  removeDataset: ActionHandler<typeof UIStateActions.openDeleteModal>;
  showDatasetTable: ActionHandler<typeof VisStateActions.showDatasetTable>;
  updateTableColor: ActionHandler<typeof VisStateActions.updateTableColor>;
  uiStateActions: typeof UIStateActions;
  visStateActions: typeof VisStateActions;
  mapStateActions: typeof MapStateActions;
};

DatasetLayerGroupFactory.deps = [DatasetLayerSectionFactory];

function DatasetLayerGroupFactory(
  DatasetLayerSection: ReturnType<typeof DatasetLayerSectionFactory>
) {
  const DatasetLayerGroup: React.FC<DatasetLayerGroupProps> = props => {
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
      visStateActions,
      mapStateActions
    } = props;

    const datasetLayerSectionData = useMemo(() => {
      return Object.values(datasets).map((dataset: KeplerTable) => {
        // Global layer order will contain the correct order of layers
        // We just empty the positions in layers array (for each dataset)
        // where the layer doesn't belong to a dataset and set it to null
        const datasetLayers = layers
          .map(layer => (layer.config.dataId === dataset.id ? layer : null))
          .filter(layer => Boolean(layer));

        return {dataset, datasetLayers};
      });
    }, [datasets, layers]);

    return (
      <>
        {datasetLayerSectionData.map(dlsData => (
          <DatasetLayerSection
            key={dlsData.dataset.id}
            dataset={dlsData.dataset}
            layers={dlsData.datasetLayers as Layer[]}
            datasets={datasets}
            showDatasetTable={showDatasetTable}
            updateTableColor={updateTableColor}
            showDeleteDataset={showDeleteDataset}
            removeDataset={removeDataset}
            layerOrder={layerOrder}
            layerClasses={layerClasses}
            uiStateActions={uiStateActions}
            visStateActions={visStateActions}
            mapStateActions={mapStateActions}
          />
        ))}
      </>
    );
  };

  return DatasetLayerGroup;
}

export default DatasetLayerGroupFactory;
