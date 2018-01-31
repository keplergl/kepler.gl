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
  error: React.PropTypes.bool,
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
  max-width: calc(100% - 8px);

  :hover {
    color: ${props => props.theme.textColorHl};
  }
`;

const ChickletTag = styled.span`
  margin-right: 10px;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
  
  :hover {
    overflow: visible;
  }
`;

const Chicklet = ({disabled, name, remove}) => (
  <ChickletButton>
    <ChickletTag>{name}</ChickletTag>
    <Delete height="10px" onClick={disabled ? null : remove} />
  </ChickletButton>
);

const ChickletedInputContainer = styled.div`
  ${props => props.theme.chickletedInput} 
`;

const ChickletedInput = ({
  focus,
  disabled,
  error,
  onClick,
  className,
  selectedItems = [],
  placeholder = '',
  removeItem,
  displayOption = d => d
}) => (
  <ChickletedInputContainer
    className={`${className} chickleted-input`}
    focus={focus}
    disabled={disabled}
    error={error}
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
