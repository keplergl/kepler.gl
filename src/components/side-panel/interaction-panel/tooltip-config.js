import React from 'react';
import {DatasetTag} from '../source-data-catalog';

import {SidePanelSection} from 'components/common/styled-components';
import FieldSelector from 'components/common/field-selector';

function TooltipConfigFactory() {
  const TooltipConfig = ({config, datasets, onChange}) => (
    <div>
      {Object.keys(config.fieldsToShow).map(dataId => (
        <SidePanelSection key={dataId}>
          <DatasetTag dataset={datasets[dataId]} />
          <FieldSelector
            fields={datasets[dataId].fields}
            value={config.fieldsToShow[dataId]}
            onSelect={fieldsToShow => {
              const newConfig = {
                ...config,
                fieldsToShow: {
                  ...config.fieldsToShow,
                  [dataId]: fieldsToShow.map(d => d.name)
                }
              };
              onChange(newConfig);
            }}
            closeOnSelect={false}
            multiSelect
          />
        </SidePanelSection>
      ))}
    </div>
  );

  return TooltipConfig;
}

export default TooltipConfigFactory;
