// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import {useIntl} from 'react-intl';
import styled from 'styled-components';

import {FilterPanelFactory, PanelTitleFactory, SidePanelSection} from '@kepler.gl/components';
import {FILTER_VIEW_TYPES, SIDEBAR_PANELS} from '@kepler.gl/constants';
import {Filter} from '@kepler.gl/types';
import {Layer} from '@kepler.gl/layers';
import {isSideFilter} from '@kepler.gl/utils';
import {Datasets} from '@kepler.gl/table';

import {getKeplerFactory} from './KeplerInjector';
import {KeplerActions, useKeplerStateActions} from '../hooks/useKeplerStateActions';
import {buildKeplerTableSourceOptions, type KeplerTableSourceOption} from '../keplerTableSelection';
import {KeplerTableSourceSelector} from './KeplerTableSourceSelector';
import {useStoreWithKepler} from '../KeplerSlice';
import {Button} from '@sqlrooms/ui';
import {Plus} from 'lucide-react';

const filterPanelMetadata = SIDEBAR_PANELS.find(p => p.id === 'filter');

// Custom styled components for your filter manager
const CustomFilterManagerContainer = styled.div`
  .filter-manager {
    /* Add your custom styles here */
  }

  .filter-manager-title {
    /* Custom title styling */
  }

  .add-filter-button {
    background-color: ${props => props.theme.sidePanelBg || props.theme.panelBackground};
    color: #2563eb;
    border: 0px;
    height: 28px;
    font-weight: 500;
    font-size: 14px;
  }
`;

type CustomFilterManagerProps = {
  mapId: string;
  showDeleteDataset?: boolean;
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
  keplerActions: KeplerActions;
};

// Based on Kepler.gl's filterPanelCallbacks pattern
type FilterPanelCallbacks = Record<
  string,
  {
    removeFilter: () => void;
    setFilterView: (_view: string) => void;
    toggleAnimation: () => void;
    toggleFilterFeature: () => void;
  }
>;

// Get the kepler.gl components through the injector
const FilterPanel = getKeplerFactory(FilterPanelFactory);
const PanelTitle = getKeplerFactory(PanelTitleFactory);

// Filter List Component
const FilterList: React.FC<FilterListProps> = ({
  filtersByIndex,
  filters,
  datasets,
  layers,
  isAnyFilterAnimating,
  keplerActions
}) => {
  const {removeFilter, setFilterView, toggleFilterAnimation, toggleFilterFeature} =
    keplerActions.visStateActions;

  const filterPanelProps = useMemo(() => {
    return filtersByIndex.reduce(
      (accu, {filter, idx}) => ({
        ...accu,
        [filter.id]: {
          removeFilter: () => removeFilter(idx),
          setFilterView: (_view: string) =>
            setFilterView(
              idx,
              isSideFilter(filter) ? FILTER_VIEW_TYPES.enlarged : FILTER_VIEW_TYPES.side
            ),
          toggleAnimation: () => toggleFilterAnimation(idx),
          toggleFilterFeature: () => toggleFilterFeature(idx)
        }
      }),
      {} as FilterPanelCallbacks
    );
  }, [filtersByIndex, removeFilter, setFilterView, toggleFilterAnimation, toggleFilterFeature]);

  return (
    <>
      {[...filtersByIndex].reverse().map(({filter, idx}) => {
        const callbacks = filterPanelProps[filter.id];
        return (
          <FilterPanel
            key={`${filter.id}-${idx}`}
            idx={idx}
            filters={filters}
            filter={filter}
            datasets={datasets}
            layers={layers}
            isAnyFilterAnimating={isAnyFilterAnimating}
            {...keplerActions.visStateActions}
            removeFilter={() => callbacks?.removeFilter?.()}
            enlargeFilter={() => callbacks?.setFilterView?.('')}
            toggleAnimation={() => callbacks?.toggleAnimation?.()}
            toggleFilterFeature={() => callbacks?.toggleFilterFeature?.()}
          />
        );
      })}
    </>
  );
};

// Custom hook for filter actions
function useCustomFilterActions(keplerActions: KeplerActions) {
  const {addFilter} = keplerActions.visStateActions;

  const onClickAddFilter = useCallback(
    (option: KeplerTableSourceOption) => addFilter(option.value),
    [addFilter]
  );

  return {
    onClickAddFilter
  };
}

// Main Custom Filter Manager Component
export const CustomFilterManager: React.FC<CustomFilterManagerProps> = ({mapId}) => {
  const {keplerActions, keplerState} = useKeplerStateActions({mapId});
  const intl = useIntl();
  const dbTables = useStoreWithKepler(state => state.db.tables);
  const tableSelection = useStoreWithKepler(state => state.kepler.tableSelection);

  const {onClickAddFilter} = useCustomFilterActions(keplerActions);

  const visState = keplerState?.visState;
  const filters = useMemo(() => visState?.filters ?? [], [visState?.filters]);
  const datasets = useMemo(() => (visState?.datasets ?? []) as Datasets, [visState?.datasets]);
  const layers = useMemo(() => visState?.layers ?? [], [visState?.layers]);
  const filtersByIndex = useMemo(
    () =>
      filters?.map((f, idx) => ({
        filter: f,
        idx
      })) ?? [],
    [filters]
  );
  const addFilterOptions = useMemo(
    () =>
      buildKeplerTableSourceOptions({
        dbTables,
        datasets,
        includeUnloadedTables: false,
        tableSelection
      }),
    [datasets, dbTables, tableSelection]
  );

  if (!keplerState || !keplerActions) {
    return null;
  }

  const isAnyFilterAnimating = Object.values(filters).some(f => f.isAnimating);

  return (
    <CustomFilterManagerContainer>
      <div className="filter-manager">
        <SidePanelSection>
          <PanelTitle
            className="filter-manager-title"
            title={intl.formatMessage({
              id: filterPanelMetadata?.label || 'Filters'
            })}
          >
            <KeplerTableSourceSelector
              disabled={!addFilterOptions.length}
              options={addFilterOptions}
              popoverAlign="end"
              searchPlaceholder={intl ? intl.formatMessage({id: 'placeholder.search'}) : 'Search'}
              onSelect={onClickAddFilter}
              renderTrigger={({disabled}) => (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="add-filter-button"
                  disabled={disabled}
                >
                  <Plus className="h-3.5 w-3.5" />
                  {intl.formatMessage({id: 'filterManager.addFilter'})}
                </Button>
              )}
            />
          </PanelTitle>
        </SidePanelSection>

        <SidePanelSection>
          <FilterList
            filtersByIndex={filtersByIndex}
            filters={filters}
            datasets={datasets}
            layers={layers}
            isAnyFilterAnimating={isAnyFilterAnimating}
            keplerActions={keplerActions}
          />
        </SidePanelSection>
      </div>
    </CustomFilterManagerContainer>
  );
};
