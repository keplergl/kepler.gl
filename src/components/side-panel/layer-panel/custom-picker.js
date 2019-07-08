import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {SketchPicker} from 'react-color'
import onClickOutside from 'react-onclickoutside';

// This was put in because 3rd party library react-color doesn't yet cater for customized color of child component <SketchField> which contains HEX/RGB input text box
// Issue raised: https://github.com/casesandberg/react-color/issues/631

const StyledPicker = styled.div`
  .sketch-picker {
    span {
      color: #6A7485 !important;
      font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif !important;
    }
    input {
      text-align: center;
      font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif !important;
    }
  }
`;

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
          styles={{
            picker: {
              width: '200px',
              padding: '10px 10px 0',
              boxSizing: 'initial',
              background: '#29323C',
              borderRadius: '4px',
              boxShadow: '0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15)'
            },
            controls: {
              display: 'flex',
              color: "#FFF"
            }
          }}
        />
      </StyledPicker>
    );
  }
}

export default onClickOutside(CustomPicker)