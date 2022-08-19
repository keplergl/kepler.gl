// Copyright (c) 2022 Uber Technologies, Inc.
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
import styled from 'styled-components';

import SourceDataCatalogFactory from '../common/source-data-catalog';
import LayerListFactory from './layer-list';
import {Layer, LayerClassesType} from '@kepler.gl/layers';
import {KeplerTable} from '../../../utils';
import * as UiStateActions from 'actions/ui-state-actions';
import * as VisStateActions from 'actions/vis-state-actions';
import {ActionHandler} from 'actions';

type DatasetLayerSectionProps = {
  dataset: KeplerTable;
  layers: Layer[];
  layerOrder: number[];
  layerClasses: LayerClassesType;
  showDeleteDataset: boolean;
  showDatasetTable: ActionHandler<typeof VisStateActions.showDatasetTable>;
  updateTableColor: ActionHandler<typeof VisStateActions.updateTableColor>;
  removeDataset: ActionHandler<typeof UiStateActions.openDeleteModal>;
  uiStateActions: typeof UiStateActions;
  visStateActions: typeof VisStateActions;
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

    const datasets = useMemo(() => {
      return {[dataset.id]: dataset};
    }, [dataset]);

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
