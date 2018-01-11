import React from 'react';

import {ReactBaseComponent} from '../../../utils/react-utils';

import {PanelLabel, SidePanelSection} from '../../common/styled-components';
import FieldSelector from '../../common/field-selector';
import InfoHelper from '../../common/info-helper';
import DimensionScaleSelector from './dimension-scale-selector';

const propTypes = {
  channel: React.PropTypes.string.isRequired,
  domain: React.PropTypes.array.isRequired,
  fields: React.PropTypes.array.isRequired,
  id: React.PropTypes.string.isRequired,
  innerPanelWidth: React.PropTypes.number.isRequired,
  property: React.PropTypes.string.isRequired,
  range: React.PropTypes.any.isRequired,
  scaleType: React.PropTypes.string.isRequired,
  showScale: React.PropTypes.bool.isRequired,
  updateField: React.PropTypes.func.isRequired,
  updateScale: React.PropTypes.func.isRequired,

  // optional
  selectedField: React.PropTypes.object,
  description: React.PropTypes.string,
  label: React.PropTypes.string
};

export default class VisConfigByFieldSelector extends ReactBaseComponent {

  _updateVisByField(val) {
    this.props.updateField(val);
  }

  render() {
    const {property, showScale, selectedField, description, scaleOptions = []} = this.props;

    return (
      <SidePanelSection>
        <div>
          <PanelLabel>{this.props.label ||
          `${property.capitalizeFirstLetter()} based on`}</PanelLabel>
          {description && <InfoHelper
            description={description} id={`${this.props.id}-${property}`}
          />}
        </div>
        <div>
          <FieldSelector
            fields={this.props.fields}
            value={selectedField && selectedField.name}
            onSelect={this._updateVisByField}
            erasable
          />
          {showScale ? <DimensionScaleSelector
            scaleType={this.props.scaleType}
            options={scaleOptions}
            label={`${property} scale`}
            onSelect={this.props.updateScale}
            disabled={scaleOptions.length < 2}
          /> : null}
        </div>
      </SidePanelSection>
    );
  }
}

VisConfigByFieldSelector.propTypes = propTypes;
