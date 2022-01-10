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

import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import {FormattedMessage} from 'localization';

import Tippy from '@tippyjs/react';
import DropdownList from 'components/common/item-selector/dropdown-list';
import {Add} from 'components/common/icons';
import {Button} from 'components/common/styled-components';

const DropdownContainer = styled.div.attrs({
  className: 'add-layer-menu-dropdown'
})`
  .list-selector {
    border-top: 0;
    width: max-content;
    padding: 8px 0;
    /* disable scrolling, currently set to 280px internally */
    max-height: unset;
  }

  .list__header {
    padding: 8px 20px;
  }

  .list__item {
    padding: 8px 20px;

    &:hover {
      background: ${props => `${props.theme.PURPLE2}22`};
    }
    &:hover > div {
      color: ${props => props.theme.PURPLE2};
    }
  }

  .list__item > div {
    display: flex;
    align-items: center;
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
  width: 100%;
  position: absolute;
  top: 100%;
  left: -53px;
  z-index: 5;
`;

function AddLayerButtonFactory() {
  const AddLayerButton = props => {
    const {datasets, onOptionSelected} = props;
    const [showAddLayerDropdown, setShowAddLayerDropdown] = useState(false);

    const toggleAddLayerDropdown = useCallback(() => {
      setShowAddLayerDropdown(!showAddLayerDropdown);
    }, [showAddLayerDropdown, setShowAddLayerDropdown]);

    const toggleSelectedOption = useCallback(
      dataset => {
        onOptionSelected(dataset);
        setShowAddLayerDropdown(false);
      },
      [onOptionSelected]
    );

    const onButtonBlur = useCallback(() => {
      () => setShowAddLayerDropdown(false);
    }, []);

    return (
      <Tippy
        visible={showAddLayerDropdown}
        arrow={false}
        interactive
        placement="bottom"
        appendTo="parent"
        duration={0}
        content={
          <div>
            <AddLayerMenu>
              <DropdownContainer>
                <DropdownList
                  displayOption={d => d.label}
                  options={Object.values(datasets)}
                  onOptionSelected={toggleSelectedOption}
                />
              </DropdownContainer>
            </AddLayerMenu>
          </div>
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
