// Copyright (c) 2018 Uber Technologies, Inc.
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

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
  PanelLabel,
  PanelLabelWrapper,
  SidePanelSection
} from 'components/common/styled-components';
import FieldSelector from 'components/common/field-selector';
import InfoHelper from 'components/common/info-helper';
import DimensionScaleSelector from './dimension-scale-selector';
import {capitalizeFirstLetter} from 'utils/utils';

export default class VisConfigByFieldSelector extends Component {
  static propTypes = {
    channel: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(PropTypes.any).isRequired,
    id: PropTypes.string.isRequired,
    property: PropTypes.string.isRequired,
    showScale: PropTypes.bool.isRequired,
    updateField: PropTypes.func.isRequired,
    updateScale: PropTypes.func.isRequired,

    // optional
    scaleType: PropTypes.string,
    selectedField: PropTypes.object,
    description: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string
  };

  _updateVisByField = val => {
    this.props.updateField(val);
  };

  render() {
    const {
      property,
      showScale,
      selectedField,
      description,
      scaleOptions = []
    } = this.props;

    return (
      <SidePanelSection>
        <SidePanelSection>
          <PanelLabelWrapper>
            <PanelLabel>
              {this.props.label || `${capitalizeFirstLetter(property)} based on`}
            </PanelLabel>
            {description && (
              <InfoHelper
                description={description}
                id={`${this.props.id}-${property}`}
              />
            )}
          </PanelLabelWrapper>
          <FieldSelector
            fields={this.props.fields}
            value={selectedField && selectedField.name}
            placeholder={this.props.placeholder}
            onSelect={this._updateVisByField}
            erasable
          />
        </SidePanelSection>
        <div>
          {showScale ? (
            <DimensionScaleSelector
              scaleType={this.props.scaleType}
              options={scaleOptions}
              label={`${property} scale`}
              onSelect={this.props.updateScale}
              disabled={scaleOptions.length < 2}
            />
          ) : null}
        </div>
      </SidePanelSection>
    );
  }
};
