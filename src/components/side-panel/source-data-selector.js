import React, {Component} from 'react';
import {createSelector} from 'reselect';

import {
  PanelLabel,
  SidePanelSection
} from 'components/common/styled-components';
import ItemSelector from 'components/common/item-selector/item-selector';
import {DatasetTag} from './source-data-catalog';

const defaultPlaceHolder = 'Select A Data Source';

const DatasetItem = ({value}) => <DatasetTag dataset={value} />;

export default class SourceDataSelector extends Component {
  /* selectors */
  /* eslint-disable no-invalid-this */
  datasetsSelector = props => props.datasets;
  dsOptionsSelector = createSelector(this.datasetsSelector, datasets =>
    Object.values(datasets).map(ds => ({
      label: ds.label,
      value: ds.id,
      color: ds.color
    }))
  );

  render() {
    const {
      dataId,
      disabled,
      onSelect,
      defaultValue = defaultPlaceHolder,
      inputTheme
    } = this.props;
    const dsOptions = this.dsOptionsSelector(this.props);

    return (
      <SidePanelSection className="data-source-selector">
        <PanelLabel>Data Source</PanelLabel>
        <ItemSelector
          inputTheme={inputTheme}
          selectedItems={dataId ? this.props.datasets[dataId] : null}
          options={dsOptions}
          getOptionValue={'value'}
          filterOption={'label'}
          multiSelect={false}
          onChange={onSelect}
          placeholder={defaultValue}
          disabled={disabled}
          displayOption={'label'}
          DropDownLineItemRenderComponent={DatasetItem}
        />
      </SidePanelSection>
    );
  }
}
