// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PropsWithChildren} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

const StyledPanelTitle = styled.div.attrs(props => ({
  className: classnames('panel-title', props.className)
}))`
  color: ${props => props.theme.titleTextColor};
  font-size: ${props => props.theme.sidePanelTitleFontsize};
  line-height: ${props => props.theme.sidePanelTitleLineHeight};
  font-weight: 400;
  letter-spacing: 1.25px;
`;

const PanelHeaderRow = styled.div.attrs({
  className: 'layer-manager-header'
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 32px;
`;

export type PanelTitleProps = PropsWithChildren<{
  title: string;
  className?: string;
}>;

const PanelTitleFactory = () => {
  const PanelTitle: React.FC<PanelTitleProps> = ({title, className, children}) => (
    <PanelHeaderRow>
      <StyledPanelTitle className={className || 'panel-title'}>{title}</StyledPanelTitle>
      {children}
    </PanelHeaderRow>
  );

  return PanelTitle;
};

export default PanelTitleFactory;
