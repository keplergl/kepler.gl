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

import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {WrappedComponentProps} from 'react-intl';

import Tippy from '@tippyjs/react';
import {Add} from 'components/common/icons';
import {Button} from 'components/common/styled-components';
import {DatasetSquare} from 'components';
import Typeahead from 'components/common/item-selector/typeahead';
import Accessor from 'components/common/item-selector/accessor';
import {Datasets} from '../../../utils';
import {RGBColor} from '@kepler.gl/types';

type AddLayerButtonProps = {
  datasets: Datasets;
  onOptionSelected: (opt: string) => void;
  typeaheadPlaceholder?: string;
} & WrappedComponentProps;

const DropdownContainer = styled.div.attrs({
  className: 'add-layer-menu-dropdown'
})`
  .list-selector {
    border-top: 1px solid ${props => props.theme.secondaryInputBorderColor};
    width: 100%;
    /* disable scrolling, currently set to 280px internally */
    max-height: unset;
  }

  .list__item > div {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    line-height: 18px;
    padding: 0;

    svg {
      margin-right: 10px;
    }
  }
`;

const AddLayerMenu = styled.div.attrs({
  className: 'add-layer-menu'
})`
  display: flex;
  flex-direction: column;
  min-width: 240px;
  max-width: 240px;
  position: absolute;
  top: 100%;
  left: -53px;
  z-index: 5;
`;

const ListItemWrapper = styled.div.attrs({
  className: 'add-layer-menu-list-item-wrapper'
})`
  display: flex;
  color: ${props => props.theme.textColor};
  font-size: 11px;
  letter-spacing: 0.2px;
  overflow: auto;

  .dataset-color {
    flex-shrink: 0;
    margin-top: 3px;
  }

  .dataset-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const TYPEAHEAD_CLASS = 'typeahead';
const TYPEAHEAD_INPUT_CLASS = 'typeahead__input';

function AddLayerButtonFactory() {
  const ListItem = ({value}) => (
    <ListItemWrapper>
      <DatasetSquare className="dataset-color" backgroundColor={value.color} />
      <div className="dataset-name" title={value.label}>
        {value.label}
      </div>
    </ListItemWrapper>
  );

  const AddLayerButton: React.FC<AddLayerButtonProps> = props => {
    const {datasets, onOptionSelected, typeaheadPlaceholder, intl} = props;
    const [showAddLayerDropdown, setShowAddLayerDropdown] = useState(false);

    const toggleAddLayerDropdown = useCallback(() => {
      setShowAddLayerDropdown(!showAddLayerDropdown);
    }, [showAddLayerDropdown, setShowAddLayerDropdown]);

    const _onBlur = useCallback(() => {
      setShowAddLayerDropdown(false);
    }, []);

    const toggleSelectedOption = useCallback(
      (option: {label: string; value: string; color: RGBColor}) => {
        onOptionSelected(option.value);
        _onBlur();
      },
      [onOptionSelected, _onBlur]
    );

    const onButtonBlur = useCallback(
      event => {
        if (
          [TYPEAHEAD_CLASS, TYPEAHEAD_INPUT_CLASS].every(
            cls => !event?.relatedTarget?.classList.contains(cls)
          )
        ) {
          _onBlur();
        }
      },
      [_onBlur]
    );

    const onSearchBlur = useCallback(() => {
      _onBlur();
    }, [_onBlur]);

    const options = useMemo(() => {
      return Object.values(datasets).map(ds => ({
        label: ds.label,
        value: ds.id,
        color: ds.color
      }));
    }, [datasets]);

    return (
      <Tippy
        visible={showAddLayerDropdown}
        arrow={false}
        interactive
        placement="bottom"
        appendTo="parent"
        duration={0}
        content={
          <AddLayerMenu>
            <DropdownContainer>
              <Typeahead
                onBlur={onSearchBlur}
                className={TYPEAHEAD_CLASS}
                customClasses={{
                  results: 'list-selector',
                  input: TYPEAHEAD_INPUT_CLASS,
                  listItem: 'list__item'
                }}
                placeholder={
                  typeaheadPlaceholder || intl
                    ? intl.formatMessage({id: 'placeholder.search'})
                    : 'Search'
                }
                selectedItems={null}
                options={options}
                displayOption={Accessor.generateOptionToStringFor('label')}
                filterOption={'label'}
                searchable
                onOptionSelected={toggleSelectedOption}
                customListItemComponent={ListItem}
              />
            </DropdownContainer>
          </AddLayerMenu>
        }
      >
        <Button
          tabIndex={-1}
          onBlur={onButtonBlur}
          className="add-layer-button"
          width="105px"
          onClick={toggleAddLayerDropdown}
        >
          <Add height="12px" />
          <FormattedMessage id={'layerManager.addLayer'} />
        </Button>
      </Tippy>
    );
  };

  return AddLayerButton;
}

export default AddLayerButtonFactory;
