import React from 'react';
import RangeSlider from '../../components/common/range-slider';

const RangeFilter = ({filter, setFilter, width}) => (
  <div>
    <RangeSlider
      minValue={filter.domain[0]}
      maxValue={filter.domain[1]}
      value0={filter.value[0]}
      value1={filter.value[1]}
      step={filter.step}
      histogram={filter.histogram}
      isEnlarged={filter.isEnlarged}
      onChange={setFilter}
      width={width}
      isRanged
      showInput
      inputTheme="secondary"
    />
  </div>
);

export default RangeFilter;
