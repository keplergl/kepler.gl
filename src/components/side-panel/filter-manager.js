// Copyright (c) 2019 Uber Technologies, Inc.
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
import {
  SidePanelSection,
  SidePanelDivider,
  Button
} from 'components/common/styled-components';
import {Add} from 'components/common/icons';
import SourceDataCatalogFactory from './source-data-catalog';
import FilterPanelFactory from './filter-panel/filter-panel';

FilterManagerFactory.deps = [
  SourceDataCatalogFactory,
  FilterPanelFactory
];

function FilterManagerFactory(SourceDataCatalog, FilterPanel) {
  return class FilterManager extends Component {
    static propTypes = {
      datasets: PropTypes.object,
      addFilter: PropTypes.func.isRequired,
      removeFilter: PropTypes.func.isRequired,
      enlargeFilter: PropTypes.func.isRequired,
      toggleAnimation: PropTypes.func.isRequired,
      setFilter: PropTypes.func.isRequired,
      filters: PropTypes.arrayOf(PropTypes.any).isRequired,
      showDatasetTable: PropTypes.func,

      // fields can be undefined when dataset is not selected
      fields: PropTypes.arrayOf(PropTypes.any)
    };

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
  };
}

export default FilterManagerFactory;
