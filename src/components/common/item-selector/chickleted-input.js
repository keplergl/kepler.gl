import React, {PropTypes} from 'react';

import styled from 'styled-components';
import Delete from '../icons/delete';

const propTypes = {
  // required properties
  onClick: React.PropTypes.func.isRequired,
  removeItem: React.PropTypes.func.isRequired,

  // optional properties
  selectedItems: PropTypes.array,
  disabled: React.PropTypes.bool,
  displayOption: React.PropTypes.func,
  focus: React.PropTypes.bool,
  isError: React.PropTypes.bool,
  placeholder: React.PropTypes.string
};

const ChickletButton = styled.div`
  background: ${props => props.theme.panelActiveBg};
  border-radius: 1px;
  color: ${props => props.theme.textColor};
  font-size: 11px;
  line-height: 20px;
  margin: 3px 10px 3px 3px;
  padding: 4px 6px;
  display: flex;
  align-items: center;

  :hover {
    color: ${props => props.theme.textColorHl};
  }
`;

const ChickletTag = styled.div`
  margin-right: 10px;
`;

const Chicklet = ({disabled, name, remove}) => (
  <ChickletButton>
    <ChickletTag>{name}</ChickletTag>
    <Delete height="10px" onClick={disabled ? null : remove} />
  </ChickletButton>
);

const ChickletedInputContainer = styled.div`
  ${props => props.theme.input} 
  justify-content: start;
  cursor: pointer;
  flex-wrap: wrap;
  height: auto;
  margin-bottom: 2px;
  padding: 4px 7px 4px 4px;
`;

const ChickletedInput = ({
  focus,
  disabled,
  isError,
  onClick,
  selectedItems = [],
  placeholder = '',
  removeItem,
  displayOption = d => d
}) => (
  <ChickletedInputContainer
    focus={focus}
    disabled={disabled}
    error={isError}
    onClick={onClick}
  >
    {selectedItems.length > 0
      ? selectedItems.map((item, i) => (
          <Chicklet
            disabled={disabled}
            key={`${displayOption(item)}_${i}`}
            name={displayOption(item)}
            remove={e => removeItem(item, e)}
          />
        ))
      : placeholder}
  </ChickletedInputContainer>
);

ChickletedInput.propTypes = propTypes;

export default ChickletedInput;
