// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {Outlet} from 'react-router-dom';

const GlobalStyleDiv = styled.div`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.71429;

  *,
  *:before,
  *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0;
  }

  a {
    text-decoration: none;
  }
`;

function App() {
  return (
    <GlobalStyleDiv className="kg-web-content">
      <Outlet />
    </GlobalStyleDiv>
  );
}

export default connect(state => state)(App);
