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
import {SidePanelDivider, Tooltip} from 'components/common/styled-components';
import IndicatorFactory from './indicator';
import {
  TRANSPORT_DESIRABILITY,
  NON_TRANSPORT_MODE,
  TRANSPORT_MODE
} from 'constants/default-settings';
import { RangeFilter } from '../../filters';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  flex-wrap: wrap;
  width: 100%;
`;

const StyledIndicatorPanel = styled.div`
  padding-bottom: 6px;
`;

const StyledIndicatorSection = styled.div`
  font-size: 1.1em;
  font-weight: 500;
  // padding-bottom: 6px;
`;

const StyledIndicatorContent = styled.div`
  display: block;
  // flex-direction: row;
  // text-align: center;
  // flex-wrap: wrap;
  width: 100%;
`;

IndicatorPanelFactory.deps = [IndicatorFactory];

function IndicatorPanelFactory(Indicator) {

  return class InteractionPanel extends Component {
    // _onclick = () => {
    //   console.error(1234);
    // };

    render() {
      let idx = 0;
      return (

        <StyledIndicatorPanel className="indicator-panel">
          {/* <StyledIndicatorSection className="indicator-panel__section">
            {TRANSPORT_DESIRABILITY.label}
          </StyledIndicatorSection>
          <div style={{padding: '5px'}} />
          <StyledIndicatorContent className="indicator-panel__content">
            {TRANSPORT_DESIRABILITY.indicators.map(indicator => (
              <div>
              <Indicator
                id={indicator.id}
                label={indicator.label}
                description={indicator.description}
                score={
                  this.props.scores ? this.props.scores[indicator.id] || '' : ''
                }
                selected={indicator.id === this.props.selectedIndicator}
                onConfigChange={this.props.onConfigChange}
                filter={this.props.filters[idx]}
                setFilter={value => this.props.setFilter(idx, 'value', value)}
              />
              </div>
            ))}
          </StyledIndicatorContent>

          <SidePanelDivider /> */}
          {      console.error('INDICATOR MANAGER START')}
          <StyledIndicatorSection className="indicator-panel__section">
            {NON_TRANSPORT_MODE.label}
          </StyledIndicatorSection>
          <div style={{padding: '5px'}} />
          <StyledIndicatorContent className="indicator-panel__content">
            {NON_TRANSPORT_MODE.indicators.map(indicator => (
              <div>
              <Indicator
                id={indicator.id}
                label={indicator.label}
                description={indicator.description}
                score={
                  this.props.scores ? this.props.scores[indicator.id] || '' : ''
                }
                selected={indicator.id === this.props.selectedIndicator}
                onConfigChange={this.props.onConfigChange}
                filter={this.props.filters[idx]}
                setFilter={value => this.props.setFilter(idx, 'value', value)}
                reset={value => this.props.setFilter(idx, 'value', this.props.filters[idx].domain)}
              />
              {/* {indicator.id === this.props.selectedIndicator?
              <RangeFilter
                filter={this.props.filters[idx]}
                setFilter={value => this.props.setFilter(idx, 'value', value)}
                />
                 : null
              } */}
              </div>
            ))}
          </StyledIndicatorContent>

          <div style={{marginTop: '10px'}} />
          <SidePanelDivider />

          <StyledIndicatorSection className="indicator-panel__section">
            {TRANSPORT_MODE.label}
          </StyledIndicatorSection>
          <div style={{padding: '5px'}} />
          <StyledIndicatorContent className="indicator-panel__content">
            {TRANSPORT_MODE.indicators.map(indicator => (
              <div>
              <Indicator
                id={indicator.id}
                label={indicator.label}
                description={indicator.description}
                score={
                  this.props.scores ? this.props.scores[indicator.id] || '' : ''
                }
                selected={indicator.id === this.props.selectedIndicator}
                onConfigChange={this.props.onConfigChange}
                filter={this.props.filters[idx]}
                setFilter={value => this.props.setFilter(idx, 'value', value)}
                reset={value => this.props.setFilter(idx, 'value', this.props.filters[idx].domain)}
              />
              {/* {indicator.id === this.props.selectedIndicator?
              <RangeFilter
                filter={this.props.filters[idx]}
                setFilter={value => this.props.setFilter(idx, 'value', value)}
                />
                 : null
              } */}
              </div>
            ))}
          </StyledIndicatorContent>
          {      console.error('INDICATOR MANAGER END')}

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
  };
}

export default IndicatorPanelFactory;
