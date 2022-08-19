// Copyright (c) 2022 Uber Technologies, Inc.
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
import {useIntl} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import {Tooltip} from './styled-components';
import {Docs} from 'components/common/icons';
import styled from 'styled-components';
import {camelize} from '../../utils';

interface StyledInfoHelperProps {
  width?: number;
}

const StyledInfoHelper = styled.div<StyledInfoHelperProps>`
  align-items: center;
  margin-left: 10px;
  color: ${props => props.theme.labelColor};
  display: inline-flex;
  .info-helper__content {
    width: ${props => (props.width ? `${props.width}px` : 'auto')};
    max-width: ${props => (props.width ? 'auto' : '100px')};
  }
  :hover {
    cursor: pointer;
    color: ${props => props.theme.textColorHl};
  }
`;

interface InfoHelperProps {
  description: string;
  containerClass?: string;
  width?: number;
  property?: string;
  id?: string;
}

function InfoHelperFactory() {
  const InfoHelper = ({description, property, containerClass, width, id}: InfoHelperProps) => {
    // TODO: move intl out
    const intl = useIntl();

    return (
      <StyledInfoHelper
        className={`info-helper ${containerClass || ''}`}
        width={width}
        data-tip
        data-for={id}
      >
        <Docs height="16px" />
        <Tooltip id={id} effect="solid">
          <div className="info-helper__content">
            {description && (
              <FormattedMessage
                id={description}
                defaultValue={description}
                values={{
                  property: intl.formatMessage({
                    id: property ? `property.${camelize(property)}` : 'misc.empty'
                  })
                }}
              />
            )}
          </div>
        </Tooltip>
      </StyledInfoHelper>
    );
  };
  return InfoHelper;
}

export default InfoHelperFactory;
