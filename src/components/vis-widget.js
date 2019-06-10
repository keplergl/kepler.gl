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

import PropTypes from 'prop-types';
import {
  INDICATORS,
  ANALYSIS_TABS_DEF,
  ANALYSIS_TABS_BGY
} from 'utils/filter-utils';

import {scaleLinear} from 'd3-scale';

import BarChartFactory from './plexus-analysis/bar-chart';
import ParallelCoordinatesKFactory from './plexus-analysis/parallel-coordinates';
import ParallelCoordinatesD3Factory from './plexus-analysis/parallel-coordinates-d3';
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
  DonutChartFactory
];

const WidgetContainer = styled.div`
  position: absolute;
  // padding-top: ${props => props.theme.sidePanel.margin.top}px;
  padding-right: ${props => props.theme.sidePanel.margin.right}px;
  padding-bottom: ${props => props.theme.sidePanel.margin.bottom}px;
  padding-left: ${props => props.theme.sidePanel.margin.left}px;
  bottom: 0;
  right: 0;
  z-index: 5;
 
  // maxwidth: ${props => props.width}px;
  // maxwidth: 1200px;
  // width: 35vw;
  width: 80vw;

  .bottom-widget--inner {
    background-color: ${props => props.theme.sidePanelBg};
    // padding: 10px ${innerPdSide}px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // height: 330px;
    // height: 660px;
    // height: 220px;
    // height: 80vh;
  }
`;

export default function VisWidgetFactory(
  BarChart,
  ParallelCoordinatesK,
  ParallelCoordinatesD3,
  DonutChart
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
    const currView = selected;
    
    // const DEFAULT_LIST = 5;

    if (datasets.barangays) {
      if (datasets.barangays.data) {
        console.log(datasets);
        // maxListSize = Math.min(DEFAULT_LIST, datasets.barangays.data.length);

        bgyIncl = datasets.barangays.data.map((d, idx) => ({
          [datasets.barangays.fields[1].name]:
            d[datasets.barangays.fields[1].tableFieldIndex - 1],
          [datasets.barangays.fields[2].name]:
            d[datasets.barangays.fields[2].tableFieldIndex - 1],
          [datasets.barangays.fields[3].name]:
            d[datasets.barangays.fields[3].tableFieldIndex - 1],
          // LATITUDE [datasets.barangays.fields[4].name]: d[datasets.barangays.fields[4].tableFieldIndex - 1],
          // LONGITUDE [datasets.barangays.fields[5].name]: d[datasets.barangays.fields[5].tableFieldIndex - 1],
          [datasets.barangays.fields[6].name]:
            d[datasets.barangays.fields[6].tableFieldIndex - 1],
          [datasets.barangays.fields[7].name]:
            d[datasets.barangays.fields[7].tableFieldIndex - 1],
          [datasets.barangays.fields[8].name]:
            d[datasets.barangays.fields[8].tableFieldIndex - 1],
          [datasets.barangays.fields[9].name]:
            d[datasets.barangays.fields[9].tableFieldIndex - 1],
          [datasets.barangays.fields[10].name]:
            d[datasets.barangays.fields[10].tableFieldIndex - 1],
          [datasets.barangays.fields[11].name]:
            d[datasets.barangays.fields[11].tableFieldIndex - 1],
          [datasets.barangays.fields[12].name]:
            d[datasets.barangays.fields[12].tableFieldIndex - 1],
          [datasets.barangays.fields[13].name]:
            d[datasets.barangays.fields[13].tableFieldIndex - 1],
          [datasets.barangays.fields[14].name]:
            d[datasets.barangays.fields[14].tableFieldIndex - 1],
          [datasets.barangays.fields[15].name]:
            d[datasets.barangays.fields[15].tableFieldIndex - 1]
        }));
        bgyIncl = bgyIncl.sort((a, b) => b[currView] - a[currView]);

        // datasets.barangays.fields.forEach(e => {
        //   if (indicatorValues.includes(e.name)) {
        //     cityMeans.push({
        //       value: e.name,
        //       y: INDICATORS[INDICATORS.findIndex(i => i.value == e.name)].label,
        //       x:
        //         bgyIncl.reduce((total, next) => total + next[e.name], 0) /
        //         bgyIncl.length
        //     });
        //   }
        // });
      }
    }

    return (
      <WidgetContainer width={'100vw'}>
        <div className="bottom-widget--inner">
          {bgyIncl ? <ParallelCoordinatesD3 data={bgyIncl} selected={selected} /> : null}
          {/* {bgyIncl ? <ParallelCoordinatesK data={bgyIncl} /> : null} */}
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
