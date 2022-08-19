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

import React, {useMemo} from 'react';
import styled, {withTheme} from 'styled-components';

import LayerTypeDropdownListFactory from './layer-type-dropdown-list';
import LayerTypeListItemFactory from './layer-type-list-item';
import ItemSelector from 'components/common/item-selector/item-selector';

import {SidePanelSection} from 'components/common/styled-components';
import {Layer} from '@kepler.gl/layers';
import {Datasets} from '../../../utils';

type Option = {
  id: string;
  label: string;
  icon: any; //
  requireData: any; //
};

type LayerTypeSelectorProps = {
  layer: Layer;
  datasets: Datasets;
  layerTypeOptions: Option[];
  onSelect: (
    items:
      | readonly (string | number | boolean | object)[]
      | string
      | number
      | boolean
      | object
      | null
  ) => void;
  // TODO add correct type after Theme typing
  theme: Record<string, string>;
};

const StyledLayerTypeSelector = styled.div`
  .item-selector .item-selector__dropdown {
    padding: 4px 10px 4px 2px;
  }
`;

LayerTypeSelectorFactory.deps = [LayerTypeListItemFactory, LayerTypeDropdownListFactory];

const getDisplayOption = (op: Option) => op.label;
const getOptionValue = (op: Option) => op.id;

function LayerTypeSelectorFactory(
  LayerTypeListItem: ReturnType<typeof LayerTypeListItemFactory>,
  LayerTypeDropdownList: ReturnType<typeof LayerTypeDropdownListFactory>
) {
  const LayerTypeSelector: React.FC<LayerTypeSelectorProps> = ({
    layer,
    layerTypeOptions,
    onSelect,
    datasets
  }) => {
    const hasData = useMemo(() => Boolean(Object.keys(datasets).length), [datasets]);
    const typeOptions = useMemo(
      () =>
        layerTypeOptions.map(op => ({
          ...op,
          disabled: !hasData && op.requireData !== false
        })),
      [hasData, layerTypeOptions]
    );

    const selectedItems = useMemo(() => typeOptions.find(op => op.id === layer.type), [
      typeOptions,
      layer.type
    ]);

    return (
      <SidePanelSection>
        <StyledLayerTypeSelector className="layer-config__type">
          <ItemSelector
            selectedItems={selectedItems}
            options={typeOptions}
            multiSelect={false}
            placeholder="placeholder.selectType"
            onChange={onSelect}
            getOptionValue={getOptionValue}
            filterOption="label"
            displayOption={getDisplayOption}
            DropDownLineItemRenderComponent={LayerTypeListItem}
            DropDownRenderComponent={LayerTypeDropdownList}
          />
        </StyledLayerTypeSelector>
      </SidePanelSection>
    );
  };

  return withTheme(LayerTypeSelector);
}

export default LayerTypeSelectorFactory;
