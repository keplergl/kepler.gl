// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {injectIntl, WrappedComponentProps} from 'react-intl';
import styled from 'styled-components';

import {Button} from '../../common';
import LoadingSpinner from '../../common/loading-spinner';

const AddDataButton = styled(Button)<{isLoading?: boolean}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  opacity: ${props => (props.disabled ? 0.6 : 1)};
  height: 40px;
  padding: 9px 32px;
  width: ${props => props.width};

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
  padding-left: 15px;
  display: inline-block;
`;

type LoadDataFooterProps = {
  disabled?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  confirmText: string;
  prependText?: string;
  errorText?: string | null;
};

const LoadDataFooter: React.FC<LoadDataFooterProps & WrappedComponentProps> = ({
  disabled,
  intl,
  isLoading,
  onConfirm,
  confirmText,
  prependText = '',
  errorText = ''
}: LoadDataFooterProps & WrappedComponentProps) => {
  return (
    <LoadDataFooterContainer>
      <div>
        {prependText}
        <AddDataButton
          disabled={disabled}
          isLoading={isLoading}
          onClick={onConfirm}
          width="130px"
          cta
        >
          {isLoading && <LoadingSpinner size={12} />}
          {isLoading
            ? null
            : intl.formatMessage({
                id: confirmText
              })}
        </AddDataButton>
        {errorText && <ErrorContainer>{errorText}</ErrorContainer>}
      </div>
    </LoadDataFooterContainer>
  );
};

export default injectIntl(LoadDataFooter) as React.FC<LoadDataFooterProps>;
