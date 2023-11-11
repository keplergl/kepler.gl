// Copyright (c) 2023 Uber Technologies, Inc.
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

import React, {useMemo} from 'react';
import {Button} from '../../common/styled-components';
import {ArrowLeft} from '../../common/icons';
import {FormattedMessage} from '@kepler.gl/localization';
import styled from 'styled-components';

const StyledStorageHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 12px;
  line-height: 14px;
`;

const StyledBackBtn = styled.a`
  margin-bottom: 16px;
  color: #3a414c;
  cursor: pointer;

  &:hover {
    font-weight: 500;
  }
`;

const LINK_STYLE = {textDecoration: 'underline'};

const Title = styled.span`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  margin-bottom: 16px;

  span {
    text-transform: capitalize;
  }
`;

export const CloudHeader = ({provider, onBack}) => {
  const managementUrl = useMemo(() => provider.getManagementUrl(), [provider]);
  return (
    <div>
      <StyledStorageHeader>
        <StyledBackBtn>
          <Button link onClick={onBack}>
            <ArrowLeft height="14px" />
            <FormattedMessage id={'modal.loadStorageMap.back'} />
          </Button>
        </StyledBackBtn>
        {provider.getManagementUrl && (
          <a
            key={1}
            href={managementUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={LINK_STYLE}
          >
            {provider.displayName}
          </a>
        )}
      </StyledStorageHeader>
      <Title>
        <span>{provider.displayName}</span>
        <FormattedMessage id={'modal.loadStorageMap.storageMaps'} />
      </Title>
    </div>
  );
};
