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

import React from 'react';
import RangeSliderFactory from '../common/range-slider';
import {FILTER_VIEW_TYPES} from '@kepler.gl/constants';
import {RangeFilterProps} from './types';

RangeFilterFactory.deps = [RangeSliderFactory];

export default function RangeFilterFactory(RangeSlider: ReturnType<typeof RangeSliderFactory>) {
  const RangeFilter: React.FC<RangeFilterProps> = ({filter, setFilter}) => (
    <div>
      <RangeSlider
        range={filter.domain}
        value0={filter.value[0]}
        value1={filter.value[1]}
        step={filter.step}
        histogram={filter.histogram}
        isEnlarged={filter.view === FILTER_VIEW_TYPES.enlarged}
        onChange={setFilter}
        inputTheme="secondary"
      />
    </div>
  );

  return RangeFilter;
}
