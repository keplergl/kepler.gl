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
// import Switch from 'components/common/switch';
import {SidePanelDivider} from 'components/common/styled-components';
import IndicatorFactory from './indicator';

// import {
//   StyledPanelHeader,
//   PanelHeaderTitle,
//   PanelHeaderContent,
//   PanelContent
// } from 'components/common/styled-components';

// const StyledPanelContent = PanelContent.extend`
//   border-top: 1px solid ${props => props.theme.panelBorderColor};
// `;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
`;
const StyledIndicatorPanel = styled.div`
  padding-bottom: 6px;
`;

IndicatorPanelFactory.deps = [
  IndicatorFactory
];

function IndicatorPanelFactory(Indicator) {
  return class InteractionPanel extends Component {
    // static propTypes = {
    //   datasets: PropTypes.object.isRequired,
    //   config: PropTypes.object.isRequired,
    //   onConfigChange: PropTypes.func.isRequired
    // };

    // state = {isConfigActive: false};

    // _updateConfig = newProp => {
    //   this.props.onConfigChange({
    //     ...this.props.config,
    //     ...newProp
    //   });
    // };

    // _enableConfig = () => {
    //   this.setState({isConfigActive: !this.state.isConfigActive});
    // };

    render() {
    //   const {config, datasets} = this.props;
    //   const onChange = newConfig => this._updateConfig({config: newConfig});
    //   let template = null;

      return (
          <StyledIndicatorPanel className="indicator-panel">
          Transport Desirability Score
                <div style={{padding:'5px'}}></div>
            <Row>
                  <Indicator
                  label="Transport Desirability"
                  score={this.props.computeScore("desirability")}
                  />
                </Row>
                <SidePanelDivider/>
                Non-transport Mode Indicators
                <Row>
                <Indicator
                  label="Spatial"
                  score={this.props.computeScore("spatial")}
                  />
                  <Indicator
                  label="Temporal"
                  score={this.props.computeScore("temporal")}
                  />
                  <Indicator
                  label="Economic"
                  score={this.props.computeScore("economic")}
                  />
                </Row>
                <Row>
                <Indicator
                  label="Physical"
                  score={this.props.computeScore("physical")}
                  />
                </Row>
                <SidePanelDivider/>
                Transport Mode Indicators
                <Row>
                <Indicator
                  label="Psychological"
                  score={this.props.computeScore("psychological")}
                  />
                  <Indicator
                  label="Physiological"
                  score={this.props.computeScore("physiological")}
                  />
                </Row>
                <Row>
                <Indicator
                  label="Sustainability"
                  score={this.props.computeScore("sustainability")}
                  />
                  <Indicator
                  label="Performance"
                  score={this.props.computeScore("performance")}
                  />
                  <Indicator
                  label="Fairness"
                  score={this.props.computeScore("fairness")}
                  />
                </Row>
          </StyledIndicatorPanel>
        // <StyledInteractionPanel className="interaction-panel">
        //   <StyledPanelHeader
        //     className="interaction-panel__header"
        //     onClick={this._enableConfig}
        //   >
        //     <PanelHeaderContent className="interaction-panel__header__content">
        //       <div className="interaction-panel__header__icon icon">
        //         <config.iconComponent height="12px"/>
        //       </div>
        //       <div className="interaction-panel__header__title">
        //         <PanelHeaderTitle>{config.id}</PanelHeaderTitle>
        //       </div>
        //     </PanelHeaderContent>
        //     <div className="interaction-panel__header__actions">
        //       <Switch
        //         checked={config.enabled}
        //         id={`${config.id}-toggle`}
        //         onChange={() => this._updateConfig({enabled: !config.enabled})}
        //         secondary
        //       />
        //     </div>
        //   </StyledPanelHeader>
        //   {config.enabled && (
        //     <StyledPanelContent className="interaction-panel__content">
        //       {template}
        //     </StyledPanelContent>
        //   )}
        // </StyledInteractionPanel>
      );
    }
  }
}

export default IndicatorPanelFactory;
