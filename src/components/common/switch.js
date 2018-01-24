import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from './checkbox';

const propTypes = {
  checked: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  error: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.string
};

const Switch = (props) => {
  const switchProps = {
    ...props,
    switch: true
  };

  return <Checkbox {...switchProps}/>;
};

Switch.propTypes = propTypes;

export default Switch;
