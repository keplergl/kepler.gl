import React from 'react';
import styled from 'styled-components';

import SourceDataCatalogFactory from '../common/source-data-catalog';
import LayerListFactory from './layer-list';

const DatasetLayerSectionWrapper = styled.div`
  margin-bottom: 16px;
`;

DatasetLayerSectionFactory.deps = [SourceDataCatalogFactory, LayerListFactory];

function DatasetLayerSectionFactory(SourceDataCatalog, LayerList) {
  const DatasetLayerSection = props => {
    const {
      dataset,
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

    const datasets = {[dataset.id]: dataset};

    return (
      <DatasetLayerSectionWrapper>
        <SourceDataCatalog
          datasets={datasets}
          showDatasetTable={showDatasetTable}
          updateTableColor={updateTableColor}
          removeDataset={removeDataset}
          showDeleteDataset={showDeleteDataset}
        />
        <LayerList
          datasets={datasets}
          layerOrder={layerOrder}
          layers={layers}
          layerClasses={layerClasses}
          uiStateActions={uiStateActions}
          visStateActions={visStateActions}
          isSortable={false}
        />
      </DatasetLayerSectionWrapper>
    );
  };

  return DatasetLayerSection;
}

export default DatasetLayerSectionFactory;
