import React from 'react';
import {Tooltip} from './styled-components';
import {Docs} from 'components/common/icons';
import styled from 'styled-components';

const StyledInfoHelper = styled.div`
  align-items: center;
  margin-left: 10px;
  color: ${props =>props.theme.labelColor};
  display: inline-flex;

  .info-helper__content {
    max-width: 100px;
  }
  
  :hover {
    cursor: pointer;
    color: ${props =>props.theme.textColorHl};
  }
`;

const propTypes = {
  description: React.PropTypes.string.isRequired,
  containerClass: React.PropTypes.string,
};

const InfoHelper = ({description, containerClass, id}) => (
  <StyledInfoHelper className={`info-helper ${containerClass || ''}`} data-tip data-for={id}>
    <Docs height="16px"/>
    <Tooltip id={id} effect="solid">
      <div className="info-helper__content">{description}</div>
    </Tooltip>
  </StyledInfoHelper>
);

InfoHelper.propTypes = propTypes;

export default InfoHelper;
