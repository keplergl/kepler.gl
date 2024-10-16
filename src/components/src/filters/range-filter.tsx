// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import RangeSliderFactory from '../common/range-slider';
import {FILTER_VIEW_TYPES} from '@kepler.gl/constants';
import {RangeFilterProps} from './types';

RangeFilterFactory.deps = [RangeSliderFactory];

export default function RangeFilterFactory(RangeSlider: ReturnType<typeof RangeSliderFactory>) {
  const RangeFilter: React.FC<RangeFilterProps> = ({filter, setFilter, setFilterPlot}) => {
    return (
      <div>
        <RangeSlider
          range={filter.domain}
          value0={filter.value[0]}
          value1={filter.value[1]}
          step={filter.step}
          bins={filter.bins}
          isEnlarged={filter.view === FILTER_VIEW_TYPES.enlarged}
          onChange={setFilter}
          setFilterPlot={setFilterPlot}
          inputTheme="secondary"
          plotType={filter.plotType}
        />
      </div>
    );
  };

  return RangeFilter;
}
