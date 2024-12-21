// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

import {Button} from '../../common';

const AddDataButton = styled(Button)<{isLoading?: boolean}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  opacity: ${props => (props.disabled ? 0.6 : 1)};
  height: 40px;
  padding: 9px 32px;
  width: auto;

  svg {
    margin-right: ${props => (props.isLoading ? '0' : '6px')};
  }
`;

const LoadDataFooterContainer = styled.div.attrs({
  className: 'load-data-footer'
})`
  /* position: absolute; */
  width: 100%;
  bottom: 0;

  display: flex;
  justify-content: space-between;
  padding: 21px 21px 0px 72px;
  margin: 24px -72px 0;
  align-items: center;
`;

const ErrorContainer = styled.div`
  color: red;
  padding-right: 15px;
`;

type LoadDataFooterProps = {
  disabled?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  confirmText: string;
  prependText?: string;
  errorText?: string;
};

const LoadDataFooter: React.FC<LoadDataFooterProps> = ({
  disabled,
  isLoading,
  onConfirm,
  confirmText,
  prependText = '',
  errorText = ''
}) => {
  return (
    <LoadDataFooterContainer>
      <div>
        {errorText && <ErrorContainer>{errorText}</ErrorContainer>}
        {prependText}
        <AddDataButton
          disabled={disabled}
          isLoading={isLoading}
          onClick={onConfirm}
          width="100px"
          cta
        >
          {confirmText}
        </AddDataButton>
      </div>
    </LoadDataFooterContainer>
  );
};

export default LoadDataFooter;
