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
import {INIT_FILTER_ITEMS_IN_DROPDOWN} from '@kepler.gl/constants';

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

const DropdownFooterWrapper = styled.div`
  height: '0px';
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

interface DropdownListState {
  options: Array<any> | null;
}

export default class DropdownList extends Component<DropdownListProps, DropdownListState> {
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

  initNumberOfOptions: number;
  page: number;
  prevY: number;
  loadingRef: React.RefObject<HTMLDivElement>;
  observer: IntersectionObserver | undefined;

  constructor(props) {
    super(props);

    this.state = {options: []};
    this.initNumberOfOptions = INIT_FILTER_ITEMS_IN_DROPDOWN;
    this.page = 0;
    this.prevY = 0;
    this.loadingRef = React.createRef();
  }

  componentDidMount() {
    const options = this._getOptions(this.page);
    this.setState({options});

    const divOptions = {
      root: null,
      rootMargin: '0%',
      threshold: 1.0
    };

    if (this.loadingRef.current) {
      this.observer = new IntersectionObserver(this.handleObserver, divOptions);
      this.observer.observe(this.loadingRef.current);
    }
  }

  getSnapshotBeforeUpdate(prevProps: DropdownListProps, prevState: DropdownListState) {
    if (prevProps.options?.length !== this.props.options?.length) {
      // check if user searching, reset state.options at the first time
      const options = this._getOptions(0);
      this.setState({options});
    }
    return null;
  }

  // prevent console warning: getSnapshotBeforeUpdate() should be used with componentDidUpdate().
  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentWillUnmount() {
    if (this.loadingRef.current) {
      this.observer?.unobserve(this.loadingRef.current);
    }
  }

  handleObserver = entities => {
    const y = entities[0].boundingClientRect.y;
    if (this.prevY > y) {
      const options = this._getOptions(this.page);
      if (options) this.setState({options});
    }
    this.prevY = y;
  };

  _getOptions(page) {
    if(!this.props.options){
      return [];
    }

    const n = this.props.options.length;
    if (n === 0) {
      return [];
    }
    const start = page * this.initNumberOfOptions;
    const end = start + this.initNumberOfOptions > n ? n : start + this.initNumberOfOptions;

    if (start < end && end <= n) {
      this.page = page + 1;
      // in case of user searching, props.options will be updated
      // so "page" value will be set to 0 and previous state.options will be discarded
      return [...(page > 0 ? (this.state.options || []) : []), ...this.props.options.slice(start, end)];
    }

    return null;
  }

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
      return <div />;;
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

        {this.state.options?.map((value, i) => (
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

        <DropdownFooterWrapper ref={this.loadingRef} />
      </DropdownListWrapper>
    );
  }
}
