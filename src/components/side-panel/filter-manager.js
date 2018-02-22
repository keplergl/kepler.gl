import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {createSelector} from 'reselect';
import {
  SidePanelSection,
  SidePanelDivider,
  Button
} from 'components/common/styled-components';
import {Add} from 'components/common/icons';
import SourceDataCatalog from './source-data-catalog';
import FilterPanel from './filter-panel/filter-panel';

const propTypes = {
  datasets: PropTypes.object,
  addFilter: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
  enlargeFilter: PropTypes.func.isRequired,
  toggleAnimation: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  showDatasetTable: PropTypes.func,

  // fields can be undefined when dataset is not selected
  fields: PropTypes.array
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
      <div className="filter-manager">
        <SourceDataCatalog
          datasets={datasets}
          showDatasetTable={this.props.showDatasetTable}
        />
        <SidePanelDivider />
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
              />
            ))}
        </SidePanelSection>
        <Button
          inactive={hadEmptyFilter || !hadDataset}
          width="105px"
          onClick={this._addFilter}
        >
          <Add height="12px" />Add Filter
        </Button>
      </div>
    );
  }
}

FilterManager.propTypes = propTypes;
