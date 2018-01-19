import React from 'react';
import classnames from 'classnames';
import {Tooltip} from '../common/styled-components';

const VisibilityToggle = ({id, isVisible, onClick}) => (
  <span className="layer--toggle">
    <a
      className="hover align--middle"
      data-tip
      data-for={`show-${id}`}
      onClick={e => onClick && onClick(e)}
    >
      <i
        className={classnames('icon visibility', {
          icon_eye: isVisible,
          'icon_eye-closed': !isVisible
        })}
      />
      <Tooltip id={`show-${id}`} effect="solid">
        <span>{isVisible ? 'hide' : 'show'}</span>
      </Tooltip>
    </a>
  </span>
);

VisibilityToggle.propTypes = {
  id: React.PropTypes.string,
  isVisible: React.PropTypes.bool,
  onClick: React.PropTypes.func
};

export default VisibilityToggle;
