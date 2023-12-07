// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import styled from 'styled-components';
import PanelTabFactory, {PanelItem} from './panel-tab';
import {toggleSidePanel, ActionHandler} from '@kepler.gl/actions';

type PanelToggleProps = {
  panels: PanelItem[];
  activePanel: string | null;
  togglePanel: ActionHandler<typeof toggleSidePanel>;
};

const PanelHeaderBottom = styled.div.attrs({
  className: 'side-side-panel__header__bottom'
})`
  background-color: ${props => props.theme.sidePanelHeaderBg};
  border-bottom: 1px solid ${props => props.theme.sidePanelHeaderBorder};
  padding: 0 16px;
  display: flex;
  min-height: 30px;
`;

PanelToggleFactory.deps = [PanelTabFactory];

function PanelToggleFactory(PanelTab: ReturnType<typeof PanelTabFactory>) {
  const PanelToggle: React.FC<PanelToggleProps> = ({activePanel, panels, togglePanel}) => {
    const onClick = useCallback(
      panel => {
        const callback = panel.onClick || togglePanel;
        callback(panel.id);
      },
      [togglePanel]
    );

    return (
      <PanelHeaderBottom>
        {panels.map(panel => (
          <PanelTab
            key={panel.id}
            panel={panel}
            isActive={activePanel === panel.id}
            onClick={() => onClick(panel)}
          />
        ))}
      </PanelHeaderBottom>
    );
  };

  return PanelToggle;
}

export default PanelToggleFactory;
