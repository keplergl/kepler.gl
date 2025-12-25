// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// TODO: this will move onto kepler.gl core
import React, {useState, ChangeEvent, useCallback} from 'react';
import styled from 'styled-components';
import {Button, LoadingDialog} from '@kepler.gl/components';
import {FormattedMessage} from '@kepler.gl/localization';
import {useLoadRemoteMap} from '../../hooks/use-load-remote-map';

import {CORS_LINK} from '../../constants/default-settings';

interface ErrorType {
  message: string;
}

interface LoadRemoteMapProps {
  error?: ErrorType | null;
  option?: {
    dataUrl?: string;
  };
}

interface StyledProps {
  theme: any; // Using any temporarily until we can properly import Theme type
}

interface StyledInputProps extends StyledProps {
  hasError?: boolean;
}

interface RemoteMapState {
  dataUrl: string;
  error: ErrorType | null;
  submitted: boolean;
}

const StyledDescription = styled.div<StyledProps>`
  font-size: 14px;
  color: ${props => props.theme.labelColorLT};
  line-height: 18px;
  margin-bottom: 12px;
`;

const InputForm = styled.div<StyledProps>`
  flex-grow: 1;
  padding: 32px;
  background-color: ${props => props.theme.panelBackgroundLT};
`;

const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  padding: ${props => props.theme.inputPadding};
  color: ${props => (props.hasError ? 'red' : props.theme.titleColorLT)};
  height: ${props => props.theme.inputBoxHeight};
  border: 0;
  outline: 0;
  font-size: ${props => props.theme.inputFontSize};

  &:active,
  &:focus,
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

export const StyledInputLabel = styled.div<StyledProps>`
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

const Error: React.FC<{error: ErrorType; url?: string}> = ({error, url}) => (
  <StyledError>
    <StyledErrorDescription>{url}</StyledErrorDescription>
    <StyledErrorDescription>{error.message}</StyledErrorDescription>
  </StyledError>
);

const CORS_LINK_MESSAGE = {corsLink: CORS_LINK};

const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const LoadRemoteMap: React.FC<LoadRemoteMapProps> = ({error: propsError, option}) => {
  const {loadRemoteMap, isLoading} = useLoadRemoteMap();
  const [state, setState] = useState<RemoteMapState>({
    dataUrl: '',
    error: null,
    submitted: false
  });

  const onMapUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setState(prevState => ({
      ...prevState,
      dataUrl: newValue,
      error: !validateUrl(newValue) ? {message: 'Incorrect URL'} : null
    }));
  };

  const handleLoadRemoteMap = useCallback(() => {
    const {dataUrl, error} = state;

    setState(prevState => ({
      ...prevState,
      submitted: true
    }));

    if (!dataUrl || error) {
      return;
    }

    loadRemoteMap(dataUrl);
  }, [state, loadRemoteMap]);

  const displayedError = propsError || state.submitted ? state.error : null;

  if (isLoading) {
    return (
      <div style={{paddingTop: '100px', paddingBottom: '100px'}}>
        <LoadingDialog size={64} />
      </div>
    );
  }

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
          <FormattedMessage id={'loadRemoteMap.cors'} />
          <a rel="noopener noreferrer" target="_blank" href={CORS_LINK_MESSAGE.corsLink}>
            <FormattedMessage id={'loadRemoteMap.clickHere'} />
          </a>
        </StyledInputLabel>
        <StyledFromGroup>
          <StyledInput
            onChange={onMapUrlChange}
            type="text"
            placeholder="Url"
            value={state.dataUrl}
            hasError={!!displayedError}
          />
          <Button type="submit" cta size="small" onClick={handleLoadRemoteMap}>
            <FormattedMessage id={'loadRemoteMap.fetch'} />
          </Button>
        </StyledFromGroup>
        {displayedError && <Error error={displayedError} url={option?.dataUrl} />}
      </InputForm>
    </div>
  );
};

export default LoadRemoteMap;
