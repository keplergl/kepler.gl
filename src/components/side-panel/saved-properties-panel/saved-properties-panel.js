// Copyright (c) 2021 Uber Technologies, Inc.
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
import {createSelector} from 'reselect';
import styled from 'styled-components';
import get from 'lodash.get';
import {ALL_FIELD_TYPES, FILTER_TYPES} from 'constants/default-settings';

import SavedPropertiesPanelHeaderFactory from 'components/side-panel/saved-properties-panel/saved-properties-panel-header';
import NewSavedPropertiesPanelFactory from 'components/filters/filter-panels/new-filter-panel';
import TimeRangeSavedPropertiesPanelFactory from 'components/filters/filter-panels/time-range-filter-panel';
import SingleSelectSavedPropertiesPanelFactory from 'components/filters/filter-panels/single-select-filter-panel';
import MultiSelectSavedPropertiesPanelFactory from 'components/filters/filter-panels/multi-select-filter-panel';
import RangeSavedPropertiesPanelFactory from 'components/filters/filter-panels/range-filter-panel';
import PolygonSavedPropertiesPanelFactory from 'components/filters/filter-panels/polygon-filter-panel';

const StyledSavedPropertiesPanel = styled.div`
  margin-bottom: 12px;
  border-radius: 1px;
`;

SavedPropertiesPanelFactory.deps = [
  SavedPropertiesPanelHeaderFactory,
  NewSavedPropertiesPanelFactory,
  TimeRangeSavedPropertiesPanelFactory,
  SingleSelectSavedPropertiesPanelFactory,
  MultiSelectSavedPropertiesPanelFactory,
  RangeSavedPropertiesPanelFactory,
  PolygonSavedPropertiesPanelFactory
];

function SavedPropertiesPanelFactory(
  SavedPropertiesPanelHeader,
  NewSavedPropertiesPanel,
  TimeRangeSavedPropertiesPanel,
  SingleSelectSavedPropertiesPanel,
  MultiSelectSavedPropertiesPanel,
  RangeSavedPropertiesPanel,
  PolygonSavedPropertiesPanel
) {
  const SavedPropertiesPanelComponents = {
    default: NewSavedPropertiesPanel,
    [FILTER_TYPES.timeRange]: TimeRangeSavedPropertiesPanel,
    [FILTER_TYPES.select]: SingleSelectSavedPropertiesPanel,
    [FILTER_TYPES.multiSelect]: MultiSelectSavedPropertiesPanel,
    [FILTER_TYPES.range]: RangeSavedPropertiesPanel,
    [FILTER_TYPES.polygon]: PolygonSavedPropertiesPanel
  };

  return class SavedPropertiesPanel extends Component {
    static propTypes = {
      idx: PropTypes.number,
      filters: PropTypes.arrayOf(PropTypes.any).isRequired,
      filter: PropTypes.object.isRequired,
      setSavedProperties: PropTypes.func.isRequired,
      removeSavedProperties: PropTypes.func.isRequired,
      enlargeSavedProperties: PropTypes.func.isRequired,
      toggleAnimation: PropTypes.func.isRequired,
      toggleSavedPropertiesFeature: PropTypes.func.isRequired,
      datasets: PropTypes.object,
      showDatasetTable: PropTypes.func,
      isAnySavedPropertiesAnimating: PropTypes.bool
    };

    /* selectors */
    fieldsSelector = props => {
      const datasetId = props.filter.dataId[0];
      if (!datasetId) {
        return [];
      }
      return get(props, ['datasets', datasetId, 'fields'], []);
    };

    filterSelector = props => props.filters;
    nameSelector = props => props.filter.name;
    dataIdSelector = props => props.filter.dataId[0];

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
            (f.name === name || !filters.find(d => d.name === f.name && d.dataId === dataId))
        )
    );

    render() {
      const {filter} = this.props;

      const {type} = filter;
      const SavedPropertiesSavedPropertiesComponent =
        (type && SavedPropertiesPanelComponents[type]) || SavedPropertiesPanelComponents.default;
      const allAvailableFields = this.availableFieldsSelector(this.props);

      return (
        <StyledSavedPropertiesPanel className="filter-panel">
          <SavedPropertiesSavedPropertiesComponent
            allAvailableFields={allAvailableFields}
            {...this.props}
          />
        </StyledSavedPropertiesPanel>
      );
    }
  };
}

export default SavedPropertiesPanelFactory;
