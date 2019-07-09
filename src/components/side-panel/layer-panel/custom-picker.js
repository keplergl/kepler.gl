import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {SketchPicker} from 'react-color';
import onClickOutside from 'react-onclickoutside';
import {theme} from 'styles/base';

// This was put in because 3rd party library react-color doesn't yet cater for customized color of child component <SketchField> which contains HEX/RGB input text box
// Issue raised: https://github.com/casesandberg/react-color/issues/631

const StyledPicker = styled.div`
  .sketch-picker {
    span {
      color: ${props => props.theme.labelColor} !important;
      font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif !important;
    }
    input {
      text-align: center;
      font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif !important;
      color: ${props => props.theme.inputColor} !important;
      border-color: ${props => props.theme.secondaryInputBgd} !important;
      box-shadow: none !important;
      background-color: ${props => props.theme.inputBgdHover} !important;
    }
  }
`;

const PICKER_STYLES = {
  picker: {
    width: '200px',
    padding: '10px 10px 8px',
    boxSizing: 'initial',
    background: theme.panelBackground
  }
};

class CustomPicker extends Component {
  static propTypes = {
    color: PropTypes.string,
    onChange: PropTypes.func,
    onSwatchClose: PropTypes.func
  };

  handleClickOutside = e => {
    this.props.onSwatchClose();
  };

  render() {
    const {color, onChange} = this.props;

    return (
      <StyledPicker>
        <SketchPicker
          color={color}
          onChange={onChange}
          disableAlpha={true}
          presetColors={[]}
          styles={PICKER_STYLES}
        />
      </StyledPicker>
    );
  }
}

export default onClickOutside(CustomPicker);
