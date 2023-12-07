// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import {FormattedMessage, injectIntl, WrappedComponentProps} from 'react-intl';

import {Field} from '@kepler.gl/types';

import {PanelLabel, PanelLabelWrapper, SidePanelSection} from '../../common/styled-components';
import InfoHelperFactory from '../../common/info-helper';
import DimensionScaleSelector from './dimension-scale-selector';
import {camelize} from '@kepler.gl/utils';
import FieldSelectorFactory from '../../common/field-selector';

type VisConfigByFieldSelectorProps = {
  channel: string;
  fields: Field[];
  id: string;
  property: string;
  showScale: boolean;
  updateField: (
    val: readonly (string | number | boolean | object)[] | string | number | boolean | object | null
  ) => void;
  updateScale: (
    val: readonly (string | number | boolean | object)[] | string | number | boolean | object | null
  ) => void;
  scaleType?: string;
  selectedField?: Field;
  description?: string;
  label?: string;
  placeholder?: string;
  scaleOptions: string[];
} & WrappedComponentProps;

VisConfigByFieldSelectorFactory.deps = [InfoHelperFactory, FieldSelectorFactory];

function VisConfigByFieldSelectorFactory(
  InfoHelper: ReturnType<typeof InfoHelperFactory>,
  FieldSelector: ReturnType<typeof FieldSelectorFactory>
) {
  class VisConfigByFieldSelector extends Component<VisConfigByFieldSelectorProps> {
    _updateVisByField = (
      val:
        | readonly (string | number | boolean | object)[]
        | string
        | number
        | boolean
        | object
        | null
    ) => {
      this.props.updateField(val);
    };

    render() {
      const {
        property,
        showScale,
        selectedField,
        description,
        label,
        intl,
        scaleOptions = []
      } = this.props;

      return (
        <SidePanelSection>
          <SidePanelSection>
            <PanelLabelWrapper>
              <PanelLabel>
                {(label && <FormattedMessage id={label} />) || (
                  <FormattedMessage
                    id="layer.propertyBasedOn"
                    values={{
                      property: intl.formatMessage({
                        id: `property.${camelize(property)}`,
                        defaultMessage: property
                      })
                    }}
                  />
                )}
              </PanelLabel>
              {description && (
                <InfoHelper
                  description={description}
                  property={property}
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
  }
  return injectIntl(VisConfigByFieldSelector);
}

export default VisConfigByFieldSelectorFactory;
