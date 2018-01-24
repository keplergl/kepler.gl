import React, {Component, PropTypes} from 'react';
import styled from 'styled-components';

import {LAYER_TYPES} from 'constants/default-settings';
import FieldSelector from 'components/common/field-selector';
import ItemSelector from 'components/common/item-selector/item-selector';
import {Docs} from 'components/common/icons';

import {
  PanelLabel,
  SidePanelSection
} from 'components/common/styled-components';

const propTypes = {
  layer: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  updateLayerConfig: PropTypes.func.isRequired,
  updateLayerType: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  fieldPairs: PropTypes.array
};

const typeOptions = Object.keys(LAYER_TYPES);

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default class LayerColumnConfig extends Component {
  _updateColumn(key, value) {
    const {layer} = this.props;

    const columns =
      value.pair && layer.columnPairs
        ? layer.assignColumnPairs(key, value.pair)
        : layer.assignColumn(key, value);

    this.props.updateLayerConfig({columns});
  }

  render() {
    const {layer, fields, fieldPairs} = this.props;
    return (
      <div>
        <SidePanelSection>
          <TypeSelector layer={layer} onSelect={this.props.updateLayerType} />
        </SidePanelSection>
        <SidePanelSection>
          <div className="layer-config__column">
          <TopRow>
            <PanelLabel>Columns</PanelLabel>
            <PanelLabel>* Required</PanelLabel>
          </TopRow>
          {Object.keys(layer.config.columns).map(key => (
            <ColumnSelector
              column={layer.config.columns[key]}
              label={key}
              key={key}
              allFields={fields}
              fieldPairs={
                layer.columnPairs
                  ? fieldPairs.map(fp => ({
                      name: fp.defaultName,
                      type: 'point',
                      pair: fp.pair
                    }))
                  : null
              }
              onSelect={val => this._updateColumn(key, val)}
            />
          ))}
          {layer.type === LAYER_TYPES.icon && (
            <IconLayerInfo openModal={this.props.openModal} />
          )}
          </div>
        </SidePanelSection>
      </div>
    );
  }
}

LayerColumnConfig.propTypes = propTypes;

const ColumnRow = styled.div`
  display: flex;
  margin-bottom: 8px;
  align-items: center;
`;

const ColumnName = styled.div`
  width: 30%;
`;
const ColumnSelect = styled.div`
  width: 70%;
`;

const ColumnSelector = ({column, label, allFields, onSelect, fieldPairs}) => (
  <ColumnRow className="layer-config__column__selector">
    <ColumnName className="layer-config__column__name">
      <PanelLabel>{label}</PanelLabel>
      {!column.optional ? <PanelLabel>{`  *`}</PanelLabel> : null}
    </ColumnName>
    <ColumnSelect className="layer-config__column__select">
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
  <div className="layer-config__type">
    <PanelLabel>Layer type</PanelLabel>
    <ItemSelector
      selectedItems={layer.type}
      options={typeOptions}
      multiSelect={false}
      placeholder="Select A Type"
      onChange={onSelect}
    />
  </div>
);

const LayerInstruction = styled.div`
  display: flex;
  justify-content: flex-end;
  color: ${props => props.theme.textColor};

  :hover {
    cursor: pointer;
    color: ${props => props.theme.textColorHL};
  }
`;

const InfoIcon = styled.div`
  margin-right: 4px;
`;

const IconLayerInfo = ({openModal}) => (
  <LayerInstruction className="layer-config__info"
    onClick={() => openModal('iconInfo')}>
    <InfoIcon><Docs height="16px"/></InfoIcon>
    <PanelLabel>How to draw icon layer</PanelLabel>
  </LayerInstruction>
);
