// Copyright (c) 2020 Uber Technologies, Inc.
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

import React, {useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled, {withTheme} from 'styled-components';

import {classList} from 'components/common/item-selector/dropdown-list';
import ItemSelector from 'components/common/item-selector/item-selector';
import {CLOUDFRONT} from 'constants/default-settings';

import {SidePanelSection} from 'components/common/styled-components';
import {FormattedMessage} from 'localization';

const ITEM_SIZE = {
  large: 50,
  small: 28
};

const StyledDropdownListItem = styled.div`
  padding-bottom: ${props => props.theme.layerTypeIconPdL}px;
  padding-right: ${props => props.theme.layerTypeIconPdL}px;

  &.disabled {
    pointer-events: none;
    opacity: 0.3;
  }

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
      background-size: ${props => props.theme.layerTypeIconSizeSM}px
        ${props => props.theme.layerTypeIconSizeSM}px;
      margin-right: 12px;
    }
  }

  .layer-type-selector__item__icon {
    color: ${props => props.theme.labelColor};
    display: flex;
    background-image: url(${`${CLOUDFRONT}/kepler.gl-layer-icon-bg.png`});
    background-size: ${props => props.theme.layerTypeIconSizeL}px
      ${props => props.theme.layerTypeIconSizeL}px;
  }

  .layer-type-selector__item__label {
    text-transform: capitalize;
    font-size: 12px;
    text-align: center;
    color: ${props => props.theme.selectColor};
  }
`;

const DropdownListWrapper = styled.div`
  ${props => props.theme.dropdownList};
  background-color: ${props => props.theme.dropdownListBgd};
  border-top: 1px solid ${props => props.theme.dropdownListBorderTop};
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: ${props => props.theme.layerTypeIconPdL}px 0 0 ${props => props.theme.layerTypeIconPdL}px;
`;

function LayerTypeListItemFactory() {
  const LayerTypeListItem = ({value, isTile}) => (
    <StyledListItem
      className={classNames('layer-type-selector__item__inner', {
        list: !isTile
      })}
    >
      <div className="layer-type-selector__item__icon">
        <value.icon height={`${isTile ? ITEM_SIZE.large : ITEM_SIZE.small}px`} />
      </div>
      <div className="layer-type-selector__item__label">
        <FormattedMessage
          id={`layer.type.${value.label.toLowerCase()}`}
          defaultMessage={value.label}
        />
      </div>
    </StyledListItem>
  );

  return LayerTypeListItem;
}

function LayerTypeDropdownListFactory() {
  const LayerTypeDropdownList = ({
    onOptionSelected,
    options,
    selectedItems,
    selectionIndex,
    customListItemComponent
  }) => {
    const onSelectOption = useCallback(
      (e, value) => {
        e.preventDefault();
        onOptionSelected(value, e);
      },
      [onOptionSelected]
    );

    const Component = customListItemComponent;

    return (
      <DropdownListWrapper className={classList.list}>
        {options.map((value, i) => (
          <StyledDropdownListItem
            className={classNames('layer-type-selector__item', {
              selected: selectedItems.find(it => it.id === value.id),
              hover: selectionIndex === i,
              disabled: value.disabled
            })}
            key={`${value.id}_${i}`}
            onMouseDown={e => onSelectOption(e, value)}
            onClick={e => onSelectOption(e, value)}
          >
            <Component value={value} isTile />
          </StyledDropdownListItem>
        ))}
      </DropdownListWrapper>
    );
  };

  return LayerTypeDropdownList;
}

const propTypes = {
  layer: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired
};

const StyledLayerTypeSelector = styled.div`
  .item-selector .item-selector__dropdown {
    padding: 4px 10px 4px 2px;
  }
`;

LayerTypeSelectorFactory.deps = [LayerTypeListItemFactory, LayerTypeDropdownListFactory];

const getDisplayOption = op => op.label;
const getOptionValue = op => op.id;

function LayerTypeSelectorFactory(LayerTypeListItem, LayerTypeDropdownList) {
  const LayerTypeSelector = ({layer, layerTypeOptions, onSelect, datasets}) => {
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

  LayerTypeSelector.propTypes = propTypes;

  return withTheme(LayerTypeSelector);
}

export default LayerTypeSelectorFactory;
