// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import {media} from '@kepler.gl/styles';
import {FormattedMessage, useIntl} from 'react-intl';
import {LoadingMethod} from './load-data-modal';

const ModalTab = styled.div`
  align-items: flex-end;
  display: flex;
  border-bottom: 1px solid #d8d8d8;
  margin-bottom: 32px;
  justify-content: space-between;

  .load-data-modal__tab__inner {
    display: flex;
    width: 100%;
  }

  .load-data-modal__tab__item.active {
    color: ${props => props.theme.textColorLT};
    border-bottom: 3px solid ${props => props.theme.textColorLT};
    font-weight: 500;
  }

  ${media.portable`
    font-size: 12px;
  `};
`;

const StyledLoadDataModalTabItem = styled.div`
  border-bottom: 3px solid transparent;
  cursor: pointer;
  margin-left: 32px;
  padding: 16px 0;
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.subtextColorLT};

  ${media.portable`
    margin-left: 16px;
    font-size: 12px;
  `};

  :first-child {
    margin-left: 0;
    padding-left: 0;
  }

  :hover {
    color: ${props => props.theme.textColorLT};
  }
`;

const noop = () => {
  return;
};

interface ModalTabItemProps {
  currentMethod?: string;
  method: LoadingMethod;
  toggleMethod: (method: LoadingMethod) => void;
}

interface ModalTabProps {
  loadingMethods: LoadingMethod[];
  toggleMethod: (method: LoadingMethod) => void;
  currentMethod?: string;
}
export const ModalTabItem: React.FC<ModalTabItemProps> = ({
  currentMethod,
  method,
  toggleMethod
}) => {
  const onClick = useCallback(() => toggleMethod(method), [method, toggleMethod]);
  const intl = useIntl();

  return method.tabElementType ? (
    <method.tabElementType onClick={onClick} intl={intl} />
  ) : (
    <StyledLoadDataModalTabItem
      className={classnames('load-data-modal__tab__item', {
        active: currentMethod && method.id === currentMethod
      })}
      onClick={onClick}
    >
      <div>{method.label ? <FormattedMessage id={method.label} /> : method.id}</div>
    </StyledLoadDataModalTabItem>
  );
};

function ModalTabsFactory() {
  const ModalTabs: React.FC<ModalTabProps> = ({
    currentMethod,
    toggleMethod = noop,
    loadingMethods = []
  }) => (
    <ModalTab className="load-data-modal__tab">
      <div className="load-data-modal__tab__inner">
        {loadingMethods.map(method => (
          <ModalTabItem
            key={method.id}
            method={method}
            currentMethod={currentMethod}
            toggleMethod={toggleMethod}
          />
        ))}
      </div>
    </ModalTab>
  );

  return ModalTabs;
}

export default ModalTabsFactory;
