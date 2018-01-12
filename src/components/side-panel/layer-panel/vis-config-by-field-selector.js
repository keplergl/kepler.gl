import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {PanelLabel, SidePanelSection} from 'components/common/styled-components';
import FieldSelector from 'components/common/field-selector';
import InfoHelper from 'components/common/info-helper';
import DimensionScaleSelector from './dimension-scale-selector';
import {capitalizeFirstLetter} from 'utils/utils';

const propTypes = {
  channel: PropTypes.string.isRequired,
  domain: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  innerPanelWidth: PropTypes.number.isRequired,
  property: PropTypes.string.isRequired,
  range: PropTypes.any.isRequired,
  scaleType: PropTypes.string.isRequired,
  showScale: PropTypes.bool.isRequired,
  updateField: PropTypes.func.isRequired,
  updateScale: PropTypes.func.isRequired,

  // optional
  selectedField: PropTypes.object,
  description: PropTypes.string,
  label: PropTypes.string
};

export default class VisConfigByFieldSelector extends Component {

  _updateVisByField = (val) => {
    this.props.updateField(val);
  };

  render() {
    const {property, showScale, selectedField, description, scaleOptions = []} = this.props;

    return (
      <SidePanelSection>
        <div>
          <PanelLabel>{this.props.label ||
          `${capitalizeFirstLetter(property)} based on`}</PanelLabel>
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
