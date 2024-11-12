// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, ElementType} from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import {INIT_FILTER_ITEMS_IN_DROPDOWN} from '@kepler.gl/constants';

const LEFT_BUTTON = 0;

export const classList = {
  list: 'list-selector',
  listHeader: 'list__header',
  listSection: 'list__section',
  listItem: 'list__item',
  listItemAnchor: 'list__item__anchor',
  listItemFixed: 'list__item__fixed'
};

const defaultDisplay = d => d;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ListItem = ({value, displayOption = defaultDisplay, disabled, light}) => {
  const displayValue = displayOption(value);
  return (
    <span title={displayValue} className={classNames(classList.listItemAnchor, {disabled})}>
      {displayValue}
    </span>
  );
};

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

type Option = string | number | boolean | object | any;
// TODO: make Option a generic type
interface DropdownListProps {
  options?: Option[];
  allowCustomValues?: number;
  customClasses?: {listHeader?: string; listItem?: string; results?: string};
  customValues?: any[];
  customListItemComponent?: ElementType;
  customListHeaderComponent?: ElementType;
  selectionIndex?: number;
  onOptionSelected?: (option: Option, event: React.MouseEvent) => void;
  displayOption?: (option: Option) => string;
  defaultClassNames?: boolean;
  areResultsTruncated?: boolean;
  resultsTruncatedMessage?: string;
  listItemComponent?: ElementType;
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
    onOptionSelected: () => {
      return;
    },
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

  getSnapshotBeforeUpdate(prevProps: DropdownListProps) {
    if (prevProps.options !== this.props.options) {
      // check if user searching, reset state.options at the first time
      const options = this._getOptions(0);
      this.setState({options});
    }
    return null;
  }

  // prevent console warning: getSnapshotBeforeUpdate() should be used with componentDidUpdate().
  componentDidUpdate() {
    return;
  }

  componentWillUnmount() {
    if (this.loadingRef.current) {
      this.observer?.unobserve(this.loadingRef?.current);
      this.page = 0;
      this.prevY = 0;
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
    if (!this.props.options) {
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
      return [
        ...(page > 0 ? this.state.options || [] : []),
        ...this.props.options.slice(start, end)
      ];
    }

    return null;
  }

  _onClick(result, event) {
    event.preventDefault();
    // only work when left is clicked
    if ((event.type === 'mousedown' && event.button === LEFT_BUTTON) || event.type === 'click') {
      this.props.onOptionSelected?.(result, event);
    }
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
      return <div />;
    }

    const valueOffset = Array.isArray(fixedOptions) ? fixedOptions.length : 0;

    // For some reason onClick is not fired when clicked on an option
    // onMouseDown is used here as a workaround of #205 and other
    return (
      <DropdownListWrapper
        className={classNames(classList.list, this.props.customClasses?.results)}
        light={light}
      >
        {this.props.customListHeaderComponent ? (
          <div className={classNames(classList.listHeader, this.props.customClasses?.listHeader)}>
            <this.props.customListHeaderComponent />
          </div>
        ) : null}

        {valueOffset > 0 ? (
          <div className={classList.listSection}>
            {fixedOptions?.map((value, i) => (
              <div
                className={classNames(
                  classList.listItem,
                  {
                    hover: this.props.selectionIndex === i,
                    [classList.listItemFixed]: true
                  },
                  this.props.customClasses?.listItem
                )}
                key={`${display(value)}_${i}`}
                onMouseDown={e => this._onClick(value, e)}
                onClick={e => this._onClick(value, e)}
              >
                <CustomListItemComponent value={value} displayOption={display} light={light} />
              </div>
            ))}
          </div>
        ) : null}

        {this.state.options?.map((value, i) => (
          <div
            className={classNames(
              classList.listItem,
              {
                hover: this.props.selectionIndex === i + valueOffset
              },
              this.props.customClasses?.listItem
            )}
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
