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

import React from 'react';
import styled from 'styled-components';

import {SelectTextBold, IconRoundSmall, CenterFlexbox} from 'components/common/styled-components';
import {Close, Clock, LineChart} from 'components/common/icons';

import PropTypes from 'prop-types';
import TimeWidgetFactory from './filters/time-widget';
import { INDICATORS, ANALYSIS_TABS_DEF, ANALYSIS_TABS_BGY } from 'utils/filter-utils';

import {scaleLinear} from 'd3-scale';

import BarChartFactory from './plexus-analysis/bar-chart';
import ParallelCoordinatesKFactory from './plexus-analysis/parallel-coordinates';


const innerPdSide = 32;

const propTypes = {
  filters: PropTypes.arrayOf(PropTypes.object),
  datasets: PropTypes.object,
  uiState: PropTypes.object,
  visState: PropTypes.object,
  visStateActions: PropTypes.object,
  uiStateActions: PropTypes.object,
  sidePanelWidth: PropTypes.number,
  containerW: PropTypes.number
};

const maxWidth = 1080;
const modMaxWidth = 1540;

BottomWidgetFactory.deps = [TimeWidgetFactory, BarChartFactory, ParallelCoordinatesKFactory];

const AnalysisSectionToggle = ({activeTab, update, barangay}) => (
  <Tabs>
    {barangay ? 
      (Object.keys(ANALYSIS_TABS_BGY).map((e) => (
        <Tab key={ANALYSIS_TABS_DEF[e].value} active={ANALYSIS_TABS_DEF[e].value === activeTab}
          onClick={() => { update(ANALYSIS_TABS_BGY[e].value); console.log(ANALYSIS_TABS_BGY[e].label + " " + ANALYSIS_TABS_BGY[e].value); }}>{ANALYSIS_TABS_BGY[e].label}</Tab>
      ))) : 
      (Object.keys(ANALYSIS_TABS_DEF).map((e) => (
        <Tab key={ANALYSIS_TABS_DEF[e].value} active={ANALYSIS_TABS_DEF[e].value === activeTab}
          onClick={() => { update(ANALYSIS_TABS_DEF[e].value); console.log(ANALYSIS_TABS_DEF[e].label + " " + ANALYSIS_TABS_DEF[e].value); }}>{ANALYSIS_TABS_DEF[e].label}</Tab>
      )))
    }
     
  </Tabs>
);

const AnalysisSectionWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 32px;
`;

const RankingAnalysis = styled.div`
  flex-grow: 3;
  margin-top: 20px;  
  height: 100%;

  .ranking-analysis__section {
    display: flex;
    justify-content: center;
    padding-top: 10px;
    // flex-direction: row;
  }
  .ranking-analysis__section:nth-child(1) {
    padding-top: 0;
  }

  .ranking-analysis__section > * {
    padding-left: 30px;
  }
  .ranking-analysis__section > * :nth-child(1) {
    padding-left: 0;
  }
`;

const BreakdownAnalysis = styled.div`
  flex-grow: 7;
  display: flex;

  justify-content: flex-start;
  align-items: center;
  
  .breakdown-analysis__section {
    // flex-grow: 1;
    display: flex;
    // justify-content: center;
    margin: 0;
    margin-right: 50px;
  }
`;

const BarangayInfo = styled.div`
  flex-grow: 3;
  max-width: 300px;
  margin-top: 15px;

  .barangay-info__section {
    display: flex;
    justify-content: flex-start;
    padding-top: 5px;
  }
  .barangay-info__section:nth-child(1) {
    padding-top: 0;
    padding-bottom: 5px;
  }
  .barangay-info__section > div {
    padding-top: 0;
    padding-left: 30px;
  }
  .barangay-info__section > div:nth-child(1) {
    padding-left: 0;
  }
`;

const BarangayInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: ${props => props.theme.labelColor};

  .barangay-info__wrapper__main {
    font-weight: 900;
    font-size: 2em;
    line-height: 1;
    color: ${props => props.theme.textColorHl};
  }

  .barangay-info__wrapper__value {
    font-weight: 900;
    font-size: 1.7em;
    line-height: 1;
  }

  .barangay-info__wrapper__label {
    font-size: 1.2em;
    font-weight: 100;
  }
`;

const RankingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.labelColor};

  .ranking-wrapper__score {
    font-weight: 900;
    font-size: 2em;
    line-height: 1;
  }

  // TODO: transfer colors to styles.js
  .ranking-wrapper__score--good {
    color: green;
  }
  .ranking-wrapper__score--okay {
    color: yellow;
  }
  .ranking-wrapper__score--bad {
    // color: red; 
    color: #dd5239;
  }
  .ranking-wrapper__label {
    font-size: 1.4em;
  }
`;

const WidgetContainer = styled.div`
  position: absolute;
  padding-top: ${props => props.theme.sidePanel.margin.top}px;
  padding-right: ${props => props.theme.sidePanel.margin.right}px;
  padding-bottom: ${props => props.theme.sidePanel.margin.bottom}px;
  padding-left: ${props => props.theme.sidePanel.margin.left}px;  
  bottom: 0;
  right: 0;
  z-index: 5;
  maxWidth: ${props => props.width}px;
  width: 100vw;

  .bottom-widget--inner {
    background-color: ${props => props.theme.sidePanelBg};
    padding: 10px ${innerPdSide}px;
    position: relative;
  }
`;

const TopSectionWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: ${innerPdSide * 2}px;
  color: ${props => props.theme.labelColor};
  
  .bottom-widget__y-axis {
    flex-grow: 1;
    margin-left: 20px;
  }
  
  .bottom-widget__field-select {
    width: 160px;
    display: inline-block;
  }
`;

/* eslint-disable no-unused-vars */
const Tabs = styled.div`
  padding-right: 76px;
`;

const Tab = styled.div`
  border-bottom: 1px solid
    ${props => (props.active ? props.theme.textColorHl : 'transparent')};
  color: ${props =>
  props.active ? props.theme.textColorHl : props.theme.labelColor};
  display: inline-block;
  font-size: 12px;
  height: 24px;
  margin-right: 4px;
  text-align: center;
  // width: 24px;
  line-height: 24px;
  padding: 0px 12px;

  :hover {
    cursor: pointer;
  }
`;
/* eslint-enable no-unused-vars */

const StyledTitle = CenterFlexbox.extend`
  flex-grow: 0;
  color: ${props => props.theme.textColor};

  .bottom-widget__icon {
    margin-right: 6px;
  }
`;

export default function BottomWidgetFactory(TimeWidget, BarChart, ParallelCoordinatesK) {

  const BottomWidget = (props) => {
    const {
      datasets,
      filters,
      visStateActions,
      uiStateActions,
      containerW,
      uiState,
      sidePanelWidth,
      selected,
      visState
    } = props;
    const {activeSidePanel} = uiState;
    const isOpen = Boolean(activeSidePanel);
    const width = modMaxWidth;

    const DEFAULT_LIST = 10;
    const SCALE = 1;

    const tdIndex = 6;
    const bgyNameIndex = 1;
    const currView = selected;
    
    let cityMeans = [];
    var indicatorValues = [];
    INDICATORS.forEach(i => indicatorValues.push(i.value));

    let maxListSize = DEFAULT_LIST;
    let bgyIncl;
    let bgy;    
    let ranking;

    console.log("bottom-widget.js: props: dataset");
    console.log(visState.activeBarangay);
    if(datasets.barangays) {
      if(datasets.barangays.data) {
        console.log(datasets);
        maxListSize = Math.min(DEFAULT_LIST, datasets.barangays.data.length);

        bgyIncl = datasets.barangays.data.map((d, idx) => ({
          [datasets.barangays.fields[1].name]: d[datasets.barangays.fields[1].tableFieldIndex - 1],
          [datasets.barangays.fields[2].name]: d[datasets.barangays.fields[2].tableFieldIndex - 1],
          [datasets.barangays.fields[3].name]: d[datasets.barangays.fields[3].tableFieldIndex - 1],
          // LATITUDE [datasets.barangays.fields[4].name]: d[datasets.barangays.fields[4].tableFieldIndex - 1],
          // LONGITUDE [datasets.barangays.fields[5].name]: d[datasets.barangays.fields[5].tableFieldIndex - 1],
          [datasets.barangays.fields[6].name]: d[datasets.barangays.fields[6].tableFieldIndex - 1],
          [datasets.barangays.fields[7].name]: d[datasets.barangays.fields[7].tableFieldIndex - 1],
          [datasets.barangays.fields[8].name]: d[datasets.barangays.fields[8].tableFieldIndex - 1],
          [datasets.barangays.fields[9].name]: d[datasets.barangays.fields[9].tableFieldIndex - 1],
          [datasets.barangays.fields[10].name]: d[datasets.barangays.fields[10].tableFieldIndex - 1],
          [datasets.barangays.fields[11].name]: d[datasets.barangays.fields[11].tableFieldIndex - 1],
          [datasets.barangays.fields[12].name]: d[datasets.barangays.fields[12].tableFieldIndex - 1],
          [datasets.barangays.fields[13].name]: d[datasets.barangays.fields[13].tableFieldIndex - 1],
          [datasets.barangays.fields[14].name]: d[datasets.barangays.fields[14].tableFieldIndex - 1],
          [datasets.barangays.fields[15].name]: d[datasets.barangays.fields[15].tableFieldIndex - 1],
        }));
        bgyIncl = bgyIncl.sort((a, b) => b[currView] - a[currView]);
        

        datasets.barangays.fields.forEach((e) => {
          if(indicatorValues.includes(e.name)) {
            cityMeans.push({
              value: e.name,
              y: INDICATORS[INDICATORS.findIndex(i => i.value == e.name)].label,
              x: (bgyIncl.reduce((total, next)=> total + next[e.name], 0)) / bgyIncl.length,
            });
          }
        });
      }
      if(visState.activeBarangay) {
        bgy = visState.activeBarangay.map((d, idx) => ({
          x: d,
          label: datasets.barangays.fields[idx].name,
        }));
        bgy = bgy.filter(e => e.label != '_geojson' && e.label != 'latitude' && e.label != 'longitude');

        bgy = bgy.map((d, idx) => ({
          ...d,
          y: INDICATORS.findIndex(i => i.value == d.label) >= 0 ? INDICATORS[INDICATORS.findIndex(i => i.value == d.label)].label : '',                    
        }));
        console.log(bgyIncl);
        console.log(bgy);
        console.log(bgy.findIndex(b => b.label == 'name'));
        // console.log(bgy);
        ranking = bgyIncl.findIndex(i=>i.name == bgy[bgy.findIndex(b => b.label == 'name')].x) + 1;
        console.log("ranking: " + ranking);
      }
    }

    const ACTIVE_INDICATOR_LABEL = INDICATORS[INDICATORS.findIndex(d => d.value == currView)].label;

    return (
      <WidgetContainer width={width}>
        <div className="bottom-widget--inner">
          <TopSectionWrapper>
            <AnalysisSectionToggle
              update={(activeAnalysisTab) => { visStateActions.toggleActiveAnalysis(activeAnalysisTab); } } 
              activeTab={visState.activeAnalysisTab} 
              barangay={visState.activeBarangay} />
            <IconRoundSmall>
              <Close height="12px" onClick={() => { visStateActions.toggleActiveAnalysis(''); }} />
            </IconRoundSmall>
          </TopSectionWrapper>
          <AnalysisSectionWrapper> {/* TODO: currently in TD mode, make dynamic according to tabs */}
            {!visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_DEF.transportDesirability.value ?
              (
                <RankingAnalysis>
                  <div className="ranking-analysis__section">
                    <RankingWrapper>
                      <div className="ranking-wrapper__score ranking-wrapper__score--bad">
                        {(cityMeans[cityMeans.findIndex(d => d.value == currView)].x * SCALE).toFixed(2)}%
                      </div>
                      <div className="ranking-wrapper__label">
                        {INDICATORS[INDICATORS.findIndex(d => d.value == currView)].label} {currView != 'desirability' ? 'Indicator' : ''} Score
                      </div>
                    </RankingWrapper>
                  </div>
                </RankingAnalysis>
              ) : null}
            {visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value ?
              (
                <BarangayInfo>
                  <div className="barangay-info__section">
                    <BarangayInfoWrapper>
                      <div className="barangay-info__wrapper__main">
                        {bgy.filter(e=>e.label=='name')[0].x}
                      </div>
                    </BarangayInfoWrapper>
                  </div>
                  <div className="barangay-info__section">
                    <BarangayInfoWrapper>
                      <div className="barangay-info__wrapper__label">
                        Population:
                      </div>
                      <div className="barangay-info__wrapper__value">
                        {bgy.filter(e=>e.label=='population')[0].x.toLocaleString()}
                      </div>
                    </BarangayInfoWrapper>
                    <BarangayInfoWrapper>
                      <div className="barangay-info__wrapper__label">
                        Average Income:
                      </div>
                      <div className="barangay-info__wrapper__value">
                        {bgy.filter(e=>e.label=='income')[0].x.toLocaleString()}
                      </div>
                    </BarangayInfoWrapper>
                  
                  </div>
                  <div className="barangay-info__section">
                    <BarangayInfoWrapper>
                      <div className="barangay-info__wrapper__label">
                        {ACTIVE_INDICATOR_LABEL} Ranking:
                      </div>
                      <div className="barangay-info__wrapper__value">
                        {ranking}/{bgyIncl.length}
                      </div>
                    </BarangayInfoWrapper>
                  </div>
                </BarangayInfo>
              ) : null}
            <BreakdownAnalysis>
              {visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_BGY.profile.value ?
                (<div className="breakdown-analysis__section">
                  <BarChart 
                    data={bgy.filter(e => typeof e.x == 'number' && e.label != 'population' && e.label !='income')}/>
                </div>
              ) : null }
              {!visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_DEF.transportDesirability.value ?
                (<div className="breakdown-analysis__section">
                  <BarChart 
                    data={cityMeans.filter(e => e.value != 'desirability')}
                    title={ACTIVE_INDICATOR_LABEL  + ' Breakdown'}/>
                </div>
              ) : null }
              {!visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_DEF.transportDesirability.value ?
                (<div className="breakdown-analysis__section">
                  <ParallelCoordinatesK 
                    data={bgyIncl}/>
                </div> ) : null}
              {!visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value && bgyIncl ? (
                <div className="breakdown-analysis__section">
                  <BarChart 
                    data={bgyIncl.slice(0,maxListSize).reverse()}       
                    xKey={currView}
                    yKey={'name'}
                    width={420}
                    title={'Top ' + maxListSize + ' ' + ACTIVE_INDICATOR_LABEL + ' Scores'}/>
                </div>
              ) : null}
              {!visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value && datasets.barangays && bgyIncl ? (
                <div className="breakdown-analysis__section">
                  <BarChart 
                    data={bgyIncl.slice(bgyIncl.length - maxListSize, bgyIncl.length).reverse()}
                    xKey={currView}
                    yKey={'name'}
                    width={420}                    
                    title={'Bottom ' + maxListSize + ' ' + ACTIVE_INDICATOR_LABEL  + ' Scores'}/>
                </div>
              ) : null}
            </BreakdownAnalysis>
          </AnalysisSectionWrapper>
           
        </div>
      </WidgetContainer>

      // <TimeWidget
      //   fields={datasets[filters[enlargedFilterIdx].dataId].fields}
      //   setFilterPlot={visStateActions.setFilterPlot}
      //   setFilter={visStateActions.setFilter}
      //   toggleAnimation={visStateActions.toggleAnimation}
      //   updateAnimationSpeed={visStateActions.updateAnimationSpeed}
      //   enlargeFilter={visStateActions.enlargeFilter}
      //   width={Math.min(maxWidth, enlargedFilterWidth)}
      //   isAnyFilterAnimating={isAnyFilterAnimating}
      //   enlargedIdx={enlargedFilterIdx}
      //   filter={filters[enlargedFilterIdx]}
      // />
    );
  }

  BottomWidget.propTypes = propTypes;

  return BottomWidget;
}
