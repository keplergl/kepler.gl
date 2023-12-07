// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {useIntl} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import {Tooltip} from './styled-components';
import {Docs} from './icons';
import styled from 'styled-components';
import {camelize} from '@kepler.gl/utils';

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
