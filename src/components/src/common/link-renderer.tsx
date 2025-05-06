// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';

const LinkRenderer = props => {
  return (
    <a href={props.href} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  );
};

export default LinkRenderer;
