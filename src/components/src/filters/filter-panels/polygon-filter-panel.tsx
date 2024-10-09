// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo, useCallback} from 'react';
import {StyledFilterContent} from '../../common/styled-components';
import PolygonFilterFactory from '../polygon-filter';
import PanelHeaderActionFactory from '../../side-panel/panel-header-action';
import {EyeSeen, EyeUnseen} from '../../common/icons';

import FilterPanelHeaderFactory from '../../side-panel/filter-panel/filter-panel-header';
import {StyledFilterPanel} from '../components';

import get from 'lodash.get';
import {PolygonFilterPanelComponent} from './types';
import {KeplerTable} from '@kepler.gl/table';

PolygonFilterPanelFactory.deps = [
  FilterPanelHeaderFactory,
  PolygonFilterFactory,
  PanelHeaderActionFactory
];

function PolygonFilterPanelFactory(
  FilterPanelHeader: ReturnType<typeof FilterPanelHeaderFactory>,
  PolygonFilter: ReturnType<typeof PolygonFilterFactory>,
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>
) {
  const PolygonFilterPanel: PolygonFilterPanelComponent = React.memo(
    ({idx, datasets, layers, filter, removeFilter, setFilter, toggleFilterFeature}) => {
      const filterDatasets: KeplerTable[] = useMemo(
        () => filter.dataId.map(d => datasets[d]),
        [filter, datasets]
      );

      const onSetLayers = useCallback(value => setFilter(idx, 'layerId', value), [setFilter, idx]);

      const isVisible = get(filter, ['value', 'properties', 'isVisible'], true);
      const featureType = get(filter, ['value', 'geometry', 'type'], 'Polygon');

      return (
        <div className="polygon-filter-panel">
          <FilterPanelHeader datasets={filterDatasets} filter={filter} removeFilter={removeFilter}>
            <StyledFilterPanel>Geo - {featureType}</StyledFilterPanel>
            <PanelHeaderAction
              id={filter.id}
              onClick={toggleFilterFeature}
              tooltip={isVisible ? 'tooltip.hideFeature' : 'tooltip.showFeature'}
              IconComponent={isVisible ? EyeSeen : EyeUnseen}
              active={isVisible}
            />
          </FilterPanelHeader>
          <StyledFilterContent className="filter-panel__content">
            <div className="filter-panel__filter">
              <PolygonFilter filter={filter} layers={layers} setLayers={onSetLayers} />
            </div>
          </StyledFilterContent>
        </div>
      );
    }
  );

  PolygonFilterPanel.displayName = 'PolygonFilterPanel';

  return PolygonFilterPanel;
}

export default PolygonFilterPanelFactory;
