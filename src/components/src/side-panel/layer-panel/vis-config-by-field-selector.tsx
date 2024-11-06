// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {FormattedMessage, injectIntl, WrappedComponentProps} from 'react-intl';

import {Field} from '@kepler.gl/types';

import {camelize} from '@kepler.gl/utils';
import FieldSelectorFactory from '../../common/field-selector';
import InfoHelperFactory from '../../common/info-helper';
import {PanelLabel, PanelLabelWrapper, SidePanelSection} from '../../common/styled-components';

type VisConfigByFieldSelectorProps = {
  fields: Field[];
  id: string;
  property: string;
  updateField: (val: string | Field | null) => void;
  scaleType?: string;
  selectedField?: Field;
  description?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
} & WrappedComponentProps;

VisConfigByFieldSelectorFactory.deps = [InfoHelperFactory, FieldSelectorFactory];

function VisConfigByFieldSelectorFactory(
  InfoHelper: ReturnType<typeof InfoHelperFactory>,
  FieldSelector: ReturnType<typeof FieldSelectorFactory>
) {
  const VisConfigByFieldSelector: React.FC<VisConfigByFieldSelectorProps> = ({
    id,
    property,
    selectedField,
    description,
    label,
    intl,
    updateField,
    fields,
    placeholder,
    disabled
  }) => {
    return (
      <SidePanelSection disabled={disabled}>
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
            <InfoHelper description={description} property={property} id={`${id}-${property}`} />
          )}
        </PanelLabelWrapper>
        <FieldSelector
          fields={fields}
          value={selectedField && selectedField.name}
          placeholder={placeholder}
          onSelect={items => updateField(Array.isArray(items) ? items?.[0] : items)}
          disabled={disabled}
          erasable
        />
      </SidePanelSection>
    );
  };
  return injectIntl(VisConfigByFieldSelector);
}

export default VisConfigByFieldSelectorFactory;
