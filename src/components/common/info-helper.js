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
import PropTypes from 'prop-types';
import {Tooltip} from './styled-components';
import {Docs} from 'components/common/icons';
import styled from 'styled-components';

const StyledInfoHelper = styled.div`
  align-items: center;
  margin-left: 10px;
  color: ${props => props.theme.labelColor};
  display: inline-flex;

  .info-helper__content {
    max-width: 100px;
  }

  :hover {
    cursor: pointer;
    color: ${props => props.theme.textColorHl};
  }
`;

const propTypes = {
  description: PropTypes.string.isRequired,
  containerClass: PropTypes.string
};

const InfoHelper = ({description, containerClass, id}) => (
  <StyledInfoHelper className={`info-helper ${containerClass || ''}`} data-tip data-for={id}>
    <Docs height="16px" />
    <Tooltip id={id} effect="solid">
      <div className="info-helper__content">{description}</div>
    </Tooltip>
  </StyledInfoHelper>
);

InfoHelper.propTypes = propTypes;

export default InfoHelper;
