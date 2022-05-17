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

import React, {Component, ElementType} from 'react';
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
export const ListItem = ({value, displayOption = defaultDisplay, light}) => (
  <span className={classList.listItemAnchor}>{displayOption(value)}</span>
);

interface DropdownListWrapperProps {
  light?: boolean;
}

const DropdownListWrapper = styled.div<DropdownListWrapperProps>`
  background-color: ${props =>
    props.light ? props.theme.dropdownListBgdLT : props.theme.dropdownListBgd};
  border-top: 1px solid
    ${props =>
      props.light ? props.theme.dropdownListBorderTopLT : props.theme.dropdownListBorderTop};
  ${props => (props.light ? props.theme.dropdownListLT : props.theme.dropdownList)};
`;

interface DropdownListProps {
  options?: any[];
  allowCustomValues?: number;
  customClasses?: object;
  customValues?: any[];
  customListItemComponent?: ElementType;
  customListHeaderComponent?: ElementType;
  selectionIndex?: number;
  onOptionSelected?: Function;
  displayOption?: Function;
  defaultClassNames?: boolean;
  areResultsTruncated?: boolean;
  resultsTruncatedMessage?: string;
  listItemComponent?: Function;
  light?: boolean;
  fixedOptions?: any[];
}

export default class DropdownList extends Component<DropdownListProps> {
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
    this.props.onOptionSelected?.(result, event);
  }

  render() {
    const {
      fixedOptions,
      light,
      allowCustomValues = 0,
      customListItemComponent: CustomListItemComponent = ListItem
    } = this.props;
    const {displayOption: display = defaultDisplay} = this.props;

    // Don't render if there are no options to display
    if (!this.props.options?.length && allowCustomValues <= 0) {
      return false;
    }

    const valueOffset = Array.isArray(fixedOptions) ? fixedOptions.length : 0;

    // For some reason onClick is not fired when clicked on an option
    // onMouseDown is used here as a workaround of #205 and other
    return (
      <DropdownListWrapper className={classList.list} light={light}>
        {this.props.customListHeaderComponent ? (
          <div className={classList.listHeader}>
            <this.props.customListHeaderComponent />
          </div>
        ) : null}

        {valueOffset > 0 ? (
          <div className={classList.listSection}>
            {fixedOptions?.map((value, i) => (
              <div
                className={classNames(classList.listItem, {
                  hover: this.props.selectionIndex === i,
                  fixed: true
                })}
                key={`${display(value)}_${i}`}
                onMouseDown={e => this._onClick(value, e)}
                onClick={e => this._onClick(value, e)}
              >
                <CustomListItemComponent value={value} displayOption={display} />
              </div>
            ))}
          </div>
        ) : null}

        {this.props.options?.map((value, i) => (
          <div
            className={classNames(classList.listItem, {
              hover: this.props.selectionIndex === i + valueOffset
            })}
            key={`${display(value)}_${i}`}
            onMouseDown={e => this._onClick(value, e)}
            onClick={e => this._onClick(value, e)}
          >
            <CustomListItemComponent value={value} displayOption={display} />
          </div>
        ))}
      </DropdownListWrapper>
    );
  }
}
