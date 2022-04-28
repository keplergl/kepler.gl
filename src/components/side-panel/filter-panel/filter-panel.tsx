// Copyright (c) 2022 Uber Technologies, Inc.
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
import {createSelector} from 'reselect';
import styled from 'styled-components';
import get from 'lodash.get';
import {ALL_FIELD_TYPES, FILTER_TYPES} from 'constants/default-settings';

import NewFilterPanelFactory from 'components/filters/filter-panels/new-filter-panel';
import TimeRangeFilterPanelFactory from 'components/filters/filter-panels/time-range-filter-panel';
import SingleSelectFilterPanelFactory from 'components/filters/filter-panels/single-select-filter-panel';
import MultiSelectFilterPanelFactory from 'components/filters/filter-panels/multi-select-filter-panel';
import RangeFilterPanelFactory from 'components/filters/filter-panels/range-filter-panel';
import PolygonFilterPanelFactory from 'components/filters/filter-panels/polygon-filter-panel';
import {FilterPanelProps} from './types';

const StyledFilterPanel = styled.div`
  margin-bottom: 12px;
  border-radius: 1px;
`;

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
) {
  const FilterPanelComponents = {
    default: NewFilterPanel,
    [FILTER_TYPES.timeRange]: TimeRangeFilterPanel,
    [FILTER_TYPES.select]: SingleSelectFilterPanel,
    [FILTER_TYPES.multiSelect]: MultiSelectFilterPanel,
    [FILTER_TYPES.range]: RangeFilterPanel,
    [FILTER_TYPES.polygon]: PolygonFilterPanel
  };

  return class FilterPanel extends Component<FilterPanelProps> {
    /* selectors */
    fieldsSelector = (props: FilterPanelProps) => {
      const datasetId = props.filter.dataId[0];
      if (!datasetId) {
        return [];
      }
      return get(props, ['datasets', datasetId, 'fields'], []);
    };

    filterSelector = (props: FilterPanelProps) => props.filters;
    nameSelector = (props: FilterPanelProps) => props.filter.name;
    dataIdSelector = (props: FilterPanelProps) => props.filter.dataId[0];

    // only show current field and field that's not already been used as a filter
    availableFieldsSelector = createSelector(
      this.fieldsSelector,
      this.filterSelector,
      this.nameSelector,
      this.dataIdSelector,
      (fields, filters, name, dataId) =>
        fields.filter(
          f =>
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
