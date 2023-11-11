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

import React from 'react';
import styled from 'styled-components';
import LoadingDialog from '../loading-dialog';
import {FormattedMessage} from '@kepler.gl/localization';
import {CloudItem} from './cloud-item';
import {FlexContainer} from '../../common/flex-container';

const StyledSpinner = styled.div`
  text-align: center;
  span {
    margin: 0 auto;
  }
`;

export const CloudMaps = ({provider, onSelectMap, isLoading, maps, error}) => {
  if (error) {
    return <div>Error while fetching maps</div>;
  }

  if (isLoading) {
    return (
      <StyledSpinner>
        <LoadingDialog size={64} />
      </StyledSpinner>
    );
  }

  return (
    <FlexContainer>
      {(maps ?? []).length ? (
        maps.map(vis => (
          <CloudItem key={vis.id} onClick={() => onSelectMap(provider, vis)} vis={vis} />
        ))
      ) : (
        <div className="visualization-list__message">
          <FormattedMessage id={'modal.loadStorageMap.noSavedMaps'} />
        </div>
      )}
    </FlexContainer>
  );
};
