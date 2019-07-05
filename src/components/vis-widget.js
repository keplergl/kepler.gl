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
import {INDICATORS, BGY_DATA_DISPLAY, AMENITY_DATA_INDICES, OD_DATA_INDICES, SAMPLE_DATA_AMENITIES, SAMPLE_DEMOGRAPHICS_SEX, SAMPLE_DEMOGRAPHICS_AGE} from 'utils/filter-utils';
// import {subDivideDestinationData} from 'utils/plexus-utils/sample-data-utils';
// import {TRANSPORT_MODES, SEGMENTED_DESTINATIONS} from 'utils/plexus-utils/sample-data-utils';

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

VisWidgetFactory.deps = [
  BarChartFactory,
  ParallelCoordinatesKFactory,
  ParallelCoordinatesD3Factory,
  DonutChartFactory,
  ScatterPlotFactory
];

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
  position: absolute;
  // padding-top: ${props => props.theme.sidePanel.margin.top}px;
  // padding-right: ${props => props.theme.sidePanel.margin.right}px;
  // padding-bottom: ${props => props.theme.sidePanel.margin.bottom}px;
  // padding-left: ${props => props.theme.sidePanel.margin.left}px;
  bottom: 0;
  right: 0;
  z-index: 5;
  display:none;
 
  // maxwidth: ${props => props.width}px;
  // maxwidth: 1200px;
  // width: 35vw;
  width: 1080px;
  // padding: 20px 0;

  .bottom-widget--inner {
    background-color: ${props => props.theme.sidePanelBg};
    padding-top: ${props => props.theme.sidePanel.margin.top}px;
    padding-right: ${props => props.theme.sidePanel.margin.right}px;
    padding-bottom: ${props => props.theme.sidePanel.margin.bottom}px;
    padding-left: ${props => props.theme.sidePanel.margin.left}px;
    // padding: 10px ${innerPdSide}px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    // height: 330px;
    // height: 660px;
    // height: 220px;
    height: 95vh;   
    overflow: scroll;     
  }

  .bottom-widget--content {
    padding-right: ${innerPdSide}px;
    padding-left: ${innerPdSide}px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: 100vh;    
  }
`;

const VisRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 15px;
  margin-bottom: 15px;
`;

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
      containerW,
      uiState,
      sidePanelWidth,
      selected,
      visState,
      layers,
      mapLayers
    } = props;

    let bgyIncl;
    let amtyCnt;
    let destCnt
    // const currView = selected;

    // const DEFAULT_LIST = 5;

    if (datasets.barangays) {
      if (datasets.barangays.data) {
        console.error(datasets);
        // formatted barangay data
        bgyIncl = [];
        let bgyRef = {};
        datasets.barangays.data.forEach(d => {
          let obj = {};
          BGY_DATA_DISPLAY.forEach(b => {
            obj[b.id] = d[b.idx];
          });
          bgyRef[obj['id']] = obj['name'],
          
          bgyIncl.push(obj);
        });
        bgyIncl = bgyIncl.sort((a, b) => b[selected] - a[selected]);

        // amenities
        let inserted = {};
        amtyCnt = [];
        datasets.amenities.allData.forEach(d => {
          let key = d[AMENITY_DATA_INDICES['class']];

          if(key in inserted) {
            amtyCnt.filter(a=>a.name==key)[0].count += 1;
          } else {
            inserted[key] = 0;
            amtyCnt.push({
              name: key,
              count: 1,
            });
          }
        });

        // origins and destinations
        inserted = {};
        destCnt = [];
        datasets.pairs.allData.forEach(d => {
          let key = d[OD_DATA_INDICES['d_id']];

          if(key in inserted) {
            destCnt.filter(d=>d.id==key)[0].count += d[OD_DATA_INDICES['count']];
          } else {
            inserted[key] = 0;
            destCnt.push({
              name: bgyRef[key],
              id: key,
              count: d[OD_DATA_INDICES['count']],
            });
          }
        });

        // console.error('amenity count ' + datasets.amenities.allData[0][AMENITY_DATA_INDICES['class']]);
        // console.error(amtyCnt);
        // console.error(bgyRef);
        console.error(destCnt);
        // subDivideDestinationData();
        // console.error(bgyIncl);
      }
    }

    return (
      <WidgetContainer width={'100vw'}>
        <div className="bottom-widget--inner">
          {/* TODO move to parent */}
          <ControlPanel>
            <div className="control-panel-item">
              <p className="control-panel__title">Parallel Coordinates</p>
            </div>
            <div className="control-panel-item">
              <IconRoundSmall
                onClick={() => {
                  console.log('close');
                  // this.setState({visible: !this.state.visible});
                }}
              >
                <Close
                  height="12px"
                  onClick={() => {
                    console.log('close');
                    // this.setState({visible: !this.state.visible});
                  }}
                />
              </IconRoundSmall>
            </div>
          </ControlPanel>
          <div className="bottom-widget--content">
            {bgyIncl ? (
              <ParallelCoordinatesD3 data={bgyIncl} selected={selected} />
            ) : null}
            { bgyIncl?<VisRow>
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
            </VisRow>: null }
            { bgyIncl?<VisRow>
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
              
            </VisRow>: null }
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
              />   <ScatterPlot
                title={'Fairness X Desirability'}
                data={bgyIncl}
                xKey={'desirability'}
                yKey={'fairness'}
                xLabel={'Transport Desirability'}
                yLabel={'Fairness'}
                />
              </VisRow>
            ) : null}

            {/* TODO: change to TOP destinations  */}
            {bgyIncl ? (
              <VisRow>
              {/* <BarChart 
                data={bgyIncl.sort((a, b) => b['spatial'] - a['spatial']).slice(0,10).reverse()}       
                xKey={'spatial'}
                yKey={'name'}
                title={'Frequently Visited Destinations'}
                height={250}
                /> */}
              {/* <BarChart 
                data={destCnt.sort((a, b) => b['count'] - a['count']).slice(0,10).reverse()}       
                xKey={'count'}
                yKey={'name'}
                title={'Frequently Visited Destinations'}
                height={250}
                />
              <BarChart 
                data={amtyCnt}       
                xKey={'count'}
                yKey={'name'}
                title={'City Amenities'}
                height={250}
                /> */}
              
              {/* <BarChart 
                height={250}
                title={'Amenities'}
                data={SAMPLE_DATA_AMENITIES}
                xKey={'count'}
                yKey={'label'}
                />
                 */}
              </VisRow>
            ):null}

            {/* {bgyIncl ? (
              <VisRow>
                <BarChart 
                  data={amtyCnt}       
                  xKey={TRANSPORT_MODES}
                  yKey={'name'}
                  title={'Frequent destinations'}
                  height={250}
                  />
              </VisRow>
            ):null} */}

            {/* DEMOGRAPHIS */}
            {bgyIncl ? (
              <VisRow>
                <DonutChart
                  title={'By Sex'}
                  values={SAMPLE_DEMOGRAPHICS_SEX}
                  xLabel={'count'}
                    />
                <DonutChart
                  title={'By Age Group'}
                  values={SAMPLE_DEMOGRAPHICS_AGE}
                  xLabel={'count'}
                    />

                {/* income */}
              </VisRow>
            ):null}
            

            {/* {bgyIncl ? <ParallelCoordinatesK data={bgyIncl} /> : null} */}
          </div>
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
