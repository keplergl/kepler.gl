// Copyright (c) 2021 Uber Technologies, Inc.
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

import React, {Component, useCallback} from 'react';

import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import {FormattedMessage} from 'localization';

import SourceDataCatalogFactory from './common/source-data-catalog';
import LayerListFactory from './layer-panel/layer-list';
import {Add} from 'components/common/icons';
import ItemSelector from 'components/common/item-selector/item-selector';
import {
  Button,
  PanelLabel,
  SidePanelDivider,
  SidePanelSection
} from 'components/common/styled-components';

import {LAYER_BLENDINGS} from 'constants/default-settings';

const LayerBlendingSelector = ({layerBlending, updateLayerBlending, intl}) => {
  const labeledLayerBlendings = Object.keys(LAYER_BLENDINGS).reduce(
    (acc, current) => ({
      ...acc,
      [intl.formatMessage({id: LAYER_BLENDINGS[current].label})]: current
    }),
    {}
  );

  const onChange = useCallback(blending => updateLayerBlending(labeledLayerBlendings[blending]), [
    updateLayerBlending,
    labeledLayerBlendings
  ]);

  return (
    <SidePanelSection>
      <PanelLabel>
        <FormattedMessage id="layerBlending.title" />
      </PanelLabel>
      <ItemSelector
        selectedItems={intl.formatMessage({id: LAYER_BLENDINGS[layerBlending].label})}
        options={Object.keys(labeledLayerBlendings)}
        multiSelect={false}
        searchable={false}
        onChange={onChange}
      />
    </SidePanelSection>
  );
};

export function AddDataButtonFactory() {
  const AddDataButton = ({onClick, isInactive}) => (
    <Button
      className="add-data-button"
      onClick={onClick}
      isInactive={!isInactive}
      width="105px"
      secondary
    >
      <Add height="12px" />
      <FormattedMessage id={'layerManager.addData'} />
    </Button>
  );

  return AddDataButton;
}

LayerManagerFactory.deps = [AddDataButtonFactory, LayerListFactory, SourceDataCatalogFactory];

function LayerManagerFactory(AddDataButton, LayerList, SourceDataCatalog) {
  class LayerManager extends Component {
    static propTypes = {
      datasets: PropTypes.object.isRequired,
      layerBlending: PropTypes.string.isRequired,
      layerClasses: PropTypes.object.isRequired,
      layers: PropTypes.arrayOf(PropTypes.any).isRequired,
      visStateActions: PropTypes.object.isRequired,
      // functions
      removeDataset: PropTypes.func.isRequired,
      showDatasetTable: PropTypes.func.isRequired,
      updateTableColor: PropTypes.func.isRequired
    };

    _addEmptyNewLayer = () => {
      const {visStateActions} = this.props;
      visStateActions.addLayer();
    };

    render() {
      const {
        layers,
        datasets,
        intl,
        layerOrder,
        showAddDataModal,
        updateTableColor,
        showDatasetTable,
        removeDataset,
        uiStateActions,
        visStateActions
      } = this.props;

      const defaultDataset = Object.keys(datasets)[0];

      return (
        <div className="layer-manager">
          <SourceDataCatalog
            datasets={datasets}
            showDatasetTable={showDatasetTable}
            updateTableColor={updateTableColor}
            removeDataset={removeDataset}
            showDeleteDataset
          />
          <AddDataButton onClick={showAddDataModal} isInactive={!defaultDataset} />
          <SidePanelDivider />
          <SidePanelSection>
            <LayerList
              layers={layers}
              datasets={datasets}
              layerOrder={layerOrder}
              uiStateActions={uiStateActions}
              visStateActions={visStateActions}
              layerClasses={this.props.layerClasses}
              isSortable
            />
          </SidePanelSection>
          <SidePanelSection>
            {defaultDataset ? (
              <Button className="add-layer-button" onClick={this._addEmptyNewLayer} width="105px">
                <Add height="12px" />
                <FormattedMessage id={'layerManager.addLayer'} />
              </Button>
            ) : null}
          </SidePanelSection>
          <LayerBlendingSelector
            layerBlending={this.props.layerBlending}
            updateLayerBlending={visStateActions.updateLayerBlending}
            intl={intl}
          />
        </div>
      );
    }
  }
  return injectIntl(LayerManager);
}

export default LayerManagerFactory;
