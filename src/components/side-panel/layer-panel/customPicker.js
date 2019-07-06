import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {SketchPicker} from 'react-color'
import onClickOutside from 'react-onclickoutside';





class CustomPicker extends React.Component {


  handleClickOutside = e => {
    this.props.onSwatchClose();
  };

  render() {
    const { color, onChange, onSwatchClose } = this.props;

    return (
      <SketchPicker
        color={color}
        onChange={onChange}
        disableAlpha={true}
        presetColors={[]}
      />

    );
  }
}

export default onClickOutside(CustomPicker)