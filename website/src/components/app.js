import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from '../styles';
import { connect } from 'react-redux';

const GlobalStyle = styled.div`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.71429;
  color: ${props => props.theme.textColor};

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
    color: ${props => props.theme.labelColor};
  }
`;

class App extends Component {
  render() {
    const { children } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle className="kg-web-content">{children}</GlobalStyle>
      </ThemeProvider>
    );
  }
}

export default connect(state => state)(App);
