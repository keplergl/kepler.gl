// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

import {PanelToggleFactory, Button, Icons, withState} from '@kepler.gl/components';
import {visStateLens} from '@kepler.gl/reducers';

import {setMapConfig} from '../app-reducer';

const StyledPanelToggleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 16px;
  background-color: ${props => props.theme.sidePanelHeaderBg};
`;

const ButtonWrapper = styled.div`
  margin-bottom: 4px;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomPanelToggleFactory = (...deps: any[]) => {
  const PanelToggle = (PanelToggleFactory as (...args: any[]) => any)(...deps);
  const PanelToggleWrapper = (props: any) => (
    <StyledPanelToggleWrapper>
      <PanelToggle {...props} />
      <ButtonWrapper>
        <Button onClick={() => props.onClickSaveConfig(props.mapState)} width="120px">
          <Icons.Files height="12px" />
          Save Config
        </Button>
      </ButtonWrapper>
    </StyledPanelToggleWrapper>
  );

  return withState(
    // lenses
    [visStateLens],
    // mapStateToProps
    (state: any) => ({mapState: state.keplerGl.map1}),
    {
      onClickSaveConfig: setMapConfig
    }
  )(PanelToggleWrapper);
};
CustomPanelToggleFactory.deps = PanelToggleFactory.deps;
export default CustomPanelToggleFactory;
