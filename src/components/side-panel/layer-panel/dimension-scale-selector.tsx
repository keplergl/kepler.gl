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
import {PanelLabel, SidePanelSection} from 'components/common/styled-components';
import ItemSelector from 'components/common/item-selector/item-selector';
import {FormattedMessage} from '@kepler.gl/localization';
import {camelize} from '@kepler.gl/utils';

type DimensionScaleSelectorProps = {
  label: string;
  onSelect: (
    val: readonly (string | number | boolean | object)[] | string | number | boolean | object | null
  ) => void;
  options: string[];
  scaleType?: string;
  disabled?: boolean;
};

const DimensionScaleSelector: React.FC<DimensionScaleSelectorProps> = ({
  label,
  onSelect,
  options,
  scaleType,
  disabled = false
}) => {
  return (
    <SidePanelSection>
      <PanelLabel>
        <FormattedMessage
          id={label ? `scale.${camelize(label)}` : 'misc.scale'}
          defaultMessage={label}
        />
      </PanelLabel>
      <ItemSelector
        disabled={disabled}
        selectedItems={scaleType}
        options={options}
        multiSelect={false}
        searchable={false}
        onChange={onSelect}
      />
    </SidePanelSection>
  );
};

export default DimensionScaleSelector;
