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

import React, {useCallback, useMemo} from 'react';
import {FormattedMessage} from '@kepler.gl/localization';
import {Button, SidePanelDivider, SidePanelSection} from '../common/styled-components';
import {Add} from '../common/icons';
import SourceDataCatalogFactory from './common/source-data-catalog';
import FilterPanelFactory from './filter-panel/filter-panel';
import {FILTER_VIEW_TYPES} from '@kepler.gl/constants';
import {Filter} from '@kepler.gl/types';
import {Layer} from '@kepler.gl/layers';
import {isSideFilter} from '@kepler.gl/utils';
import {VisStateActions, ActionHandler} from '@kepler.gl/actions';
import {Datasets} from '@kepler.gl/table';

type FilterManagerProps = {
  filters: Filter[];
  datasets: Datasets;
  layers: Layer[];
  showDatasetTable: ActionHandler<typeof VisStateActions.showDatasetTable>;
  updateTableColor: ActionHandler<typeof VisStateActions.updateTableColor>;
  visStateActions: typeof VisStateActions;
};

FilterManagerFactory.deps = [SourceDataCatalogFactory, FilterPanelFactory];

function FilterManagerFactory(
  SourceDataCatalog: ReturnType<typeof SourceDataCatalogFactory>,
  FilterPanel: ReturnType<typeof FilterPanelFactory>
) {
  const FilterManager = ({
    filters = [],
    datasets,
    layers,
    showDatasetTable,
    updateTableColor,
    visStateActions
  }: FilterManagerProps) => {
    const {
      addFilter,
      removeFilter,
      setFilter,
      toggleFilterAnimation,
      toggleFilterFeature,
      setFilterView
    } = visStateActions;
    const isAnyFilterAnimating = filters.some(f => f.isAnimating);
    const hadEmptyFilter = filters.some(f => !f.name);
    const hadDataset = Object.keys(datasets).length;
    const onClickAddFilter = useCallback(() => {
      const defaultDataset = (Object.keys(datasets).length && Object.keys(datasets)[0]) || null;
      addFilter(defaultDataset);
    }, [datasets, addFilter]);
    // render last added filter first
    const reversedIndex = useMemo(() => {
      return new Array(filters.length)
        .fill(0)
        .map((d, i) => i)
        .reverse();
    }, [filters.length]);

    const filterPanelCallbacks = useMemo(() => {
      return new Array(filters.length).fill(0).map((d, idx) => ({
        removeFilter: () => removeFilter(idx),
        toggleFilterView: () =>
          setFilterView(
            idx,
            isSideFilter(filters[idx]) ? FILTER_VIEW_TYPES.enlarged : FILTER_VIEW_TYPES.side
          ),
        toggleAnimation: () => toggleFilterAnimation(idx),
        toggleFilterFeature: () => toggleFilterFeature(idx)
      }));
    }, [filters, removeFilter, setFilterView, toggleFilterAnimation, toggleFilterFeature]);

    return (
      <div className="filter-manager">
        <SourceDataCatalog
          datasets={datasets}
          showDatasetTable={showDatasetTable}
          updateTableColor={updateTableColor}
        />
        <SidePanelDivider />
        <SidePanelSection>
          {reversedIndex.map(idx => (
            <FilterPanel
              key={`${filters[idx].id}-${idx}`}
              idx={idx}
              filters={filters}
              filter={filters[idx]}
              datasets={datasets}
              layers={layers}
              isAnyFilterAnimating={isAnyFilterAnimating}
              removeFilter={filterPanelCallbacks[idx].removeFilter}
              enlargeFilter={filterPanelCallbacks[idx].toggleFilterView}
              toggleAnimation={filterPanelCallbacks[idx].toggleAnimation}
              toggleFilterFeature={filterPanelCallbacks[idx].toggleFilterFeature}
              setFilter={setFilter}
            />
          ))}
        </SidePanelSection>
        <Button
          className="add-filter-button"
          inactive={hadEmptyFilter || !hadDataset}
          width="105px"
          onClick={onClickAddFilter}
        >
          <Add height="12px" />
          <FormattedMessage id={'filterManager.addFilter'} />
        </Button>
      </div>
    );
  };

  return FilterManager;
}

export default FilterManagerFactory;
