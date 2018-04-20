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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';

export const classList = {
  list: 'list-selector',
  listHeader: 'list__header',
  listSection: 'list__section',
  listItem: 'list__item',
  listItemAnchor: 'list__item__anchor'
};

const defaultDisplay = d => d;
export const ListItem = ({value, displayOption = defaultDisplay}) => (
  <span className={classList.listItemAnchor}>{displayOption(value)}</span>
);

const DropdownListWrapper = styled.div`
  background-color: ${props => props.theme.dropdownListBgd};
  border-top: 1px solid ${props => props.theme.dropdownListBorderTop};
  ${props => props.theme.dropdownList};
`;

export default class DropdownList extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.any),
    allowCustomValues: PropTypes.number,
    customClasses: PropTypes.object,
    customValues: PropTypes.arrayOf(PropTypes.any),
    customListItemComponent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ]),
    customListHeaderComponent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ]),
    selectionIndex: PropTypes.number,
    onOptionSelected: PropTypes.func,
    displayOption: PropTypes.func.isRequired,
    defaultClassNames: PropTypes.bool,
    areResultsTruncated: PropTypes.bool,
    resultsTruncatedMessage: PropTypes.string,
    listItemComponent: PropTypes.func
  };

  static defaultProps = {
    customClasses: {},
    customListItemComponent: ListItem,
    customListHeaderComponent: null,
    allowCustomValues: 0,
    customValues: [],
    displayOption: defaultDisplay,
    onOptionSelected: () => {},
    defaultClassNames: true,
    selectionIndex: null
  };

  _onClick(result, event) {
    event.preventDefault();
    this.props.onOptionSelected(result, event);
  }

  render() {
    const {fixedOptions} = this.props;
    const display = this.props.displayOption;

    // Don't render if there are no options to display
    if (!this.props.options.length && this.props.allowCustomValues <= 0) {
      return false;
    }

    const valueOffset = Array.isArray(fixedOptions) ? fixedOptions.length : 0;

    // For some reason onClick is not fired when clicked on an option
    // onMouseDown is used here as a workaround of #205 and other
    return (
      <DropdownListWrapper className={classList.list}>
        {this.props.customListHeaderComponent ? (
          <div className={classList.listHeader}>
            <this.props.customListHeaderComponent />
          </div>
        ) : null}

        {valueOffset > 0 ? (
          <div className={classList.listSection}>
            {fixedOptions.map((value, i) => (
              <div
                className={classNames(classList.listItem, {
                  hover: this.props.selectionIndex === i,
                  fixed: true
                })}
                key={`${display(value)}_${i}`}
                onMouseDown={e => this._onClick(value, e)}
                onClick={e => this._onClick(value, e)}
              >
                <this.props.customListItemComponent
                  value={value}
                  displayOption={display}
                />
              </div>
            ))}
          </div>
        ) : null}

        {this.props.options.map((value, i) => (
          <div
            className={classNames(classList.listItem, {
              hover: this.props.selectionIndex === i + valueOffset
            })}
            key={`${display(value)}_${i}`}
            onMouseDown={e => this._onClick(value, e)}
            onClick={e => this._onClick(value, e)}
          >
            <this.props.customListItemComponent
              value={value}
              displayOption={display}
            />
          </div>
        ))}
      </DropdownListWrapper>
    );
  }
};
