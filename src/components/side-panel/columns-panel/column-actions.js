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

import React, {Component} from 'react';
import styled from 'styled-components';
import {VertThreeDots} from 'components/common/icons';
import DropdownList from 'components/common/item-selector/dropdown-list';
import {Button} from 'components/common/styled-components';
import {FormattedMessage, injectIntl} from 'react-intl';
import onClickOutside from 'react-onclickoutside';
import {Tooltip} from 'components/common/styled-components';

const ColumnActionsWrapper = styled.div`
  position: relative;
`;

const IconButton = styled(Button)`
  padding: 2px 2px;
  background: transparent;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    background: transparent;
  }

  svg {
    margin: 0;
  }
`;

const StyledPopover = styled.div`
  margin-left: -44px;
  position: absolute;
  top: 20px;
  width: 90px;
  z-index: 101;
`;

function ColumnActionsFactory(dataId, fieldId, actions) {
  class ColumnActions extends Component {
    state = {
      show: false
    };

    componentDidMount() {
      document.addEventListener('mousedown', this.handleClickOutside, false);
    }

    componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside, false);
    }

    handleClickOutside = e => {
      if (this.node.contains(e.target)) {
        return;
      }
      this.setState({show: false});
    };

    render() {
      const {intl} = this.props;
      const {show} = this.state;

      return (
        <ColumnActionsWrapper ref={node => (this.node = node)}>
          <IconButton
            data-tip
            data-for={`actions-${dataId}-${fieldId}`}
            onClick={e => {
              e.stopPropagation();
              this.setState({show: Boolean(!show)});
            }}
          >
            <VertThreeDots height="16px" />
            <Tooltip id={`actions-${dataId}-${fieldId}`} effect="solid">
              <FormattedMessage id={'columnsPanel.actions'} />
            </Tooltip>
          </IconButton>
          {show && (
            <StyledPopover>
              <DropdownList
                options={Object.keys(actions)}
                displayOption={d =>
                  intl.formatMessage({
                    id: `columnsPanel.${d}`
                  })
                }
                onOptionSelected={(result, e) => {
                  e.stopPropagation();
                  this.setState({
                    show: false
                  });

                  // TODO: actions
                  if (actions[result]) {
                    actions[result](dataId, fieldId);
                  }
                }}
              />
            </StyledPopover>
          )}
        </ColumnActionsWrapper>
      );
    }
  }
  return injectIntl(onClickOutside(ColumnActions));
}

export default ColumnActionsFactory;
