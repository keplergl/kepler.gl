// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled from 'styled-components';

import SourceDataCatalogFactory from '../common/source-data-catalog';
import LayerListFactory from './layer-list';
import {Layer, LayerClassesType} from '@kepler.gl/layers';
import {UIStateActions, ActionHandler, VisStateActions, MapStateActions} from '@kepler.gl/actions';
import {KeplerTable, Datasets} from '@kepler.gl/table';
import {getApplicationConfig} from '@kepler.gl/utils';

type DatasetLayerSectionProps = {
  datasets: Datasets;
  dataset: KeplerTable;
  layers: Layer[];
  layerOrder: string[];
  layerClasses: LayerClassesType;
  showDeleteDataset: boolean;
  showDatasetTable: ActionHandler<typeof VisStateActions.showDatasetTable>;
  updateTableColor: ActionHandler<typeof VisStateActions.updateTableColor>;
  removeDataset: ActionHandler<typeof UIStateActions.openDeleteModal>;
  uiStateActions: typeof UIStateActions;
  visStateActions: typeof VisStateActions;
  mapStateActions: typeof MapStateActions;
};

const DatasetLayerSectionWrapper = styled.div.attrs({
  className: 'dataset-layer-section'
})`
  margin-bottom: 16px;
`;

DatasetLayerSectionFactory.deps = [SourceDataCatalogFactory, LayerListFactory];

function DatasetLayerSectionFactory(
  SourceDataCatalog: ReturnType<typeof SourceDataCatalogFactory>,
  LayerList: ReturnType<typeof LayerListFactory>
) {
  const DatasetLayerSection: React.FC<DatasetLayerSectionProps> = props => {
    const {
      dataset,
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

    const datasetCatalog = useMemo(() => {
      return {[dataset.id]: dataset};
    }, [dataset]);

    // temp patch to hide layers that are in development
    const enableRasterTileLayer = getApplicationConfig().enableRasterTileLayer;
    const enableWMSLayer = getApplicationConfig().enableWMSLayer;
    const filteredLayerClasses = useMemo(() => {
      let filteredClasses = layerClasses;
      if (!enableRasterTileLayer) {
        const {rasterTile: _rasterTile, ...rest} = filteredClasses;
        filteredClasses = rest as LayerClassesType;
      }
      if (!enableWMSLayer) {
        const {wms: _wms, ...rest} = filteredClasses;
        filteredClasses = rest as LayerClassesType;
      }
      return filteredClasses as LayerClassesType;
    }, [enableRasterTileLayer, enableWMSLayer, layerClasses]);

    return (
      <DatasetLayerSectionWrapper>
        <SourceDataCatalog
          datasets={datasetCatalog}
          showDatasetTable={showDatasetTable}
          updateTableColor={updateTableColor}
          removeDataset={removeDataset}
          showDeleteDataset={showDeleteDataset}
        />
        <LayerList
          datasets={datasets}
          layerOrder={layerOrder}
          layers={layers}
          layerClasses={filteredLayerClasses}
          uiStateActions={uiStateActions}
          visStateActions={visStateActions}
          mapStateActions={mapStateActions}
          isSortable={false}
        />
      </DatasetLayerSectionWrapper>
    );
  };

  return DatasetLayerSection;
}

export default DatasetLayerSectionFactory;
