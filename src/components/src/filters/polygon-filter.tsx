// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo, useCallback} from 'react';
import ItemSelector from '../common/item-selector/item-selector';
import {Layer} from '@kepler.gl/layers';
import {LAYER_TYPES} from '@kepler.gl/constants';
import {PolygonFilterProps} from './types';
import {StyledFilterPanel} from './components';

const layerFilter = (layer: Layer) => layer.type === LAYER_TYPES.point;
const isAlreadySelected = (selectedLayers: Layer[], layerId: string) =>
  selectedLayers.findIndex(l => l.id === layerId) === -1;

function PolygonFilterFactory() {
  const PolygonFilter: React.FC<PolygonFilterProps> = React.memo(({filter, layers, setLayers}) => {
    const setNewLayers = useCallback(
      newLayers => {
        return setLayers(newLayers.map((l: Layer) => l.id));
      },
      [setLayers]
    );

    const selectedLayers = useMemo(
      () => layers.filter(l => filter.layerId?.includes(l.id)),
      [filter, layers]
    );

    const availableLayers = useMemo(() => {
      // remove already added layers and filter out non point layers
      return layers.filter(
        layer => layerFilter(layer) && isAlreadySelected(selectedLayers, layer.id)
      );
    }, [layers, selectedLayers]);

    const searchOptions = useCallback((value, options) => {
      const searchStr = value?.toLowerCase();
      return options.filter(l => l.config?.label?.toLowerCase().indexOf(searchStr) >= 0);
    }, []);

    return (
      <div>
        <StyledFilterPanel htmlFor={`filter-${filter.id}`}>Layers:</StyledFilterPanel>
        <ItemSelector
          options={availableLayers}
          selectedItems={selectedLayers}
          onChange={setNewLayers}
          searchable={true}
          searchOptions={searchOptions}
          multiSelect={true}
          getOptionValue={(l: Layer) => l.id}
          displayOption={(l: Layer) => l.config.label}
          placeholder={'placeholder.selectLayer'}
        />
      </div>
    );
  });

  PolygonFilter.displayName = 'PolygonFilter';

  return PolygonFilter;
}

export default PolygonFilterFactory;
