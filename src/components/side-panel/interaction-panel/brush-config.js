// Copyright (c) 2021 Uber Technologies, Inc.
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
import RangeSliderFactory from 'components/common/range-slider';

import {PanelLabel, SidePanelSection} from 'components/common/styled-components';
import {BRUSH_CONFIG} from 'utils/interaction-utils';
import {FormattedMessage} from 'localization';

BrushConfigFactory.deps = [RangeSliderFactory];

function BrushConfigFactory(RangeSlider) {
  const BrushConfig = ({config, onChange}) => (
    <SidePanelSection>
      <PanelLabel>
        <FormattedMessage id={'misc.brushRadius'} />
      </PanelLabel>
      <RangeSlider
        range={BRUSH_CONFIG.range}
        value0={0}
        value1={config.size || 10 / 2}
        step={0.1}
        isRanged={false}
        onChange={value => onChange({...config, size: value[1]})}
        inputTheme="secondary"
      />
    </SidePanelSection>
  );

  return BrushConfig;
}

export default BrushConfigFactory;
