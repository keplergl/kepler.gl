import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import pick from 'lodash.pick';

function noop() {}

const propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  value: PropTypes.oneOf([true, false, 'indeterminate']),
  checked: PropTypes.bool,
  disabled: PropTypes.bool,

  error: PropTypes.string,
  switch: PropTypes.bool,
  activeColor: PropTypes.string,
  secondary: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func
};

const defaultProps = {
  disabled: false,
  checked: false,
  onBlur: noop,
  onChange: noop,
  onFocus: noop,
  label: ''
};

const StyledLabel = styled.label`
  ${props =>
    props.secondary ? props.theme.secondarySwitch : props.theme.inputSwitch};
`;

const HiddenInput = styled.input`
  position: absolute;
  display: none;
`;

class Checkbox extends React.Component {
  state = {
    focused: false
  };

  handleFocus = args => {
    this.setState({focused: true});
    this.props.onFocus(args);
  };

  handleBlur = args => {
    this.setState({focused: false});
    this.props.onBlur(args);
  };

  render() {
    const inputProps = {
      ...pick(this.props, ['checked', 'disabled', 'id', 'onChange', 'value']),
      type: 'checkbox',
      onFocus: this.handleFocus,
      onBlur: this.handleBlur
    };

    const labelProps = {
      ...pick(this.props, ['checked', 'disabled', 'secondary']),
      htmlFor: this.props.id
    };
    return (
      <div className="checkbox">
        <HiddenInput {...inputProps} />
        <StyledLabel chassName="checkbox__label" {...labelProps}>
          {this.props.label}
        </StyledLabel>
      </div>
    );
  }
}

Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;

export default Checkbox;
