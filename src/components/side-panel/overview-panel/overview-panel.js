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
import IndicatorFactory from './../indicator-panel/indicator';
import {TRANSPORT_DESIRABILITY} from 'constants/default-settings';
import { BGY_DATA_DISPLAY } from 'utils/filter-utils';
import BarChartFactory from './../../plexus-analysis/bar-chart';
import StackedBarChartFactory from './../../plexus-analysis/stacked-bar';

// import OverviewFactory from './Overview';
// import {
//   TRANSPORT_DESIRABILITY,
//   NON_TRANSPORT_MODE,
//   TRANSPORT_MODE
// } from 'constants/default-settings';

const StyledTDLabel = styled.div`
  font-size: 1.1em;
  font-weight:500;
`;

const StyledOverviewPanel = styled.div`
  padding-bottom: 6px;
`;

const StyledOverviewHeader = styled.div`
  font-size: 1.5em;
`;

const StyledOverviewContent = styled.div`
  display: block;
  width: 100%;
`;

const StyledOverviewInfo = styled.div`
    margin-right: 10px;
    margin-left: 10px;
    font-size: 1.2em;
    font-weight: 500;
`;

// from indicator panel
const StyledIndicatorSection = styled.div`
  // padding-bottom: 6px;
`;

const StyledIndicatorContent = styled.div`
  display: block;
  // flex-direction: row;
  // text-align: center;
  // flex-wrap: wrap;
  width: 100%;
`;
OverviewPanelFactory.deps = [IndicatorFactory, BarChartFactory, StackedBarChartFactory];

function OverviewPanelFactory(Indicator, BarChart, StackedBarChart) {
  
  return class InteractionPanel extends Component {

    render() {
      const DEFAULT_LIST = 5;
      let bgyIncl;
      let maxListSize = DEFAULT_LIST;

      if(this.props.datasets && !(Object.entries(this.props.datasets).length === 0 && this.props.datasets.constructor === Object)) {
        if(this.props.datasets.barangays) {
          maxListSize = Math.min(DEFAULT_LIST, this.props.datasets.barangays.allData.length);

          // formatted barangay data
          bgyIncl = []
          this.props.datasets.barangays.allData.forEach((d) => {
            let obj = {}
            BGY_DATA_DISPLAY.forEach((b) => {
              obj[b.id] = d[b.idx];
            })
            bgyIncl.push(obj);
          });
          bgyIncl = bgyIncl.sort((a, b) => b['desirability'] - a['desirability']);
        }
      }
      // console.error('OVERVIEW PANEL!');

      let idx = 0;
      return (
        <StyledOverviewPanel className="overview-panel">
          <StyledOverviewContent className="overview-panel__content">
            {/* <StyledOverviewInfo>Actual Population: 30210</StyledOverviewInfo>
            <StyledOverviewInfo>Sample Size: 1021</StyledOverviewInfo> */}
            {/* {!visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value && bgyIncl ? ( */}
                {/* <div className="breakdown-analysis__section"> */}
                  <StackedBarChart
                    title={'Survey Sample'}
                    values={[1021,30210 - 1021]}
                     />
                {/* </div> */}
              {/* ) : null} */}
          </StyledOverviewContent>
          <SidePanelDivider/>
          <div style={{marginBottom: '10px'}} />
          <StyledIndicatorSection className="indicator-panel__section">
            <StyledTDLabel>Transport Desirability</StyledTDLabel>
          </StyledIndicatorSection>
          <StyledIndicatorContent className="indicator-panel__content">
            {TRANSPORT_DESIRABILITY.indicators.map(indicator => (
              <div>
                <Indicator
                  id={indicator.id}
                  label={indicator.label}
                  description={indicator.description}
                  score={
                    this.props.scores
                      ? this.props.scores[indicator.id] || ''
                      : ''
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
          <div style={{marginBottom: '15px'}} />
          {bgyIncl ?
            <StackedBarChart
              title={'Distribution'}
              activeIndicator={'desirability'} 
              data={bgyIncl}
              legends={this.props.legends}
              />
            : null}
          <div style={{marginBottom: '5px'}} />
          {bgyIncl? <BarChart
            floatFormat
            listSize={bgyIncl.length}
            maxBar={maxListSize}
            data={bgyIncl}
            xKey={'desirability'}
            yKey={'name'}
            title={'Rankings'}
            onLabelClick={(id) => { 
              let idIndex = BGY_DATA_DISPLAY.filter(bdd=>bdd.id=='id')[0].idx;
              let newBgy = this.props.datasets.barangays.data.filter(b=>b[idIndex]==id)[0];
              this.props.changeBarangay(newBgy);
            }}                                
            paginationFunc={this.props.paginationFunc}
            reverseFunc={this.props.reverseFunc}
            analysisRankingReverse={this.props.rankingReverse}
            analysisRankingPage={this.props.rankingPage}
            /> : null }
            {/* {/* {console.error('END OVERVIEW PANEL')} */}
        </StyledOverviewPanel>
      );
    }
  };
}

export default OverviewPanelFactory;