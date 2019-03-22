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
import { INDICATORS, ANALYSIS_TABS_DEF } from 'utils/filter-utils';

import {scaleLinear} from 'd3-scale';

import BarChartFactory from './plexus-analysis/bar-chart';
import ParallelCoordinatesKFactory from './plexus-analysis/parallel-coordinates';

// import {
//   makeWidthFlexible,
//   ParallelCoordinates, 
// } from 'react-vis';
import "./bottom-widget.scss";

const innerPdSide = 32;

const propTypes = {
  filters: PropTypes.arrayOf(PropTypes.object),
  datasets: PropTypes.object,
  uiState: PropTypes.object,
  visStateActions: PropTypes.object,
  uiStateActions: PropTypes.object,
  sidePanelWidth: PropTypes.number,
  containerW: PropTypes.number
};

const maxWidth = 1080;
const modMaxWidth = 1540;

BottomWidgetFactory.deps = [TimeWidgetFactory, BarChartFactory, ParallelCoordinatesKFactory];

const AnalysisSectionToggle = ({activeTab, update}) => (
  <Tabs>
    {/* {
      Object.keys(ANALYSIS_TABS_DEF).forEach(key => {
        return <Tab key={ANALYSIS_TABS_DEF[key].value} active={ANALYSIS_TABS_DEF[key].value === activeTab}
        onClick={() => { update(ANALYSIS_TABS_DEF[key].value); console.log(ANALYSIS_TABS_DEF[key].label + " " + ANALYSIS_TABS_DEF[key].value); }}>{ANALYSIS_TABS_DEF[key].label}</Tab>
      })
    } */}
     {Object.keys(ANALYSIS_TABS_DEF).map((e) => (
      <Tab key={ANALYSIS_TABS_DEF[e].value} active={ANALYSIS_TABS_DEF[e].value === activeTab}
        onClick={() => { update(ANALYSIS_TABS_DEF[e].value); console.log(ANALYSIS_TABS_DEF[e].label + " " + ANALYSIS_TABS_DEF[e].value); }}>{ANALYSIS_TABS_DEF[e].label}</Tab>
    ))}
    {/* {ANALYSIS_TABS_DEF.map(({label, value}) => (
      <Tab key={value} active={value === activeTab}
        onClick={() => { update(value); console.log(label + " " + value); }}>{label}</Tab>
    ))} */}
  </Tabs>
);

const AnalysisSectionWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 32px;


`;

const RankingAnalysis = styled.div`
  flex-grow: 3;

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

const RankingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.labelColor};

  .ranking-wrapper__score {
    font-weight: 900;
    font-size: 1.8em;
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
      sidePanelWidth
    } = props;
    const {activeSidePanel} = uiState;
    const isOpen = Boolean(activeSidePanel);
    const width = modMaxWidth;
    const TD_LABELS = [
      'Transport Desirability Score', 
      'TD in the City',
      'TD in the Province'
    ];

    const DEFAULT_LIST = 10;

    const tdIndex = 6;
    const bgyNameIndex = 1;
    const currView = 'desirability';
    
    let cityMeans = [];
    var indicatorValues = [];
    INDICATORS.forEach(i => indicatorValues.push(i.value));

    let maxListSize = DEFAULT_LIST;
    let bgyIncl;

    console.log("bottom-widget.js: props: dataset");
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
        console.log('averages');
        console.log(cityMeans);
        console.log(currView)
        console.log(indicatorValues);
        console.log(cityMeans.filter((d) => indicatorValues.includes(d.value)));
        console.log(bgyIncl);
      }
    }

    // get top 10
    
    const pCoordinates = [{spatial: 0.611719825048877,economic: 0.03389193537777713,temporal: 0.8311397065238727,physical: 0.5813906619247655,psychological: 0.24258215937737349,physiological: 0.8164195767027841,sustainability: 0.7235828517492725,fairness: 0.6776049233586464,performance: 0.5036852497171173,},{spatial: 0.03387943667053561,economic: 0.6676435665680102,temporal: 0.24938933865327784,physical: 0.0716104234683611,psychological: 0.5744521396732617,physiological: 0.3316049292881086,sustainability: 0.44379924273607374,fairness: 0.771496758179444,performance: 0.7633998906470244,},{spatial: 0.970388710738751,economic: 0.4526485985058233,temporal: 0.7438133407196952,physical: 0.6304809959655822,psychological: 0.23892084638654454,physiological: 0.4075138545763667,sustainability: 0.48639044251971497,fairness: 0.9251166609534676,performance: 0.01093039369095783,},{spatial: 0.5907928421765525,economic: 0.9249157558207144,temporal: 0.10530653541716861,physical: 0.5100109842284911,psychological: 0.4409853886250825,physiological: 0.6614441841848393,sustainability: 0.38632102825682657,fairness: 0.8640596211274777,performance: 0.8964479333648614,},{spatial: 0.33553511483804144,economic: 0.9162410849995852,temporal: 0.8022216594281248,physical: 0.38971136848996624,psychological: 0.39023868672486195,physiological: 0.8766381497864557,sustainability: 0.2580957166802661,fairness: 0.42936651769059675,performance: 0.047239748078603205,},{spatial: 0.6323289833616933,economic: 0.36756471723704676,temporal: 0.8287924918662156,physical: 0.8650934958521277,psychological: 0.11851218486404169,physiological: 0.485556013998499,sustainability: 0.44956487135748946,fairness: 0.24736534517956754,performance: 0.2489815474319479,},{spatial: 0.6717617236265505,economic: 0.6785597941243027,temporal: 0.587569938531971,physical: 0.2474816525932193,psychological: 0.3414260454051028,physiological: 0.3888708832536717,sustainability: 0.87506397369749,fairness: 0.22331508708134817,performance: 0.5749628518715251,},{spatial: 0.7365218959450655,economic: 0.9247315182352243,temporal: 0.3781522868262883,physical: 0.6260295213815208,psychological: 0.8029917182313696,physiological: 0.8374567355740333,sustainability: 0.9985088616799341,fairness: 0.05892958849321073,performance: 0.8879760932298737,},{spatial: 0.18979580742595925,economic: 0.8762255691038322,temporal: 0.9438630759571951,physical: 0.061888900666894786,psychological: 0.983676651051682,physiological: 0.45010700515288715,sustainability: 0.2843848271584053,fairness: 0.16584908137141785,performance: 0.5785939643703848,},{spatial: 0.09461370692584947,economic: 0.08990918856528307,temporal: 0.7559442115703178,physical: 0.7677553535756361,psychological: 0.5667021023424806,physiological: 0.7226490417091213,sustainability: 0.6883572550276765,fairness: 0.12911410307865578,performance: 0.9535654448749638,},{spatial: 0.19539688666550825,economic: 0.3796905862298754,temporal: 0.9292435119010387,physical: 0.48693399368911594,psychological: 0.8906288965031491,physiological: 0.6891943394968547,sustainability: 0.5602393220966105,fairness: 0.7487002476253053,performance: 0.6922365378153295,},{spatial: 0.4974010919848575,economic: 0.28008169958025175,temporal: 0.8727791583227131,physical: 0.8834015469046246,psychological: 0.04058309686999517,physiological: 0.901674098458911,sustainability: 0.5869715621324536,fairness: 0.3818024003956556,performance: 0.6127956535147681,},{spatial: 0.12879548505755922,economic: 0.7441144377898437,temporal: 0.07783086675956796,physical: 0.07956590595675939,psychological: 0.11987043648047246,physiological: 0.428632413315462,sustainability: 0.194802595973125,fairness: 0.920958299899253,performance: 0.6698021346686922,},{spatial: 0.7336986556317254,economic: 0.3327982616832402,temporal: 0.3530856971928552,physical: 0.7012869368685057,psychological: 0.17171740325725304,physiological: 0.3271499015009839,sustainability: 0.14981234720978576,fairness: 0.1690881330381817,performance: 0.2602527535953203,},{spatial: 0.6579733779975835,economic: 0.4768976268774825,temporal: 0.30187406028579,physical: 0.5264295755195592,psychological: 0.5034266602830417,physiological: 0.7338988071574428,sustainability: 0.4390969702677191,fairness: 0.8331243476046791,performance: 0.2212836962923228,},{spatial: 0.6413826681460424,economic: 0.5400369505897734,temporal: 0.009376402379748017,physical: 0.8662894238318314,psychological: 0.0493956264233244,physiological: 0.14857797137756534,sustainability: 0.17485429219323767,fairness: 0.03106145907063318,performance: 0.7421452578059334,},{spatial: 0.22275213290733065,economic: 0.39701762384206973,temporal: 0.9984463933347678,physical: 0.010631869431547147,psychological: 0.7235073937141471,physiological: 0.016448487699629477,sustainability: 0.5127651838558807,fairness: 0.10551368185862109,performance: 0.8541587822411345,},{spatial: 0.5069468117855306,economic: 0.4331222598932074,temporal: 0.3145593294542378,physical: 0.7853336360185945,psychological: 0.45270456364717937,physiological: 0.9935692381132776,sustainability: 0.03335115276440559,fairness: 0.9526755635531291,performance: 0.8757814286656366,},{spatial: 0.5842347166369724,economic: 0.4964806097678287,temporal: 0.8273564711387442,physical: 0.04345250515309018,psychological: 0.9657766630814653,physiological: 0.31364995638997195,sustainability: 0.0849591084156418,fairness: 0.25592660793185373,performance: 0.733510102404842,},{spatial: 0.27997140911492924,economic: 0.06859560344573168,temporal: 0.8344840616652562,physical: 0.34015085953839674,psychological: 0.34705625568329346,physiological: 0.9848608331709253,sustainability: 0.20604978140660057,fairness: 0.33553272860369554,performance: 0.16470321893034257,},];
  
    return (
      <WidgetContainer width={width}>
        <div className="bottom-widget--inner">
          <TopSectionWrapper>
            <AnalysisSectionToggle
              update={(activeAnalysisTab) => { uiStateActions.toggleActiveAnalysis(activeAnalysisTab); } } 
              activeTab={uiState.activeAnalysisTab} />
            <IconRoundSmall>
              <Close height="12px" onClick={() => {console.log("close button click!")}} />
            </IconRoundSmall>
          </TopSectionWrapper>
          <AnalysisSectionWrapper> {/* TODO: currently in TD mode, make dynamic according to tabs */}
            {uiState.activeAnalysisTab == ANALYSIS_TABS_DEF.transportDesirability.value ?
              (
                <RankingAnalysis className="analysis-section">
                  <div className="ranking-analysis__section">
                    <RankingWrapper>
                      <div className="ranking-wrapper__score ranking-wrapper__score--bad">
                        {(cityMeans[cityMeans.findIndex(d => d.value == currView)].x * 100).toFixed(2)}%
                      </div>
                      <div className="ranking-wrapper__label">
                        {TD_LABELS[0]}
                      </div>
                    </RankingWrapper>
                  </div>
                  {/* <div className="ranking-analysis__section">
                    <RankingWrapper>
                      <div className="ranking-wrapper__score">
                        {tdCity.rank}/{tdCity.total}
                      </div>
                      <div className="ranking-wrapper__label">
                        {TD_LABELS[1]}
                      </div>
                    </RankingWrapper>
                    {tdProv ? (
                      <RankingWrapper>
                        <div className="ranking-wrapper__score">
                          {tdProv.rank}/{tdProv.total}
                        </div>
                        <div className="ranking-wrapper__label">
                          {TD_LABELS[2]}
                        </div>
                      </RankingWrapper>
                    ) : null}
                  </div> */}
                </RankingAnalysis>
              ) : null}
            <BreakdownAnalysis className="analysis-section">
              {uiState.activeAnalysisTab == ANALYSIS_TABS_DEF.transportDesirability.value ?
                (<div className="breakdown-analysis__section">
                  <BarChart 
                    data={cityMeans.filter(e => e.value != 'desirability')}
                    title={'TD Breakdown'}/>
                </div>
              ) : null }
              {uiState.activeAnalysisTab == ANALYSIS_TABS_DEF.transportDesirability.value ?
                (<div className="breakdown-analysis__section">
                  <ParallelCoordinatesK 
                    data={bgyIncl}/>
                </div> ) : null}
              {uiState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value && bgyIncl ? (
                <div className="breakdown-analysis__section">
                  <BarChart 
                    data={bgyIncl.slice(0,maxListSize).reverse()}                                    
                    // data={sortedBgys.slice(0,10)}                  
                    // data={sortedBgys.slice(0,10)}
                    xKey={currView}
                    yKey={'name'}
                    title={'Top ' + maxListSize + ' TD Scores'}/>
                </div>
              ) : null}
              {uiState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value && datasets.barangays && bgyIncl ? (
                <div className="breakdown-analysis__section">
                  <BarChart 
                    data={bgyIncl.slice(bgyIncl.length - maxListSize, bgyIncl.length).reverse()}
                    xKey={currView}
                    yKey={'name'}
                    // data={dataBotTen}
                    title={'Bottom ' + maxListSize + ' TD Scores'}/>
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
