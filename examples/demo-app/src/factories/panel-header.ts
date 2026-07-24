// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {PanelHeaderFactory, Icons} from '@kepler.gl/components';
import {BUG_REPORT_LINK, USER_GUIDE_DOC} from '@kepler.gl/constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CustomPanelHeaderFactory(...deps: any[]) {
  const PanelHeader = (PanelHeaderFactory as (...args: any[]) => any)(...deps);
  const defaultActionItems = PanelHeader.defaultProps?.actionItems || [];
  PanelHeader.defaultProps = {
    ...PanelHeader.defaultProps,
    actionItems: [
      {
        id: 'bug',
        iconComponent: Icons.Bug,
        href: BUG_REPORT_LINK,
        blank: true,
        tooltip: 'Bug Report',
        onClick: undefined
      },
      {
        id: 'docs',
        iconComponent: Icons.Docs2,
        href: USER_GUIDE_DOC,
        blank: true,
        tooltip: 'User Guide',
        onClick: undefined
      },
      defaultActionItems.find((item: any) => item.id === 'storage'),
      {
        ...defaultActionItems.find((item: any) => item.id === 'save'),
        label: undefined,
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
