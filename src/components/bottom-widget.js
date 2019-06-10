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
import {createSelector} from 'reselect';

import {SelectTextBold, IconRoundSmall, CenterFlexbox} from 'components/common/styled-components';
import {Close, Clock, LineChart} from 'components/common/icons';

import PropTypes from 'prop-types';
import TimeWidgetFactory from './filters/time-widget';
import { INDICATORS, ANALYSIS_TABS_DEF, ANALYSIS_TABS_BGY } from 'utils/filter-utils';

import {scaleLinear} from 'd3-scale';

import BarChartFactory from './plexus-analysis/bar-chart';
import ParallelCoordinatesKFactory from './plexus-analysis/parallel-coordinates';
import DonutChartFactory from './plexus-analysis/donut-chart';

import {
  RadialChart
} from 'react-vis';
import { SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER } from 'constants';


const innerPdSide = 32;

const propTypes = {
  filters: PropTypes.arrayOf(PropTypes.object),
  datasets: PropTypes.object,
  uiState: PropTypes.object,
  visState: PropTypes.object,
  visStateActions: PropTypes.object,
  uiStateActions: PropTypes.object,
  sidePanelWidth: PropTypes.number,
  containerW: PropTypes.number,
  layers: PropTypes.arrayOf(PropTypes.any),
  mapLayers: PropTypes.object,
};

const maxWidth = 1080;
const modMaxWidth = 1400;

BottomWidgetFactory.deps = [TimeWidgetFactory, BarChartFactory, ParallelCoordinatesKFactory, DonutChartFactory];

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
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 32px;
  // margin-top: 32px;
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

  flex-direction: column;
  justify-content: flex-center;
  align-items: flex-start;
  
  .breakdown-analysis__section {
    // flex-grow: 1;
    display: flex;
    // justify-content: center;
    margin: 0;
    margin-right: 50px;
    margin-top: 20px;
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

// TODO: set width to side-bar width val in props
const WidgetContainer = styled.div`
  position: absolute;
  padding-top: ${props => props.theme.sidePanel.margin.top}px;
  padding-right: ${props => props.theme.sidePanel.margin.right}px;
  padding-bottom: ${props => props.theme.sidePanel.margin.bottom}px;
  padding-left: ${props => props.theme.sidePanel.margin.left}px;  
  top: 0;
  right: 0;
  z-index: 5;
  width: 340px;
  // maxWidth: ${props => props.width}px;
  // width: 35vw;
  width: 340px;

  .bottom-widget--inner {
    background-color: ${props => props.theme.sidePanelBg};
    // padding: 10px ${innerPdSide}px;
    padding: 0.95em;
    position: relative;
    // height: 220px; 
    height: 80vh;   
  }
`;

const TopSectionWrapper = styled.div`

  position: absolute;
  top: 0;
  left: 0;
  padding: 0 12px;
  background-color: ${props => props.theme.sidePanelHeaderBg};
  display: flex;
  justify-content: space-between;
  width: 100%;
  // padding-right: ${innerPdSide * 2}px;
  color: ${props => props.theme.textColorHl};
  
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



/**
 * Generates all layers available for the current map
 * TODO: this may be moved into map-container or map-control or even at the reducer level
 * @param layers
 * @param mapLayers
 * @returns {[id, label, isVisible]}
 */
const layerSelector = (layers, mapLayers) => {
  const availableItems = Object.keys(layers).reduce(
    (availableLayers, currentLayerId) => {
      // is available ? if yes add to available list
      const currentLayer = layers[currentLayerId];
      // if maplayers exists we need to make sure currentlayer
      // is contained in mapLayers in order to add onto availableLayers
      // otherwise we add all layers

      const layerConfig = mapLayers
        ? mapLayers[currentLayer.id]
        : currentLayer.config;

      const mustBeAdded =
        mapLayers && mapLayers[currentLayer.id]
          ? mapLayers[currentLayer.id].isAvailable
          : layerConfig.isVisible;

      return mustBeAdded
        ? [
            ...availableLayers,
            {
              id: currentLayer.id,
              name: currentLayer.config.label,
              isVisible:
                mapLayers && mapLayers[currentLayer.id]
                  ? mapLayers[currentLayer.id].isVisible
                  : layerConfig.isVisible,
              layer: currentLayer
            }
          ]
        : availableLayers;
    },
    []
  );

  return availableItems;
};


export default function BottomWidgetFactory(TimeWidget, BarChart, ParallelCoordinatesK, DonutChart) {

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
      visState,
      layers,
      mapLayers
    } = props;
    const {activeSidePanel} = uiState;
    const isOpen = Boolean(activeSidePanel);
    const width = modMaxWidth;

    const DEFAULT_LIST = 5;
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

    // DONUT STUFF 


    let myData = [{angle: 1, radius: 1}, {angle: 3, radius: 1}, {angle: 2, radius: 1}];
    let donutLayer;
    
    if(layers !== undefined && layers.length > 0) {

      let layerSelector2 = (state) => layers;
      let mapLayersSelector = (state) => mapLayers;
      
      //console.log('donutdatatest');
      let initialDataSelector = createSelector(
        layerSelector2,
        mapLayersSelector,
        layerSelector
      );

      let pLayers=initialDataSelector(layers, mapLayers);
      //console.log(pLayers);
      if(pLayers) {
        let items = pLayers.filter(item => item.isVisible).map(item => item.layer);
        //console.log(items);
        items.map((layer, index) => {
          
          if (!layer.isValidToSave()) {
            //console.log('ngek');
          } else {
            if(layer.config.label=='Barangay') {
              //console.log('THIS IS THE BGY LAYER (MULTI)');
              //console.log(layer);
              donutLayer = layer;
            } else console.log(layer.name);
          }
        });
      }
    }

    // END DONUT STUFF
    
    //console.log("bottom-widget.js: active bgy:");
    //console.log(visState.activeBarangay);
    //console.log("bottom-widget.js: active bgy:");

    if(datasets.barangays) {
      if(datasets.barangays.data) {
        console.log('bw datasets');
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
        // format active barangay data
        bgy = visState.activeBarangay.map((d, idx) => ({
          x: d,
          label: datasets.barangays.fields[idx].name,
          display: datasets.barangays.fields[idx].name != '_geojson' && datasets.barangays.fields[idx].name != 'latitude' && datasets.barangays.fields[idx].name != 'longitude' && datasets.barangays.fields[idx].name != 'id',
        }));
        // bgy = bgy.filter(e => e.label != '_geojson' && e.label != 'latitude' && e.label != 'longitude');

        bgy = bgy.map((d, idx) => ({
          ...d,
          y: INDICATORS.findIndex(i => i.value == d.label) >= 0 ? INDICATORS[INDICATORS.findIndex(i => i.value == d.label)].label : '',                    
        }));

        // Get active bgy ranking
        // TODO get bgy ranking by id 
        ranking = bgyIncl.findIndex(b => b['name'] == visState.activeBarangay[1]) + 1;
        console.log('rank ' + ranking); 
        console.log(bgy);       
      } else {
        console.log('no active bgy');
      }
    }

    const ACTIVE_INDICATOR_LABEL = INDICATORS[INDICATORS.findIndex(d => d.value == currView)].label;

    return (
      <WidgetContainer width={0}>
      {/* <WidgetContainer width={width}> */}
        <div className="bottom-widget--inner">
          <TopSectionWrapper>
            <p>{!visState.activeBarangay ? 'City ' : 'Barangay ' }Overview</p>
            {/* <AnalysisSectionToggle
              update={(activeAnalysisTab) => { visStateActions.toggleActiveAnalysis(activeAnalysisTab); } } 
              activeTab={visState.activeAnalysisTab} 
              barangay={visState.activeBarangay} /> */}
            {/* <IconRoundSmall>
              <Close height="12px" onClick={() => {console.log("close button click!")}} />
            </IconRoundSmall> */}
          </TopSectionWrapper>
          <AnalysisSectionWrapper> {/* TODO: currently in TD mode, make dynamic according to tabs */}
            
            {visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value && bgyIncl ?
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

              {/* baranggay PROFILE TAB */}
              
              {visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_BGY.profile.value ?
                (<div className="breakdown-analysis__section">
                  <BarChart 
                    height={300}
                    title={'Barangay Breakdown'}
                    data={bgy.filter(e => typeof e.x == 'number' && e.label != 'population' && e.label !='income')}/>
                </div>
              ) : null }
              

              {/* general PROFILE TAB */}

              {false && !visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value && bgyIncl ?
                (
                  <BarangayInfo>
                    <div className="barangay-info__section">
                      <BarangayInfoWrapper>
                        <div className="barangay-info__wrapper__label">
                          Average Population:
                        </div>
                        <div className="barangay-info__wrapper__value">
                          3892083
                        </div>
                      </BarangayInfoWrapper>
                      <BarangayInfoWrapper>
                        <div className="barangay-info__wrapper__label">
                          Average Income:
                        </div>
                        <div className="barangay-info__wrapper__value">
                          203003
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

              {!visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value && bgyIncl && donutLayer ? (
                <div className="breakdown-analysis__section">
                  <DonutChart
                    title={ACTIVE_INDICATOR_LABEL + ' Proportion'}
                    scaleType={donutLayer.config.colorScale}
                    displayLabel
                    domain={donutLayer.config.colorDomain}
                    fieldType={(donutLayer.config.colorField && donutLayer.config.colorField.type) || 'real'}
                    range={donutLayer.config.visConfig.colorRange.colors}
                    activeIndicator={currView} 
                    data={bgyIncl}
                     />
                </div>
              ) : null}

              {!visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value && bgyIncl ? (
                <div className="breakdown-analysis__section">
                  <BarChart 
                    listSize={bgyIncl.length}
                    maxBar={maxListSize}
                    data={bgyIncl}       
                    xKey={currView}
                    yKey={'name'}
                    title={ACTIVE_INDICATOR_LABEL + ' Scores'}
                    paginationFunc={visStateActions.changeAnalysisRankPage}
                    reverseFunc={visStateActions.sortAnalysisReverse}
                    visState={visState}
                    
                    />
                </div>
              ) : null}

              {/* {!visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value && bgyIncl ?
                (<div className="breakdown-analysis__section">
                  <ParallelCoordinatesK 
                    data={bgyIncl}/>
                </div> ) : null} */}


              {/* general TRANSPORT DESIRABILITY TAB */}

              
              {/* {!visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_DEF.transportDesirability.value ?
                (<div className="breakdown-analysis__section">
                  <BarChart 
                    data={cityMeans.filter(e => e.value != 'desirability')}
                    title={ACTIVE_INDICATOR_LABEL  + ' Breakdown'}/>
                </div>
              ) : null } */}

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
              {!visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_DEF.transportDesirability.value ?
                (<div className="breakdown-analysis__section">
                  <ParallelCoordinatesK 
                    data={bgyIncl}/>
                </div> ) : null}
              
              {/* {!visState.activeBarangay && visState.activeAnalysisTab == ANALYSIS_TABS_DEF.profile.value && datasets.barangays && bgyIncl ? (
                <div className="breakdown-analysis__section">
                  <BarChart 
                    data={bgyIncl.slice(bgyIncl.length - maxListSize, bgyIncl.length).reverse()}
                    xKey={currView}
                    yKey={'name'}
                    title={'Bottom ' + maxListSize + ' ' + ACTIVE_INDICATOR_LABEL  + ' Scores'}/>
                </div>
              ) : null} */}
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
