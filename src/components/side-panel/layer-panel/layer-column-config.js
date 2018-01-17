import React, {Component, PropTypes} from 'react';
import styled from 'styled-components';

import {LAYER_TYPES} from 'constants/default-settings';
import FieldSelector from 'components/common/field-selector';
import ItemSelector from 'components/common/item-selector/item-selector';
import {PanelLabel, SidePanelSection} from 'components/common/styled-components';

const propTypes = {
  layer: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  updateLayerConfig: PropTypes.func.isRequired,
  updateLayerType: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  fieldPairs: PropTypes.array
};

const typeOptions = Object.keys(LAYER_TYPES);

export default class LayerColumnConfig extends Component {
  _updateColumn(key, value) {
    const {layer} = this.props;

    const columns = value.pair && layer.columnPairs ?
      layer.assignColumnPairs(key, value.pair) :
      layer.assignColumn(key, value);

    this.props.updateLayerConfig({columns});
  }

  render() {
    const {layer, fields, fieldPairs} = this.props;
    return (
      <div>
          <SidePanelSection>
            <TypeSelector layer={layer} onSelect={this.props.updateLayerType}/>
          </SidePanelSection>
          <SidePanelSection>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <PanelLabel>Columns</PanelLabel>
              <PanelLabel>* Required</PanelLabel>
            </div>
            {Object.keys(layer.config.columns).map(key => (
              <ColumnSelector
                column={layer.config.columns[key]}
                label={key}
                key={key}
                allFields={fields}
                fieldPairs={layer.columnPairs ? fieldPairs.map(fp => ({
                  name: fp.defaultName,
                  type: 'point',
                  pair: fp.pair
                })) : null}
                onSelect={val => this._updateColumn(key, val)}
              />
            ))}
            {layer.type === LAYER_TYPES.icon && (
              <IconLayerInfo openModal={this.props.openModal} />
            )}
          </SidePanelSection>
      </div>
    );
  }
}

LayerColumnConfig.propTypes = propTypes;

const ColumnRow = styled.div`
  display: flex;
  margin-bottom: 12px;
`;

const ColumnName = styled.div`
  width: 30%;
`;
const ColumnSelect = styled.div`
  width: 70%;
`;

const ColumnSelector = ({column, label, allFields, onSelect, fieldPairs}) => (
  <ColumnRow>
    <ColumnName>
      <PanelLabel>{label}</PanelLabel>
      {!column.optional ? <PanelLabel>{`  *`}</PanelLabel> : null}
    </ColumnName>
    <ColumnSelect>
      <FieldSelector
        suggested={fieldPairs}
        error={!column.optional && !column.value}
        fields={allFields}
        value={column.value}
        erasable={Boolean(column.optional)}
        onSelect={onSelect}
      />
    </ColumnSelect>
  </ColumnRow>
);

const TypeSelector = ({layer, onSelect}) => (
  <div>
    <PanelLabel>layer type</PanelLabel>
    <ItemSelector
      selectedItems={layer.type}
      options={typeOptions}
      multiSelect={false}
      placeholder="Select A Type"
      onChange={onSelect}
    />
  </div>
);

const IconLayerInfo = ({openModal}) => (
  <div>
    <a className="info-link link-btn" onClick={() => openModal('iconInfo')}>
      <i className="icon icon_help push-tiny--right zeta" />
      <span className="small transition--slow">How to draw icon layer</span>
    </a>
  </div>
);
