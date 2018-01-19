import React, {Component, PropTypes} from 'react';
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

const propTypes = {
  options: PropTypes.array,
  allowCustomValues: PropTypes.number,
  customClasses: PropTypes.object,
  customValues: PropTypes.array,
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

const defaultProps = {
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

const DropdownListWrapper = styled.div`
  border-top: 1px solid ${props => props.theme.panelActiveBg};
  ${props => props.theme.dropdownList};
`;

class DropdownList extends Component {
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
}

DropdownList.propTypes = propTypes;
DropdownList.defaultProps = defaultProps;

export default DropdownList;
