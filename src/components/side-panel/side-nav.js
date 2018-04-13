// Copyright (c) 2018 Uber Technologies, Inc.
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
import classnames from 'classnames';
import {Tooltip} from 'components/common/styled-components';
import {PANELS, PANELS_FOOTER} from 'constants/default-settings';

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
    onClick={() => togglePanel(item.id)}
  >
    <a className="hover align--middle" data-tip data-for={`${item.id}-nav`}>
      <span className={`icon icon_${item.icon}`} />
      {isCollapsed ? (
        <Tooltip
          id={`${item.id}-nav`}
          effect="solid"
          delayShow={500}
          place="right"
        >
          <span>{item.label}</span>
        </Tooltip>
      ) : (
        <span className="side-navi__item__title">{item.label}</span>
      )}
    </a>
  </li>
);

export default SideNav;
