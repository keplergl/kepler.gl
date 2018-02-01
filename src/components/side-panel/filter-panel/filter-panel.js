import React, {Component} from 'react';
import {createSelector} from 'reselect';
import styled from 'styled-components';
import PanelHeaderAction from 'components/side-panel/panel-header-action';
import FieldSelector from 'components/common/field-selector';
import {Trash, Clock} from 'components/common/icons';
import SourceDataSelector from 'components/side-panel/source-data-selector';
import {StyledPanelHeader} from 'components/common/styled-components';
import * as Filters from 'components/filters';

import {FILTER_TYPES, FILTER_COMPONENTS} from 'utils/filter-utils';
import {ALL_FIELD_TYPES} from 'constants/default-settings';

const StyledFilterPanel = styled.div`
  margin-bottom: 12px;
  border-radius: 1px;

  .filter-panel__filter {
    margin-top: 24px;
  }
`;

const StyledFilterHeader = StyledPanelHeader.extend`
  cursor: pointer;
  padding: 10px 12px;
`;

const StyledFilterContent = styled.div`
  background-color: ${props => props.theme.panelBackground};
  padding: 12px;
`;

export default class FilterPanel extends Component {
  /* selectors */
  fieldsSelector = props =>
    (props.filter.dataId && props.datasets[props.filter.dataId].fields) || [];
  filterSelector = props => props.filters;
  nameSelector = props => props.filter.name;
  dataIdSelector = props => props.filter.dataId;

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
          (f.name === name ||
            !filters.find(d => d.name === f.name && d.dataId === dataId))
      )
  );

  render() {
    const {
      datasets,
      enlargeFilter,
      filter,
      idx,
      isAnyFilterAnimating,
      removeFilter,
      setFilter,
      toggleAnimation,
      width
    } = this.props;
    const {name, enlarged, type, dataId} = filter;
    const FilterComponent = type && Filters[FILTER_COMPONENTS[type]];
    const allAvailableFields = this.availableFieldsSelector(this.props);

    return (
      <StyledFilterPanel className="filter-panel">
        <StyledFilterHeader className="filter-panel__header"
          labelRCGColorValues={datasets[dataId].color}>
          <div style={{flexGrow: 1}}>
            <FieldSelector
              inputTheme="secondary"
              fields={allAvailableFields}
              value={name}
              erasable={false}
              onSelect={value => setFilter(idx, 'name', value.name)}
            />
          </div>
          <PanelHeaderAction
            id={filter.id}
            tooltip="delete"
            tooltipType="error"
            onClick={removeFilter}
            hoverColor={'errorColor'}
            IconComponent={Trash}
          />
          {type === FILTER_TYPES.timeRange && (
            <PanelHeaderAction
              id={filter.id}
              onClick={enlargeFilter}
              tooltip="Time Playback"
              IconComponent={Clock}
              active={enlarged}
            />
          )}
        </StyledFilterHeader>
        <StyledFilterContent className="filter-panel__content">
          {Object.keys(datasets).length > 1 && (
            <SourceDataSelector
              inputTheme="secondary"
              datasets={datasets}
              disabled={filter.freeze}
              dataId={filter.dataId}
              onSelect={value => setFilter(idx, 'dataId', value)}
            />
          )}
          {type &&
          !enlarged && (
            <div className="filter-panel__filter">
              <FilterComponent
                filter={filter}
                idx={idx}
                isAnyFilterAnimating={isAnyFilterAnimating}
                toggleAnimation={toggleAnimation}
                setFilter={value => setFilter(idx, 'value', value)}
                width={width}
              />
            </div>
          )}
        </StyledFilterContent>
      </StyledFilterPanel>
    );
  }
}
