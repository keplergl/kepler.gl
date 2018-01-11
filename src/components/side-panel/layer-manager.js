import React, {Component} from 'react';
import Sortable from 'react-anything-sortable';
import styled from 'styled-components';

import LayerPanel from './layer-panel/layer-panel';
import SourceDataCatalog from './source-data-catalog';
import {Add} from '../common/icons';
import ItemSelector from '../common/item-selector/item-selector';
import {PanelLabel, SidePanelDivider, SidePanelSection, Button} from '../common/styled-components';

import {LAYER_BLENDINGS} from '../../constants/default-settings';

const propTypes = {
  addLayer: React.PropTypes.func.isRequired,
  panelWidth: React.PropTypes.number.isRequired,
  datasets: React.PropTypes.object.isRequired,
  layerBlending: React.PropTypes.string.isRequired,
  layers: React.PropTypes.array.isRequired,
  layerConfigChange: React.PropTypes.func.isRequired,
  layerVisualChannelConfigChange: React.PropTypes.func.isRequired,
  layerTypeChange: React.PropTypes.func.isRequired,
  layerVisConfigChange: React.PropTypes.func.isRequired,
  openModal: React.PropTypes.func.isRequired,
  removeLayer: React.PropTypes.func.isRequired,
  removeDataset: React.PropTypes.func.isRequired,
  showDatasetTable: React.PropTypes.func.isRequired,
  updateLayerBlending: React.PropTypes.func.isRequired,
  updateLayerOrder: React.PropTypes.func.isRequired
};

const StyledSortable = styled.div`
   .ui-sortable {
    display: block;
    position: relative;
    overflow: visible;
    user-select: none;

    :before {
      content: " ";
      display: table
    };
    
    :after {
      content: " ";
      display: table
    }
  };

   .ui-sortable-item.ui-sortable-dragging {
    position: absolute;
    z-index: 1688;
    cursor: move
  };

   .ui-sortable-item.ui-sortable-dragging:hover {
    cursor: move;
    opacity: 0.5
  };

   .ui-sortable-placeholder {
    display: none
  };

   .ui-sortable-placeholder.visible {
    display: block;
    opacity: 0;
    z-index: -1
  }
`;

export default class LayerManager extends Component {

  _addEmptyNewLayer = () => {
    this.props.addLayer();
  };

  _handleSort = (order) => {
    this.props.updateLayerOrder(order);
  };

  render() {
    const {layers, datasets, layerOrder, panelWidth, openModal} = this.props;
    const defaultDataset = Object.keys(datasets)[0];

    const layerActions = {
      layerConfigChange: this.props.layerConfigChange,
      layerVisualChannelConfigChange: this.props.layerVisualChannelConfigChange,
      layerTypeChange: this.props.layerTypeChange,
      layerVisConfigChange: this.props.layerVisConfigChange,
      removeLayer: this.props.removeLayer
    };

    const panelProps = {datasets, panelWidth, openModal};

    return (
      <StyledSortable>
        <SourceDataCatalog
          datasets={datasets}
          showDatasetTable={this.props.showDatasetTable}
          removeDataset={this.props.removeDataset}
          showDeleteDataset/>
        <Button
          onClick={this.props.showAddDataModal}
          isInactive={!defaultDataset}
          width="105px"
          secondary
        >
          <Add height="12px"/>Add Data</Button>
        <SidePanelDivider/>
        <SidePanelSection>
        <Sortable onSort={this._handleSort}
                  direction="vertical"
                  sortHandle="sort--handle"
                  dynamic>
          {layerOrder.map(idx => (
            <LayerPanel
              {...panelProps}
              {...layerActions}
              sortData={idx}
              key={layers[idx].id}
              idx={idx}
              layer={layers[idx]}/>
          ))}
        </Sortable>
        </SidePanelSection>
        <SidePanelSection>
        {defaultDataset ? <Button
          onClick={this._addEmptyNewLayer}
          width="105px">
          <Add height="12px"/>Add Layer
        </Button> : null}
        </SidePanelSection>
        <LayerBlendingSelector
          layerBlending={this.props.layerBlending}
          updateLayerBlending={this.props.updateLayerBlending}/>
      </StyledSortable>
    );
  }
}

LayerManager.propTypes = propTypes;

const LayerBlendingSelector = ({layerBlending, updateLayerBlending}) => (
  <SidePanelSection>
    <PanelLabel>Layer Blending</PanelLabel>
    <ItemSelector
      selectedItems={layerBlending}
      options={Object.keys(LAYER_BLENDINGS)}
      multiSelect={false}
      searchable={false}
      onChange={updateLayerBlending}
    />
  </SidePanelSection>
);
