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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Switch from 'components/common/switch';

import BrushConfigFactory from './brush-config';
import TooltipConfigFactory from './tooltip-config';

import {
  StyledPanelHeader,
  PanelHeaderTitle,
  PanelHeaderContent,
  PanelContent
} from 'components/common/styled-components';

const StyledPanelContent = styled(PanelContent)`
  border-top: 1px solid ${props => props.theme.panelBorderColor};
`;

const StyledInteractionPanel = styled.div`
  padding-bottom: 6px;
`;

InteractionPanelFactory.deps = [
  TooltipConfigFactory,
  BrushConfigFactory
];

function InteractionPanelFactory(TooltipConfig, BrushConfig) {
  return class InteractionPanel extends Component {
    static propTypes = {
      datasets: PropTypes.object.isRequired,
      config: PropTypes.object.isRequired,
      onConfigChange: PropTypes.func.isRequired
    };

    state = {isConfigActive: false};

    _updateConfig = newProp => {
      this.props.onConfigChange({
        ...this.props.config,
        ...newProp
      });
    };

    _enableConfig = () => {
      this.setState({isConfigActive: !this.state.isConfigActive});
    };

    render() {
      const {config, datasets} = this.props;
      const onChange = newConfig => this._updateConfig({config: newConfig});
      let template = null;

      switch (config.id) {
        case 'tooltip':
          template = (
            <TooltipConfig
              datasets={datasets}
              config={config.config}
              onChange={onChange}
            />
          );
          break;

        case 'brush':
          template = <BrushConfig config={config.config} onChange={onChange} />;
          break;

        default:
          break;
      }

      return (
        <StyledInteractionPanel className="interaction-panel">
          <StyledPanelHeader
            className="interaction-panel__header"
            onClick={this._enableConfig}
          >
            <PanelHeaderContent className="interaction-panel__header__content">
              <div className="interaction-panel__header__icon icon">
                <config.iconComponent height="12px"/>
              </div>
              <div className="interaction-panel__header__title">
                <PanelHeaderTitle>{config.id}</PanelHeaderTitle>
              </div>
            </PanelHeaderContent>
            <div className="interaction-panel__header__actions">
              <Switch
                checked={config.enabled}
                id={`${config.id}-toggle`}
                onChange={() => this._updateConfig({enabled: !config.enabled})}
                secondary
              />
            </div>
          </StyledPanelHeader>
          {config.enabled && (
            <StyledPanelContent className="interaction-panel__content">
              {template}
            </StyledPanelContent>
          )}
        </StyledInteractionPanel>
      );
    }
  }
}

export default InteractionPanelFactory;
