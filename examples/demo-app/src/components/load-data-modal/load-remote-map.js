// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// TODO: this will move onto kepler.gl core
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {CORS_LINK} from '../../constants/default-settings';
import {FormattedHTMLMessage, FormattedMessage} from 'react-intl';
import {Button} from 'kepler.gl/components';

const propTypes = {
  onLoadRemoteMap: PropTypes.func.isRequired
};

const StyledDescription = styled.div`
  font-size: 14px;
  color: ${props => props.theme.labelColorLT};
  line-height: 18px;
  margin-bottom: 12px;
`;

const InputForm = styled.div`
  flex-grow: 1;
  padding: 32px;
  background-color: ${props => props.theme.panelBackgroundLT};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.inputPadding};
  color: ${props => (props.error ? 'red' : props.theme.titleColorLT)};
  height: ${props => props.theme.inputBoxHeight};
  border: 0;
  outline: 0;
  font-size: ${props => props.theme.inputFontSize};

  :active,
  :focus,
  &.focus,
  &.active {
    outline: 0;
  }
`;

const StyledFromGroup = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: row;
`;

export const StyledInputLabel = styled.div`
  font-size: 11px;
  color: ${props => props.theme.textColorLT};
  letter-spacing: 0.2px;
  ul {
    padding-left: 12px;
  }
`;

export const StyledError = styled.div`
  color: red;
`;

export const StyledErrorDescription = styled.div`
  font-size: 14px;
`;

const Error = ({error, url}) => (
  <StyledError>
    <StyledErrorDescription>{url}</StyledErrorDescription>
    <StyledErrorDescription>{error.message}</StyledErrorDescription>
  </StyledError>
);

class LoadRemoteMap extends Component {
  state = {
    dataUrl: ''
  };

  onMapUrlChange = e => {
    // TODO: validate url
    this.setState({
      dataUrl: e.target.value
    });
  };

  onLoadRemoteMap = () => {
    const {dataUrl} = this.state;
    if (!dataUrl) {
      return;
    }

    this.props.onLoadRemoteMap({dataUrl});
  };

  render() {
    return (
      <div>
        <InputForm>
          <StyledDescription>
            <FormattedMessage id={'loadRemoteMap.description'} />
          </StyledDescription>
          <StyledInputLabel>
            <FormattedMessage id={'loadRemoteMap.message'} />
          </StyledInputLabel>
          <StyledInputLabel>
            <FormattedMessage id={'loadRemoteMap.examples'} />
            <ul>
              <li>https://your.map.url/map.json</li>
              <li>http://your.map.url/data.csv</li>
            </ul>
          </StyledInputLabel>
          <StyledInputLabel>
            <FormattedMessage id={'loadRemoteMap.cors'} />{' '}
            <FormattedHTMLMessage id={'loadRemoteMap.clickHere'} values={{corsLink: CORS_LINK}} />
          </StyledInputLabel>
          <StyledFromGroup>
            <StyledInput
              onChange={this.onMapUrlChange}
              type="text"
              placeholder="Url"
              value={this.state.dataUrl}
              error={this.props.error}
            />
            <Button type="submit" cta size="small" onClick={this.onLoadRemoteMap}>
              <FormattedMessage id={'loadRemoteMap.fetch'} />
            </Button>
          </StyledFromGroup>
          {this.props.error && <Error error={this.props.error} url={this.props.option.dataUrl} />}
        </InputForm>
      </div>
    );
  }
}

LoadRemoteMap.propTypes = propTypes;

export default LoadRemoteMap;
