// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import {useIntl} from 'react-intl';
import {SidePanelDivider, SidePanelSection} from '../common/styled-components';
import SourceDataCatalogFactory from './common/source-data-catalog';
import FilterPanelFactory from './filter-panel/filter-panel';
import {FILTER_VIEW_TYPES, PANEL_VIEW_TOGGLES} from '@kepler.gl/constants';
import {Filter} from '@kepler.gl/types';
import {Layer} from '@kepler.gl/layers';
import {isSideFilter} from '@kepler.gl/utils';
import {VisStateActions, ActionHandler, UIStateActions, ActionHandlers} from '@kepler.gl/actions';
import {Datasets} from '@kepler.gl/table';

import PanelViewListToggleFactory from './panel-view-list-toggle';
import PanelTitleFactory from './panel-title';
import AddFilterButtonFactory from './filter-panel/add-filter-button';
import DatasetSectionFactory from './layer-panel/dataset-section';
import {PanelMeta} from './common/types';

type VisStateActionHandlers = ActionHandlers<typeof VisStateActions>;
type UiStateActionHandlers = ActionHandlers<typeof UIStateActions>;

export type FilterManagerProps = {
  filters: Filter[];
  datasets: Datasets;
  layers: Layer[];
  showDatasetTable: ActionHandler<typeof VisStateActions.showDatasetTable>;
  updateTableColor: ActionHandler<typeof VisStateActions.updateTableColor>;
  removeDataset: ActionHandler<typeof VisStateActions.removeDataset>;
  showAddDataModal: () => void;

  panelMetadata: PanelMeta;
  panelListView: string;
  visStateActions: VisStateActionHandlers;
  uiStateActions: UiStateActionHandlers;
};

type FilterListProps = {
  filters: Filter[];
  datasets: Datasets;
  layers: Layer[];
  filtersByIndex: {
    filter: Filter;
    idx: number;
  }[];
  isAnyFilterAnimating: boolean;
  visStateActions: VisStateActionHandlers;
};

FilterManagerFactory.deps = [
  DatasetSectionFactory,
  FilterPanelFactory,
  PanelTitleFactory,
  AddFilterButtonFactory,
  PanelViewListToggleFactory,
  SourceDataCatalogFactory
];

function FilterManagerFactory(
  DatasetSection: ReturnType<typeof DatasetSectionFactory>,
  FilterPanel: ReturnType<typeof FilterPanelFactory>,
  PanelTitle: ReturnType<typeof PanelTitleFactory>,
  AddFilterButton: ReturnType<typeof AddFilterButtonFactory>,
  PanelViewListToggle: ReturnType<typeof PanelViewListToggleFactory>,
  SourceDataCatalog: ReturnType<typeof SourceDataCatalogFactory>
) {
  const FilterList = ({
    filtersByIndex,
    filters,
    datasets,
    layers,
    isAnyFilterAnimating,
    visStateActions
  }: FilterListProps) => {
    const {
      removeFilter,
      setFilter,
      setFilterPlot,
      toggleFilterAnimation,
      toggleFilterFeature,
      setFilterView,
      syncTimeFilterWithLayerTimeline
    } = visStateActions;

    const filterPanelCallbacks = useMemo(() => {
      return filtersByIndex.reduce(
        (accu, {filter, idx}) => ({
          ...accu,
          [filter.id]: {
            removeFilter: () => removeFilter(idx),
            toggleFilterView: () =>
              setFilterView(
                idx,
                isSideFilter(filter) ? FILTER_VIEW_TYPES.enlarged : FILTER_VIEW_TYPES.side
              ),
            toggleAnimation: () => toggleFilterAnimation(idx),
            toggleFilterFeature: () => toggleFilterFeature(idx)
          }
        }),
        {}
      );
    }, [filtersByIndex, removeFilter, setFilterView, toggleFilterAnimation, toggleFilterFeature]);

    return (
      <SidePanelSection>
        {[...filtersByIndex].reverse().map(({filter, idx}) => (
          <FilterPanel
            key={`${filter.id}-${idx}`}
            idx={idx}
            filters={filters}
            filter={filter}
            datasets={datasets}
            layers={layers}
            isAnyFilterAnimating={isAnyFilterAnimating}
            removeFilter={filterPanelCallbacks[filter.id].removeFilter}
            enlargeFilter={filterPanelCallbacks[filter.id].toggleFilterView}
            toggleAnimation={filterPanelCallbacks[filter.id].toggleAnimation}
            toggleFilterFeature={filterPanelCallbacks[filter.id].toggleFilterFeature}
            setFilter={setFilter}
            setFilterPlot={setFilterPlot}
            syncTimeFilterWithLayerTimeline={syncTimeFilterWithLayerTimeline}
          />
        ))}
      </SidePanelSection>
    );
  };

  const DatasetFilterSection = ({
    filtersByIndex,
    filters,
    dataset,
    datasets,
    layers,
    isAnyFilterAnimating,
    visStateActions,
    showDatasetTable,
    updateTableColor,
    removeDataset,
    showDeleteDataset
  }) => {
    const datasetCatalog = useMemo(() => {
      return {[dataset.id]: dataset};
    }, [dataset]);

    return (
      <>
        <SourceDataCatalog
          datasets={datasetCatalog}
          showDatasetTable={showDatasetTable}
          updateTableColor={updateTableColor}
          removeDataset={removeDataset}
          showDeleteDataset={showDeleteDataset}
        />
        <FilterList
          filtersByIndex={filtersByIndex}
          filters={filters}
          datasets={datasets}
          layers={layers}
          isAnyFilterAnimating={isAnyFilterAnimating}
          visStateActions={visStateActions}
        />
      </>
    );
  };

  const FilterManager: React.FC<FilterManagerProps> = ({
    filters = [],
    datasets,
    layers,
    showDatasetTable,
    updateTableColor,
    removeDataset,
    showAddDataModal,
    panelMetadata,
    panelListView,
    visStateActions,
    uiStateActions
  }) => {
    const {addFilter} = visStateActions;
    const {togglePanelListView} = uiStateActions;
    const isAnyFilterAnimating = filters.some(f => f.isAnimating);
    const onClickAddFilter = useCallback(dataset => addFilter(dataset), [addFilter]);
    const isSortByDatasetMode = panelListView === PANEL_VIEW_TOGGLES.byDataset;
    const filtersByIndex = useMemo(
      () =>
        filters.map((f, idx) => ({
          filter: f,
          idx
        })),
      [filters]
    );
    const filtersByDatasets = useMemo(
      () =>
        Object.keys(datasets).reduce(
          (accu, dataId) => ({
            ...accu,
            // if synced filter, show it unfder its the first dataset
            [dataId]: filtersByIndex.filter(
              fidx => fidx.filter.dataId && fidx.filter.dataId[0] === dataId
            )
          }),
          {}
        ),
      [datasets, filtersByIndex]
    );
    const _TogglePanelListView = useCallback(
      listView => {
        togglePanelListView({panelId: 'filter', listView});
      },
      [togglePanelListView]
    );

    const intl = useIntl();
    const filterListProps = {
      datasets,
      filters,
      layers,
      isAnyFilterAnimating,
      visStateActions
    };

    const sourceDataCatalogProps = {
      showDatasetTable,
      updateTableColor,
      removeDataset,
      showDeleteDataset: true
    };

    return (
      <div className="filter-manager">
        <SidePanelSection>
          <PanelViewListToggle togglePanelListView={_TogglePanelListView} mode={panelListView} />
        </SidePanelSection>
        <DatasetSection
          datasets={datasets}
          {...sourceDataCatalogProps}
          showDatasetList={!isSortByDatasetMode}
          showAddDataModal={showAddDataModal}
        />
        <SidePanelDivider />
        <SidePanelSection>
          <PanelTitle
            className="filter-manager-title"
            title={intl.formatMessage({id: panelMetadata.label})}
          >
            <AddFilterButton datasets={datasets} onAdd={onClickAddFilter} />
          </PanelTitle>
        </SidePanelSection>
        <SidePanelSection>
          {isSortByDatasetMode ? (
            Object.keys(filtersByDatasets).map(dataId => (
              <DatasetFilterSection
                key={dataId}
                filtersByIndex={filtersByDatasets[dataId]}
                dataset={datasets[dataId]}
                {...filterListProps}
                {...sourceDataCatalogProps}
              />
            ))
          ) : (
            <FilterList filtersByIndex={filtersByIndex} {...filterListProps} />
          )}
        </SidePanelSection>
      </div>
    );
  };

  return FilterManager;
}

export default FilterManagerFactory;
