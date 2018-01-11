import React from 'react';
import classnames from 'classnames';
import {Tooltip} from '../common/styled-components';
import {PANELS, PANELS_FOOTER} from '../../constants/default-settings';

const SideNav = itemProps => (
  <div className={classnames('side-navi', {collapsed: itemProps.isCollapsed})}>
    <div>
      <ul>
        {PANELS.map(item => (
          <NavItem {...itemProps} key={item.id} item={item} />
        ))}
      </ul>
    </div>
    <div>
      <ul>
        {PANELS_FOOTER.map(item => (
          <NavItem {...itemProps} key={item.id} item={item} />
        ))}
      </ul>
    </div>
  </div>
);

const NavItem = ({activePanel, item, isCollapsed, togglePanel}) => (
  <li
    className={classnames('side-navi__item', {active: activePanel === item.id})}
    onClick={() => togglePanel(item.id)}>
    <a className="hover align--middle" data-tip data-for={`${item.id}-nav`}>
      <span className={`icon icon_${item.icon}`} />
      {isCollapsed ? (
        <Tooltip
          id={`${item.id}-nav`}
          effect="solid"
          delayShow={500}
          place="right">
          <span>{item.label}</span>
        </Tooltip>
      ) : (
        <span className="side-navi__item__title">{item.label}</span>
      )}
    </a>
  </li>
);

export default SideNav;
