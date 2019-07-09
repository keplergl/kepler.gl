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
import {IconRoundSmall} from 'components/common/styled-components';
import {Close} from 'components/common/icons';

import PropTypes from 'prop-types';
import {
  INDICATORS,
  BGY_DATA_DISPLAY,
  AMENITY_DATA_INDICES,
  OD_DATA_INDICES,
  SAMPLE_DATA_AMENITIES,
  SAMPLE_DEMOGRAPHICS_SEX,
  SAMPLE_DEMOGRAPHICS_AGE
} from 'utils/filter-utils';
// import {subDivideDestinationData} from 'utils/plexus-utils/sample-data-utils';
import {
  TRANSPORT_MODES,
  SEGMENTED_DESTINATIONS,
  BGY_DEMOGRAPHICS,
  M_SEX,
  M_INCOME,
  M_AGE
} from 'utils/plexus-utils/sample-data-utils';

import {scaleLinear} from 'd3-scale';

import BarChartFactory from './plexus-analysis/bar-chart';
import ParallelCoordinatesKFactory from './plexus-analysis/parallel-coordinates';
import ParallelCoordinatesD3Factory from './plexus-analysis/parallel-coordinates-d3';
import ScatterPlotFactory from './plexus-analysis/scatter-plot';
import DonutChartFactory from './plexus-analysis/donut-chart';

import {SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER} from 'constants';

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
  mapLayers: PropTypes.object
};

const ControlPanel = styled.div`
  display: flex;
  background-color: ${props => props.theme.sidePanelHeaderBg};
  justify-content: space-between;
  width: 100%;
  padding: 6px 12px;

  .control-panel-item {
    margin-top: 12px 0 8px 0;
  }

  .control-panel-item:nth-child(2) {
    display: flex;
    justify-content: flex-end;
  }

  p {
    color: ${props => props.theme.labelColor};
    margin: 0;
  }

  .control-panel__title {
    font-weight: 500;
    color: ${props => props.theme.textColorHl};
  }
`;

const ControlBtn = styled.button`
  cursor: pointer;
  color: ${props => props.theme.labelColor};
  background: none;
  border: none;
`;

const WidgetContainer = styled.div`
  ${props => props.theme.sidePanelScrollBar};
  position: absolute;
  // padding-top: ${props => props.theme.sidePanel.margin.top}px;
  // padding-right: ${props => props.theme.sidePanel.margin.right}px;
  // padding-bottom: ${props => props.theme.sidePanel.margin.bottom}px;
  // padding-left: ${props => props.theme.sidePanel.margin.left}px;
  bottom: 0;
  right: 0;
  z-index: 5;
  // display:none;
 
  // maxwidth: ${props => props.width}px;
  // maxwidth: 1200px;
  // width: 35vw;
  // width: 1080px;
  // width: 75vw;
  width: ${props => props.width}px;
  // padding: 20px 0;

  .bottom-widget--inner {
    background-color: ${props => props.theme.sidePanelBg};
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: 100vh;   
    // overflow-y: scroll;  
    overflow-x:hidden;   
  }

  // .bottom-widget--inner {
  //   background-color: ${props => props.theme.sidePanelBg};
  //   position: relative;
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: flex-start;
  //   align-items: flex-start;
  //   height: auto;   
  //   overflow: scroll;     
  // }

  .bottom-widget--content {
    padding-right: ${innerPdSide}px;
    padding-left: ${innerPdSide}px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: 100vh;    
  }

  .bottom-widget--info {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: flex-start;
  }

  .bottom-widget--info-title {
    font-weight: 900;
    font-size: 2em;
    line-height: 1;
    margin-top:25px;
    color: ${props => props.theme.labelColor};
  }

  .bottom-widget--info-desc {
    font-size: 1.2em;
    font-weight: 400;
    color: ${props => props.theme.labelColor};    
    // color: #C3C9C5;
    padding-top: 10px;
    max-width: 800px;
    line-height: 1.3em;
    // font-size: 1.2em;
    // font-weight: 400;
  }
`;

const VisRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 15px;
  margin-bottom: 15px;
`;

VisWidgetFactory.deps = [
  BarChartFactory,
  ParallelCoordinatesKFactory,
  ParallelCoordinatesD3Factory,
  DonutChartFactory,
  ScatterPlotFactory
];

export default function VisWidgetFactory(
  BarChart,
  ParallelCoordinatesK,
  ParallelCoordinatesD3,
  DonutChart,
  ScatterPlot
) {
  const VisWidget = props => {
    const {
      datasets,
      filters,
      visStateActions,
      uiStateActions,
      // containerW,
      uiState,
      sidePanelWidth,
      selected,
      visState,
      layers,
      mapLayers,
      containerW,
      isOpen,
      toggleOpen
    } = props;

    let bgyIncl;
    let amtyCnt;
    let destCnt;
    let oriCnt;
    let destMax;

    // const enlargedFilterWidth = isOpen ? containerW - sidePanelWidth : containerW;
    // const currView = selected;
    const maxWidth = 1080;
    // const widgetWidth = Math.min(maxWidth, containerW + 200);
    const widgetWidth = Math.min(containerW-340);
    // const DEFAULT_LIST = 5;

    if (datasets.barangays) {
      if (datasets.barangays.data) {
        console.error(datasets);
        // formatted barangay data
        bgyIncl = [];
        let bgyRef = {};

        // OPTION A: map bgy names to id for reference (filtered bgys)
        datasets.barangays.allData.forEach(d => {
          let obj = {};
          BGY_DATA_DISPLAY.forEach(b => {
            obj[b.id] = d[b.idx];
          });

          bgyRef[obj['id']] = obj['name'];
        });

        // format filtered barangays
        datasets.barangays.data.forEach(d => {
          let obj = {};
          BGY_DATA_DISPLAY.forEach(b => {
            obj[b.id] = d[b.idx];
          });

          // OPTION B: map bgy names to id for reference (ALL bgys)
          // bgyRef[obj['id']] = obj['name'];

          bgyIncl.push(obj);
        });
        bgyIncl = bgyIncl.sort((a, b) => b[selected] - a[selected]);

        // format amenities
        let inserted = {};
        amtyCnt = [];
        datasets.amenities.allData.forEach(d => {
          let key = d[AMENITY_DATA_INDICES['class']];

          if (key in inserted) {
            amtyCnt.filter(a => a.name == key)[0].count += 1;
          } else {
            inserted[key] = 0;
            amtyCnt.push({
              name: key,
              count: 1
            });
          }
        });

        // format origins and destinations
        inserted = {};
        let oInserted = {};
        destCnt = [];
        oriCnt = [];

        datasets.pairs.allData.forEach(d => {
          let key = d[OD_DATA_INDICES['d_id']];
          let oKey = d[OD_DATA_INDICES['o_id']];

          if (key in inserted) {
            destCnt.filter(d => d.id == key)[0].count +=
              d[OD_DATA_INDICES['count']];
          } else {
            inserted[key] = 0;
            destCnt.push({
              name: bgyRef[key],
              id: key,
              count: d[OD_DATA_INDICES['count']]
            });
          }

          if (oKey in oInserted) {
            oriCnt.filter(d => d.id == oKey)[0].count +=
              d[OD_DATA_INDICES['count']];
          } else {
            oInserted[oKey] = 0;
            oriCnt.push({
              name: bgyRef[oKey],
              id: oKey,
              count: d[OD_DATA_INDICES['count']]
            });
          }
        });
        console.error(bgyIncl);
        // get maximum
        destMax = destCnt.reduce((prev, current) =>
          prev.count > current.count ? prev : current
        ).count;

        // filters undefined barangays
        destCnt = destCnt.filter(d => d.name);
      }
    }

    const changeBarangay = id => {
      console.error('set bgy');
      let idIndex = BGY_DATA_DISPLAY.filter(bdd => bdd.id == 'id')[0].idx;
      let newBgy = datasets.barangays.data.filter(b => b[idIndex] == id)[0];
      console.error(newBgy);
      visStateActions.setActiveBarangay(newBgy);
    };

    // let demo = generateDemographics();
    // console.error(demo);

    // const destinations = subDivideDestinationData();
    // console.error(destinations);

    return (
      <WidgetContainer width={widgetWidth}>
        <div className={isOpen? "bottom-widget--inner": "bottom-widget--close"}>
          {/* TODO move to parent */}
          <ControlPanel>
            <div className="control-panel-item">
              <p className="control-panel__title">Data Summary</p>
            </div>
            <div className="control-panel-item">
              <IconRoundSmall
                onClick={() => toggleOpen(!isOpen)}
              >
                <Close
                  height="12px"
                  onClick={() => toggleOpen(!isOpen)}
                />
              </IconRoundSmall>
            </div>
          </ControlPanel>
          {isOpen ? 
          <div className="bottom-widget--content">
            <div className="bottom-widget--info">
                <div className="bottom-widget--info-title">
                Parallel Coordinates
                </div>
                <div className="bottom-widget--info-desc">
                This is a multi-indicator explorer of the transport desirability framework in the city. Each line indicates a barangay, while each vertical line is the values of an indicator. Multiple lines going to a single point signifies that there are a lot of barangays that have similar indicator scores. Lines converging to the top of the coordinates means that many barangays have a higher score, while lines converging at the bottom specifies that many barangays have a lower score.
                </div>
            </div>
            {bgyIncl ? (
              <ParallelCoordinatesD3
                // data={bgyIncl.forEach(d => {
                //   delete d.id;
                // })}
                data={bgyIncl}
                selected={selected}
                width={widgetWidth}
              />
            ) : null}
            <div className="bottom-widget--info">
                <div className="bottom-widget--info-title">
                TD Distribution Scatter Plot
                </div>
                <div className="bottom-widget--info-desc">
                These scatter plots show the relationship of the transport desirability score and each indicator. From these, you can see how much each indicator affects the overall desirability score - if it has a direct (diagonal line going up), indirect (diagonal line going down), or no relationship at all.  
                </div>
            </div>
            {bgyIncl ? (
              <VisRow>
                <ScatterPlot
                  title={'Spatial X Desirability'}
                  data={bgyIncl}
                  xKey={'desirability'}
                  yKey={'spatial'}
                  xLabel={'Transport Desirability'}
                  yLabel={'Spatial'}
                />
                <ScatterPlot
                  title={'Temporal X Desirability'}
                  data={bgyIncl}
                  xKey={'desirability'}
                  yKey={'temporal'}
                  xLabel={'Transport Desirability'}
                  yLabel={'Temporal'}
                />
                <ScatterPlot
                  title={'Economic X Desirability'}
                  data={bgyIncl}
                  xKey={'desirability'}
                  yKey={'economic'}
                  xLabel={'Transport Desirability'}
                  yLabel={'Economic'}
                />
              </VisRow>
            ) : null}
            
            {bgyIncl ? (
              <VisRow>
                <ScatterPlot
                  title={'Physical X Desirability'}
                  data={bgyIncl}
                  xKey={'desirability'}
                  yKey={'physical'}
                  xLabel={'Transport Desirability'}
                  yLabel={'Physical'}
                />
                <ScatterPlot
                  title={'Psychological X Desirability'}
                  data={bgyIncl}
                  xKey={'desirability'}
                  yKey={'psychological'}
                  xLabel={'Transport Desirability'}
                  yLabel={'Psychological'}
                />
                <ScatterPlot
                  title={'Physiological X Desirability'}
                  data={bgyIncl}
                  xKey={'desirability'}
                  yKey={'physiological'}
                  xLabel={'Transport Desirability'}
                  yLabel={'Physiological'}
                />
              </VisRow>
            ) : null}
            {bgyIncl ? (
              <VisRow>
                <ScatterPlot
                  title={'Sustainability X Desirability'}
                  data={bgyIncl}
                  xKey={'desirability'}
                  yKey={'sustainability'}
                  xLabel={'Transport Desirability'}
                  yLabel={'Sustainability'}
                />
                <ScatterPlot
                  title={'Performance X Desirability'}
                  data={bgyIncl}
                  xKey={'desirability'}
                  yKey={'performance'}
                  xLabel={'Transport Desirability'}
                  yLabel={'Performance'}
                />{' '}
                <ScatterPlot
                  title={'Fairness X Desirability'}
                  data={bgyIncl}
                  xKey={'desirability'}
                  yKey={'fairness'}
                  xLabel={'Transport Desirability'}
                  yLabel={'Fairness'}
                />
              </VisRow>
            ) : null}

            <div className="bottom-widget--info">
                <div className="bottom-widget--info-title">
                City Amenities and Frequented Destinations
                </div>
                <div className="bottom-widget--info-desc">
                The number of each amenity category located in the city is shown here. Additionally, frequented destinations are ranked in descending order and are partitioned by transport mode. The longest partition indicates the most common mode when going to that destination.
                </div>
            </div>
            {/* TODO: change to TOP destinations  */}
            {bgyIncl ? (
              <VisRow>
                <BarChart
                  data={amtyCnt}
                  xKey={'count'}
                  yKey={'name'}
                  title={'City Amenities'}
                  height={250}
                />

                {/* <BarChart 
                data={oriCnt.sort((a, b) => b['count'] - a['count']).slice(0,10).reverse()}       
                xKey={'count'}
                yKey={'name'}
                title={'Most Frequent Origins'}
                domainMax={destMax}
                height={250}
                /> */}
                {/* <BarChart 
                data={destCnt.sort((a, b) => b['count'] - a['count']).slice(0,10).reverse()}       
                xKey={'count'}
                yKey={'name'}
                title={'Frequently Visited Destinations'}
                domainMax={destMax}
                height={250}
                /> */}
                {/* <BarChart 
                data={BGY_DEMOGRAPHICS.filter(d=>d.name).sort((a, b) => b['count'] - a['count']).slice(0,10).reverse()}       
                xKeyArr={TRANSPORT_MODES}
                  yKey={'name'}
                title={'Most Frequent Origins'}
                domainMax={destMax}
                height={250}
                /> */}
                <BarChart
                  data={SEGMENTED_DESTINATIONS.filter(d => d.name)
                    .sort((a, b) => b['count'] - a['count'])
                    .slice(0, 10)
                    .reverse()}
                  xKeyArr={TRANSPORT_MODES}
                  onLabelClick={changeBarangay}
                  yKey={'name'}
                  title={'Frequent destinations'}
                  height={250}
                  domainMax={destMax}
                />
              </VisRow>
            ) : null}

            {/* {bgyIncl ? (
              <VisRow>
                <BarChart 
                  data={SEGMENTED_DESTINATIONS.filter(d=>d.name).sort((a, b) => b['count'] - a['count']).slice(0,10).reverse()}       
                  xKeyArr={TRANSPORT_MODES}
                  yKey={'name'}
                  title={'Frequent destinations'}
                  height={500}
                  />
              </VisRow>
            ):null} */}
            
            <div className="bottom-widget--info">
                <div className="bottom-widget--info-title">
                Mode Share by Demographic
                </div>
                <div className="bottom-widget--info-desc">
                This shows the percentage of each mode share in the barangay. Bigger portions in the chart indicate that more people utilize that certain transport mode. Mode shares can be assessed by sex, income level, and age.
                </div>
            </div>
            {/* DEMOGRAPHIS */}
            {bgyIncl ? (
              <VisRow>
                <DonutChart
                  title={'By Sex'}
                  values={BGY_DEMOGRAPHICS}
                  xKeyArr={M_SEX}
                />
                <BarChart
                  data={BGY_DEMOGRAPHICS.filter(d => d.name)
                    .sort((a, b) => b['count'] - a['count'])
                    .slice(0, 10)
                    .reverse()}
                  xKeyArr={M_SEX}
                  xKey={'name'}
                  yKey={'name'}
                  onLabelClick={changeBarangay}
                  categoryLabel={'Sex'}
                  title={'Frequency per area'}
                  height={250}
                />
              </VisRow>
            ) : null}

            {bgyIncl ? (
              <VisRow>
                <DonutChart
                  title={'By Income Level'}
                  values={BGY_DEMOGRAPHICS}
                  xKeyArr={M_INCOME}
                />
                <BarChart
                  data={BGY_DEMOGRAPHICS.filter(d => d.name)
                    .sort((a, b) => b['count'] - a['count'])
                    .slice(0, 10)
                    .reverse()}
                  xKeyArr={M_INCOME}
                  xKey={'name'}
                  yKey={'name'}
                  onLabelClick={changeBarangay}
                  categoryLabel={'Income Range'}
                  title={'Frequency per area'}
                  height={250}
                />
              </VisRow>
            ) : null}

            {bgyIncl ? (
              <VisRow>
                <DonutChart
                  title={'By Age'}
                  values={BGY_DEMOGRAPHICS}
                  xKeyArr={M_AGE}
                />
                <BarChart
                  data={BGY_DEMOGRAPHICS.filter(d => d.name)
                    .sort((a, b) => b['count'] - a['count'])
                    .slice(0, 10)
                    .reverse()}
                  xKeyArr={M_AGE}
                  xKey={'name'}
                  yKey={'name'}
                  onLabelClick={changeBarangay}
                  categoryLabel={'Age Group'}
                  title={'Frequency per area'}
                  height={250}
                />
              </VisRow>
            ) : null}
          </div> : null}
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
  };

  VisWidget.propTypes = propTypes;

  return VisWidget;
}
