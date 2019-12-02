// Copyright (c) 2019 Uber Technologies, Inc.
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

import {PanelHeaderFactory, Icons} from 'kepler.gl/components';
import {GITHUB_BUG_REPORT, GITHUB_USER_GUIDE} from 'kepler.gl/constants';

export function CustomPanelHeaderFactory(SaveExportDropdown, SaveMapToBackendDropdown) {
  const PanelHeader = PanelHeaderFactory(SaveExportDropdown, SaveMapToBackendDropdown);

  PanelHeader.defaultProps = {
    ...PanelHeader.defaultProps,
    actionItems: [
      {
        id: 'bug',
        iconComponent: Icons.Bug,
        href: GITHUB_BUG_REPORT,
        blank: true,
        tooltip: 'Bug Report',
        onClick: () => {}
      },
      {
        id: 'docs',
        iconComponent: Icons.Docs,
        href: GITHUB_USER_GUIDE,
        blank: true,
        tooltip: 'User Guide',
        onClick: () => {}
      },
      {
        ...PanelHeader.defaultProps.actionItems.find(item => item.id === 'backendStorage'),
        label: null,
        tooltip: 'Save'
      },
      {
        ...PanelHeader.defaultProps.actionItems.find(item => item.id === 'save'),
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
