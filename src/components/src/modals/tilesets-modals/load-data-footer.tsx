// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

import {Button} from '@kepler.gl/components';

const AddDataButton = styled(Button)`
  height: 40px;
  padding: 9px 32px;
  width: auto;
`;

const LoadDataFooterContainer = styled.div.attrs({
  className: 'load-data-footer'
})`
  /* position: absolute; */
  width: 100%;
  bottom: 0;

  display: flex;
  justify-content: space-between;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  padding: 21px 72px;
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
  onClose?: () => void;
  confirmText: string;
  cancelText?: string;
  prependText?: string;
  errorText?: string;
};

const LoadDataFooter: React.FC<LoadDataFooterProps> = ({
  disabled,
  isLoading,
  onClose,
  onConfirm,
  confirmText,
  cancelText = 'Cancel',
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
