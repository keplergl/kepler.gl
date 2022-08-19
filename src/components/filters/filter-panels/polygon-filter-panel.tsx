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

import React, {useMemo, useCallback} from 'react';
import {StyledFilterContent} from 'components/common/styled-components';
import PolygonFilterFactory from 'components/filters/polygon-filter';
import PanelHeaderActionFactory from 'components/side-panel/panel-header-action';
import {EyeSeen, EyeUnseen} from 'components/common/icons';

import FilterPanelHeaderFactory from 'components/side-panel/filter-panel/filter-panel-header';
import {StyledFilterPanel} from '../components';

import get from 'lodash.get';
import {PolygonFilterPanelComponent} from './types';
import {KeplerTable} from '../../../utils';

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
      const filterDatasets: KeplerTable[] = useMemo(() => filter.dataId.map(d => datasets[d]), [
        filter,
        datasets
      ]);

      const onSetLayers = useCallback(value => setFilter(idx, 'layerId', value), [setFilter, idx]);

      const isVisible = get(filter, ['value', 'properties', 'isVisible'], true);
      const featureType = get(filter, ['value', 'properties', 'renderType'], true);

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
