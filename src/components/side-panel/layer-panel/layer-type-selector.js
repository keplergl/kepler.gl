// Copyright (c) 2018 Uber Technologies, Inc.
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
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';

import {classList} from 'components/common/item-selector/dropdown-list';
import ItemSelector from 'components/common/item-selector/item-selector';
import {CLOUDFRONT} from 'constants/default-settings';

import {
  PanelLabel,
  SidePanelSection
} from 'components/common/styled-components';

const ITEM_SIZE = {
  large: 60,
  small: 28
};

const StyledDropdownListItem = styled.div`
  padding-bottom: 12px;
  padding-right: 12px;

  &.selected {
    .layer-type-selector__item__icon {
      border: 1px solid #caf2f4;
    }
  }

  :hover,
  &.selected {
    cursor: pointer;
    .layer-type-selector__item__icon {
      color: ${props => props.theme.activeColor};
    }

    .layer-type-selector__item__label {
      color: ${props => props.theme.textColor};
    }
  }
`;

const StyledListItem = styled.div`
  &.list {
    display: flex;
    align-items: center;

    .layer-type-selector__item__icon {
      color: ${props => props.theme.activeColor};
      background-size: ${ITEM_SIZE.small}px ${ITEM_SIZE.small}px;
      margin-right: 12px;  
    }
  }
  
  .layer-type-selector__item__icon {
    color: ${props => props.theme.labelColor};
    display: flex;
    background-image: url(${`${CLOUDFRONT}/kepler.gl-layer-icon-bg.png`});
    background-size: ${ITEM_SIZE.large}px ${ITEM_SIZE.large}px;
  }

  .layer-type-selector__item__label {
    text-transform: capitalize;
    font-size: 12px;
    text-align: center;
    color: ${props => props.theme.labelColor};
  }
`;

const DropdownListWrapper = styled.div`
  ${props => props.theme.dropdownList};
  background-color: ${props => props.theme.dropdownListBgd};
  border-top: 1px solid ${props => props.theme.dropdownListBorderTop};
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 12px 0 0 12px;
`;

const LayerTypeListItem = ({value, isTile}) => (
  <StyledListItem
    className={classNames('layer-type-selector__item__inner', {list: !isTile})}
  >
    <div className="layer-type-selector__item__icon">
      <value.icon
        height={`${isTile ? ITEM_SIZE.large : ITEM_SIZE.small}px`}
      />
    </div>
    <div className="layer-type-selector__item__label">{value.label}</div>
  </StyledListItem>
);

const LayerTypeDropdownList = props => (
  <DropdownListWrapper className={classList.list}>
    {props.options.map((value, i) => (
      <StyledDropdownListItem
        className={classNames('layer-type-selector__item', {
          selected: props.selectedItems.find(it => it.id === value.id),
          hover: props.selectionIndex === i
        })}
        key={`${value.id}_${i}`}
        onMouseDown={e => {
          e.preventDefault();
          props.onOptionSelected(value, e);
        }}
        onClick={e => {
          e.preventDefault();
          props.onOptionSelected(value, e);
        }}
      >
        <props.customListItemComponent value={value} isTile />
      </StyledDropdownListItem>
    ))}
  </DropdownListWrapper>
);

const propTypes = {
  layer: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired
};

const StyledLayerTypeSelector = styled.div`
  // override item-selector dropdown padding
  .item-selector .item-selector__dropdown {
    padding: 4px 10px 4px 2px;
  }
`;
const LayerTypeSelector = ({layer, layerTypeOptions, onSelect}) => (
  <SidePanelSection>
    <StyledLayerTypeSelector className="layer-config__type">
      <PanelLabel>Layer type</PanelLabel>
      <ItemSelector
        selectedItems={layerTypeOptions.find(op => op.id === layer.type)}
        options={layerTypeOptions}
        multiSelect={false}
        placeholder="Select A Type"
        onChange={onSelect}
        getOptionValue={op => op.id}
        filterOption="label"
        displayOption={op => op.label}
        DropDownLineItemRenderComponent={LayerTypeListItem}
        DropDownRenderComponent={LayerTypeDropdownList}
      />
    </StyledLayerTypeSelector>
  </SidePanelSection>
);

LayerTypeSelector.propTypes = propTypes;

export default LayerTypeSelector;
