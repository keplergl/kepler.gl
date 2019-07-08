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
            color: "#FFF",
          },
        }}
      />

    );
  }
}

export default onClickOutside(CustomPicker)