// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {PanelHeaderFactory, Icons, withState} from '@kepler.gl/components';
import {toggleModal} from '@kepler.gl/actions';
import React from 'react';
import {IntlProvider} from 'react-intl';

const KEPLER_DOC = 'https://docs.kepler.gl/docs/keplergl-jupyter';

export function CustomPanelHeaderFactory() {
  const PanelHeader = PanelHeaderFactory();

  const actionItems = props => [
    {
      id: 'docs',
      iconComponent: Icons.Docs,
      href: KEPLER_DOC,
      blank: true,
      tooltip: 'tooltip.documentation',
      onClick: () => {}
    }
  ];

  const JupyterPanelHeader = props => (
    <IntlProvider locale="en" messages={{'tooltip.documentation': 'Documentation'}}>
      <PanelHeader {...props} actionItems={actionItems(props)} />
    </IntlProvider>
  );
  return withState([], state => state, {
    toggleModal
  })(JupyterPanelHeader);
}

export default CustomPanelHeaderFactory;
