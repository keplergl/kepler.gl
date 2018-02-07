import React from 'react';
import RangeSlider from 'components/common/range-slider';

const RangeFilter = ({filter, setFilter}) => (
  <div>
    <RangeSlider
      range={filter.domain}
      value0={filter.value[0]}
      value1={filter.value[1]}
      step={filter.step}
      histogram={filter.histogram}
      isEnlarged={filter.isEnlarged}
      onChange={setFilter}
      inputTheme="secondary"
    />
  </div>
);

export default RangeFilter;
