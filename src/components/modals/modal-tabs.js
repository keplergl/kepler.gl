// Copyright (c) 2021 Uber Technologies, Inc.
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

import React, {useCallback} from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {media} from 'styles';
import {FormattedMessage, useIntl} from 'react-intl';

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

const noop = () => {};

export const ModalTabItem = ({currentMethod, method, toggleMethod}) => {
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
  const ModalTabs = ({currentMethod, toggleMethod, loadingMethods}) => (
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

  ModalTabs.propTypes = {
    toggleMethod: PropTypes.func.isRequired,
    currentMethod: PropTypes.string,
    loadingMethods: PropTypes.arrayOf(PropTypes.object)
  };

  ModalTabs.defaultProps = {
    toggleMethod: noop,
    currentMethod: null,
    loadingMethods: []
  };

  return ModalTabs;
}

export default ModalTabsFactory;
