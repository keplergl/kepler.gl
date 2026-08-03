// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {PanelHeaderFactory, Icons} from '@kepler.gl/components';
import {USER_GUIDE_DOC} from '@kepler.gl/constants';

export function CustomPanelHeaderFactory(...deps) {
  const PanelHeader = PanelHeaderFactory(...deps);
  const defaultActionItems = PanelHeader.defaultProps.actionItems;
  PanelHeader.defaultProps = {
    ...PanelHeader.defaultProps,
    actionItems: [
      {
        id: 'bug',
        iconComponent: Icons.Bug,
        tooltip: 'Bug Report',
        // Replaced at runtime by replacePanelHeader(onBugReportClick)
        onClick: () => {}
      },
      {
        id: 'docs',
        iconComponent: Icons.Docs2,
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

/**
 * Returns the [PanelHeaderFactory, CustomPanelHeaderFactory] pair for
 * injectComponents, with the bug-report button wired to `onBugReportClick`.
 *
 * @param {() => void} [onBugReportClick] - called when the Bug Report icon is clicked
 */
export function replacePanelHeader(onBugReportClick) {
  // Build a thin wrapper that forwards deps and patches the onClick at
  // factory-creation time using the closure over onBugReportClick.
  function PatchedPanelHeaderFactory(...deps) {
    const PanelHeader = CustomPanelHeaderFactory(...deps);
    if (typeof onBugReportClick === 'function') {
      const items = PanelHeader.defaultProps.actionItems.map(item =>
        item.id === 'bug' ? {...item, onClick: onBugReportClick} : item
      );
      PanelHeader.defaultProps = {...PanelHeader.defaultProps, actionItems: items};
    }
    return PanelHeader;
  }
  PatchedPanelHeaderFactory.deps = PanelHeaderFactory.deps;

  return [PanelHeaderFactory, PatchedPanelHeaderFactory];
}
