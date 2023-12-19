// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PropsWithChildren} from 'react';
import styled from 'styled-components';

export type PanelTitleProps = PropsWithChildren<{
  title: string;
  className?: string;
}>;

type StyledSidePanelTitleProps = {className: string};
const StyledSidePanelTitle = styled.div.attrs<StyledSidePanelTitleProps>({
  className: 'panel-title'
})`
  color: ${props => props.theme.titleTextColor};
  font-size: ${props => props.theme.sidePanelTitleFontsize};
  line-height: ${props => props.theme.sidePanelTitleLineHeight};
  font-weight: 400;
  letter-spacing: 1.25px;
`;

const PanelHeaderRow = styled.div.attrs({
  className: 'side-panel-header-row'
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0px;
  margin-bottom: 8px;
`;

const SidePanelTitleFactory = (): React.FC<PanelTitleProps> => {
  const SidePanelTitle = ({title, className, children}: PanelTitleProps) => (
    <PanelHeaderRow>
      <StyledSidePanelTitle className={className || 'side-panel-title'}>
        {title}
      </StyledSidePanelTitle>
      {children}
    </PanelHeaderRow>
  );

  return SidePanelTitle;
};

export default SidePanelTitleFactory;
