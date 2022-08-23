// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {useMemo} from 'react';

import DatasetLayerSectionFactory from './dataset-layer-section';
import {Layer, LayerClassesType} from '@kepler.gl/layers';
import {UIStateActions, VisStateActions, ActionHandler} from '@kepler.gl/actions';
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
      visStateActions
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
          />
        ))}
      </>
    );
  };

  return DatasetLayerGroup;
}

export default DatasetLayerGroupFactory;
