import React, {Component} from 'react';
import {createSelector} from 'reselect';
import styled from 'styled-components';
import PanelHeaderAction from 'components/side-panel/panel-header-action';
import FieldSelector from 'components/common/field-selector';

import {Trash, Clock} from 'components/common/icons';
import SourceDataSelector from 'components/side-panel/source-data-selector';

import * as Filters from 'components/filters';
import {FILTER_TYPES, FILTER_COMPONENTS} from 'utils/filter-utils';
import {ALL_FIELD_TYPES} from 'constants/default-settings';

const FilterHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  border-left-color: rgb(${props => props.color.join(',')});
  cursor: pointer;
  border-left-width: 4px;
  border-left-style: solid;
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
      <div className="layer-panel active">
        <FilterHeaderWrapper color={datasets[dataId].color}>
          <div style={{flexGrow: 1}}>
            <FieldSelector
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
        </FilterHeaderWrapper>
        <div className="soft-tiny layer-panel__config">
          {Object.keys(datasets).length > 1 && (
            <SourceDataSelector
              datasets={datasets}
              disabled={filter.freeze}
              dataId={filter.dataId}
              onSelect={value => setFilter(idx, 'dataId', value)}
            />
          )}
          {type &&
          !enlarged && (
            <div style={{marginTop: '24px'}}>
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
        </div>
      </div>
    );
  }
}
