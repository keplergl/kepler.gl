// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// TODO: this will move onto kepler.gl core
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {CORS_LINK} from '../../constants/default-settings';
import {FormattedMessage} from 'react-intl';
import {Button} from '@kepler.gl/components';
import {validateUrl} from '../../utils/url';

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

const CORS_LINK_MESSAGE = {corsLink: CORS_LINK};

class LoadRemoteMap extends Component {
  state = {
    dataUrl: '',
    error: null,
    submitted: false
  };

  onMapUrlChange = e => {
    this.setState({
      dataUrl: e.target.value,
      error: !validateUrl(e.target.value) ? {message: 'Incorrect URL'} : null
    });
  };

  onLoadRemoteMap = () => {
    const {dataUrl, error} = this.state;

    this.setState({submitted: true});

    if (!dataUrl || error) {
      return;
    }

    this.props.onLoadRemoteMap({dataUrl});
  };

  render() {
    const displayedError = this.props.error || this.state.submitted ? this.state.error : null;

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
            <FormattedMessage id={'loadRemoteMap.clickHere'} values={CORS_LINK_MESSAGE} />
          </StyledInputLabel>
          <StyledFromGroup>
            <StyledInput
              onChange={this.onMapUrlChange}
              type="text"
              placeholder="Url"
              value={this.state.dataUrl}
              error={displayedError}
            />
            <Button type="submit" cta size="small" onClick={this.onLoadRemoteMap}>
              <FormattedMessage id={'loadRemoteMap.fetch'} />
            </Button>
          </StyledFromGroup>
          {displayedError && <Error error={displayedError} url={this.props.option?.dataUrl} />}
        </InputForm>
      </div>
    );
  }
}

LoadRemoteMap.propTypes = propTypes;

export default LoadRemoteMap;
