// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {PanelHeaderFactory, Icons} from '@kepler.gl/components';
import {BUG_REPORT_LINK, USER_GUIDE_DOC} from '@kepler.gl/constants';

export function CustomPanelHeaderFactory(...deps) {
  const PanelHeader = PanelHeaderFactory(...deps);
  const defaultActionItems = PanelHeader.defaultProps.actionItems;
  PanelHeader.defaultProps = {
    ...PanelHeader.defaultProps,
    actionItems: [
      {
        id: 'bug',
        iconComponent: Icons.Bug,
        href: BUG_REPORT_LINK,
        blank: true,
        tooltip: 'Bug Report',
        onClick: () => {}
      },
      {
        id: 'docs',
        iconComponent: Icons.Docs,
        href: USER_GUIDE_DOC,
        blank: true,
        tooltip: 'User Guide',
        onClick: () => {}
      },
      defaultActionItems.find(item => item.id === 'storage'),
      {
        ...defaultActionItems.find(item => item.id === 'save'),
        label: null,
        tooltip: 'Share'
      }
    ]
  };
  return PanelHeader;
}

CustomPanelHeaderFactory.deps = PanelHeaderFactory.deps;

export function replacePanelHeader() {
  return [PanelHeaderFactory, CustomPanelHeaderFactory];
}
