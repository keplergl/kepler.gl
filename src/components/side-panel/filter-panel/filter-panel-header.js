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

import React from 'react';
import styled from 'styled-components';
import {createLinearGradient} from 'utils/color-utils';
import {StyledPanelHeader} from 'components/common/styled-components';

export const StyledFilterTag = styled(StyledPanelHeader)`
  padding: 0 4px;

  border-left: 3px solid;
  ${props =>
    props.labelRCGColorValues && props.labelRCGColorValues.length > 0
      ? `border-image: ${createLinearGradient('bottom', props.labelRCGColorValues)} 3;`
      : 'border-color: transparent;'}
`;

const StyledChildrenContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex: 2;
  padding-top: 8px;
`;

const StyledFilterHeaderContainer = styled(StyledPanelHeader)`
  display: flex;
  height: unset;
  align-items: flex-start;
`;

FilterPanelHeaderFactory.deps = [];

function FilterPanelHeaderFactory() {
  const FilterPanelHeader = ({children, datasets}) => (
    <StyledFilterHeaderContainer className="filter-panel__header">
      <StyledFilterTag
        className="filter-panel__tag"
        labelRCGColorValues={datasets.map(d => d.color)}
      />
      <StyledChildrenContainer className="filter-panel__actions">
        {children}
      </StyledChildrenContainer>
    </StyledFilterHeaderContainer>
  );

  FilterPanelHeader.displayName = 'FilterPanelHeader';

  return FilterPanelHeader;
}

export default FilterPanelHeaderFactory;
