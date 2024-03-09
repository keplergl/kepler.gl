// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import {createSelector} from 'reselect';
import styled from 'styled-components';
import get from 'lodash.get';
import {ALL_FIELD_TYPES, FILTER_TYPES} from '@kepler.gl/constants';

import NewFilterPanelFactory from '../../filters/filter-panels/new-filter-panel';
import TimeRangeFilterPanelFactory from '../../filters/filter-panels/time-range-filter-panel';
import SingleSelectFilterPanelFactory from '../../filters/filter-panels/single-select-filter-panel';
import MultiSelectFilterPanelFactory from '../../filters/filter-panels/multi-select-filter-panel';
import RangeFilterPanelFactory from '../../filters/filter-panels/range-filter-panel';
import PolygonFilterPanelFactory from '../../filters/filter-panels/polygon-filter-panel';
import {Field, Filter} from '@kepler.gl/types';
import {FilterPanelProps} from '../../filters/filter-panels/types';
import {Layer} from '@kepler.gl/layers';

const StyledFilterPanel = styled.div`
  margin-bottom: 12px;
  border-radius: 1px;
`;

interface FilterPanelPropsImpl extends Omit<FilterPanelProps, 'allAvailableFields'> {
  filters: Filter[];
  layers: ReadonlyArray<Layer>;
  isAnyFilterAnimating: boolean;
  toggleAnimation: () => void;
  enlargeFilter: () => void;
  toggleFilterFeature: () => void;
}

FilterPanelFactory.deps = [
  NewFilterPanelFactory,
  TimeRangeFilterPanelFactory,
  SingleSelectFilterPanelFactory,
  MultiSelectFilterPanelFactory,
  RangeFilterPanelFactory,
  PolygonFilterPanelFactory
];

function FilterPanelFactory(
  NewFilterPanel: ReturnType<typeof NewFilterPanelFactory>,
  TimeRangeFilterPanel: ReturnType<typeof TimeRangeFilterPanelFactory>,
  SingleSelectFilterPanel: ReturnType<typeof SingleSelectFilterPanelFactory>,
  MultiSelectFilterPanel: ReturnType<typeof MultiSelectFilterPanelFactory>,
  RangeFilterPanel: ReturnType<typeof RangeFilterPanelFactory>,
  PolygonFilterPanel: ReturnType<typeof PolygonFilterPanelFactory>
): React.ComponentType<FilterPanelPropsImpl> {
  const FilterPanelComponents = {
    default: NewFilterPanel,
    [FILTER_TYPES.timeRange]: TimeRangeFilterPanel,
    [FILTER_TYPES.select]: SingleSelectFilterPanel,
    [FILTER_TYPES.multiSelect]: MultiSelectFilterPanel,
    [FILTER_TYPES.range]: RangeFilterPanel,
    [FILTER_TYPES.polygon]: PolygonFilterPanel
  };

  return class FilterPanel extends Component<FilterPanelPropsImpl> {
    /* selectors */
    fieldsSelector = (props: FilterPanelPropsImpl) => {
      const datasetId = props.filter.dataId[0];
      if (!datasetId) {
        return [];
      }
      return get(props, ['datasets', datasetId, 'fields'], []);
    };

    filterSelector = (props: FilterPanelPropsImpl) => props.filters;
    nameSelector = (props: FilterPanelPropsImpl) => props.filter.name;
    dataIdSelector = (props: FilterPanelPropsImpl) => props.filter.dataId[0];

    // only show current field and field that's not already been used as a filter
    availableFieldsSelector = createSelector(
      this.fieldsSelector,
      this.filterSelector,
      this.nameSelector,
      this.dataIdSelector,
      (fields, filters, name, dataId) =>
        fields.filter(
          (f: Field) =>
            f.type &&
            f.type !== ALL_FIELD_TYPES.geojson &&
            (name.includes(f.name) ||
              !filters.find(d => d.name.includes(f.name) && d.dataId.includes(dataId)))
        )
    );

    render() {
      const {filter} = this.props;

      const {type} = filter;
      const FilterFilterComponent =
        (type && FilterPanelComponents[type]) || FilterPanelComponents.default;
      const allAvailableFields = this.availableFieldsSelector(this.props);

      return (
        <StyledFilterPanel className="filter-panel">
          <FilterFilterComponent allAvailableFields={allAvailableFields} {...this.props} />
        </StyledFilterPanel>
      );
    }
  };
}

export default FilterPanelFactory;
