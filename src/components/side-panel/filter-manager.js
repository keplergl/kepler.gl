import React, {Component} from 'react';
import {createSelector} from 'reselect';
import styled from 'styled-components';

import FieldSelector from '../common/field-selector';
import {SidePanelSection, SidePanelDivider, Tooltip, Button} from '../common/styled-components';
import {Add, Trash, Clock} from '../common/icons';
import SourceDataSelector from './source-data-selector';
import SourceDataCatalog from './source-data-catalog';

import * as Filters from '../../components/filters';
import {
  FILTER_TYPES,
  FILTER_COMPONENTS
} from '../../utils/filter-utils';

import {ALL_FIELD_TYPES} from '../../constants/default-settings';

const propTypes = {
  panelWidth: React.PropTypes.number.isRequired,
  addFilter: React.PropTypes.func.isRequired,
  removeFilter: React.PropTypes.func.isRequired,
  filters: React.PropTypes.array.isRequired,
  setFilter: React.PropTypes.func.isRequired,
  showDatasetTable: React.PropTypes.func,

  // fields can be undefined when dataset is not selected
  fields: React.PropTypes.array
};

export default class FilterManager extends Component {
  /* selectors */
  datasetsSelector = state => state.datasets;
  defaultDatasetSelector = createSelector(
    this.datasetsSelector,
    datasets =>
      (Object.keys(datasets).length && Object.keys(datasets)[0]) || null
  );

  /* actions */
  _addFilter = () => {
    const defaultDataset = this.defaultDatasetSelector(this.props);
    this.props.addFilter(defaultDataset);
  };

  render() {
    const {filters, datasets} = this.props;
    const isAnyFilterAnimating = filters.some(f => f.isAnimating);
    const hadEmptyFilter = filters.some(f => !f.name);
    const hadDataset = Object.keys(datasets).length;

    return (
      <div>
        <SourceDataCatalog
          datasets={datasets}
          showDatasetTable={this.props.showDatasetTable}
        />
        <SidePanelDivider/>
        <SidePanelSection>
        {filters &&
          filters.map((filter, idx) => (
            <FilterPanel
              key={`${filter.id}-${idx}`}
              idx={idx}
              filters={filters}
              filter={filter}
              datasets={datasets}
              isAnyFilterAnimating={isAnyFilterAnimating}
              removeFilter={() => this.props.removeFilter(idx)}
              enlargeFilter={() => this.props.enlargeFilter(idx)}
              toggleAnimation={() => this.props.toggleAnimation(idx)}
              setFilter={this.props.setFilter}
              width={this.props.panelWidth - 24}
            />
          ))}
        </SidePanelSection>
        <Button
          inactive={hadEmptyFilter || !hadDataset}
          width="105px"
          onClick={this._addFilter}>
          <Add height="12px"/>Add Filter
        </Button>
      </div>
    );
  }
}

FilterManager.propTypes = propTypes;

const FilterHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  border-left-color: rgb(${props => props.color.join(',')});
  cursor: pointer;
  border-left-width: 4px;
  border-left-style: solid;
  padding: 12px;
`;

class FilterPanel extends Component {
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
              onSelect={value => setFilter(idx, 'name', value.name)}
            />
          </div>
          <FilterAction
            id={filter.id}
            tooltip="delete"
            tooltipType="error"
            onClick={removeFilter}
            hoverColor={'errorColor'}
            IconComponent={Trash}
          />
          {type === FILTER_TYPES.timeRange && (
            <FilterAction
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

const FilterActionWrapper = styled.div`
  margin-left: 12px;
  height: 18px;
  color: ${props => props.active ? props.theme.activeColor : props.theme.textColor};

  :hover {
    cursor: pointer;
    color: ${props => props.hoverColor ? props.theme[props.hoverColor] : props.theme.textColorHl};
  }
`;

// Need to use react class to access props.component
class FilterAction extends Component {
  render() {
    const {onClick, tooltip, id, active, hoverColor, tooltipType} = this.props;
    return (
      <FilterActionWrapper active={active} hoverColor={hoverColor}>
        <this.props.IconComponent data-tip data-for={`${tooltip}_${id}`}
          height="18px" onClick={onClick}/>
        <Tooltip id={`${tooltip}_${id}`} effect="solid" type={tooltipType}>
          <span>{tooltip}</span>
        </Tooltip>
      </FilterActionWrapper>
    );
  }
}
