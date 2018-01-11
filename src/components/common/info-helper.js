import React from 'react';
import {Tooltip} from './styled-components';

const propTypes = {
  description: React.PropTypes.string.isRequired,
  containerClass: React.PropTypes.string,
  tooltipSize: React.PropTypes.string,
  icon: React.PropTypes.string
};

const InfoHelper = ({description, containerClass, icon, id}) => (
  <div className={`info-helper ${containerClass || ''}`}>
    <a data-tip data-for={id}>
      <i className={`icon icon_${icon || 'info'} zeta transition--slow`}/>
      <Tooltip id={id} effect="solid">
        <div className="info-helper__content">{description}</div>
      </Tooltip>
    </a>
  </div>
);

InfoHelper.propTypes = propTypes;

export default InfoHelper;
