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
import styled from 'styled-components';
import PropTypes from 'prop-types';

import {scaleLinear} from 'd3-scale';
import {IconRoundSmall} from 'components/common/styled-components';
import {ArrowLeft, ArrowRight} from 'components/common/icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faSortAmountDown, faSortAmountDownAlt } from '@fortawesome/free-solid-svg-icons'

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  HorizontalBarSeries,
  makeWidthFlexible,
  LabelSeries,
  ChartLabel
} from 'react-vis';

// import './../bottom-widget.scss';

const ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;

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

  .control-panel__title{
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

export class BarChart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      data,
      title,
      xKey,
      yKey,
      paginationFunc,
      reverseFunc,
      maxBar,
      listSize,
      visState,
      height
    } = this.props;
    // const width = 400;
    // TODO: transfer constant
    const width = 270;



    let dataSorted = data;
    // slice data for paginated bar chart
    if (paginationFunc && reverseFunc) {
      dataSorted = visState.analysisRankingReverse ? data.reverse() : data;
      dataSorted = dataSorted.slice(
        (visState.analysisRankingPage - 1) * maxBar,
        Math.min(
          maxBar + (visState.analysisRankingPage - 1) * maxBar,
          dataSorted.length
        )
      );
      dataSorted = dataSorted.reverse();
    }

    // format data
    let scaledData;
    {
      xKey && yKey
        ? (scaledData = dataSorted.map((d, idx) => ({
            ...d,
            x: d[xKey],
            y: d[yKey]
          })))
        : (scaledData = dataSorted.map((d, idx) => ({
            ...d,
            x: d.x
          })));
    }

    // truncate long y-axis labels
    const MAX_LENGTH = 13;
    scaledData = scaledData.map(d => ({
      ...d,
      // barangay: d.y,
      y: d.y.length > MAX_LENGTH ? d.y.slice(0, MAX_LENGTH) + '...' : d.y
    }));

    // labels right of bar
    const dataLabels = scaledData.filter((d)=>(!d.hasOwnProperty('display')?true:(d.display))).map((d, idx) => ({
      x: d.x,
      y: d.y,
      label: d.x.toFixed(2),
      xOffset: 20,
      yOffset: 7,
      style: {fill: '#6A7485'}
    }));

    const YLabel = props => (
      <foreignObject>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            width: props.containerWidth / props.tickCount,
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }}
        >
          {props.children}
        </div>
      </foreignObject>
    );

    function myFormatter(value) {
      //console.log(value);
      //console.log('MYFORMATTER');
      return (
        <foreignObject
          x="-90"
          y="-10"
          width="80"
          height="20"
          onClick={() => {
            console.log('BARCHART CLICK ' + value);
          }}
        >
          <text>{value}</text>
        </foreignObject>
      );
    }

    const FlexibleXYPlot = makeWidthFlexible(XYPlot);
    let maxPage;

    if(paginationFunc && reverseFunc)
     maxPage = listSize%maxBar==0?Math.floor(listSize/maxBar):Math.floor(listSize/maxBar)+1;

     console.log('bar chart data');
     console.log(scaledData);
     console.log(scaledData.filter((d)=>(!d.hasOwnProperty('display')?true:(d.display))));
     console.log(scaledData.filter((d)=>((d.display))));
     console.log(dataLabels);
     
     
    return (
      <div>
        {title || (paginationFunc && reverseFunc) ? (
          <ControlPanel>
            <div className="control-panel-item">
              <p className="control-panel__title">{title}</p>            
            </div>
            { paginationFunc && reverseFunc ? (
              <div className="control-panel-item">
              <ControlBtn
                onClick={() => {
                  reverseFunc(!visState.analysisRankingReverse);
                  paginationFunc(1);
                }}
              >
                {visState.analysisRankingReverse ? 
                <FontAwesomeIcon icon={faSortAmountDown} />              
                :
                <FontAwesomeIcon icon={faSortAmountDownAlt} />              
                }
              </ControlBtn>
              <ControlBtn onClick={ ()=> {console.log("button prv " + visState.analysisRankingPage + " " + Math.max(1,visState.analysisRankingPage - 1)); paginationFunc(Math.max(1,visState.analysisRankingPage - 1))}}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </ControlBtn>
              <p>Page {visState.analysisRankingPage} of {maxPage}</p>
              <ControlBtn onClick={ ()=> {console.log("button nxt " + visState.analysisRankingPage + " " + Math.min(maxPage,visState.analysisRankingPage + 1)); paginationFunc(Math.min(maxPage,visState.analysisRankingPage + 1))}}>
                <FontAwesomeIcon icon={faAngleRight} />              
              </ControlBtn>           
            </div>
            ) : null }
          </ControlPanel>
        ) : null}

        <XYPlot
          xDomain={[0.0, 1.0].map(x => x * 100)}
          margin={{left: 100, right: 30, top: 25, bottom: 25}}
          height={height?height:160}
          width={width}
          yType="ordinal"
        >
          <XAxis
            orientation={'top'}
            tickValues={[0, 0.5, 1.0].map(x => x * 100)}
            style={{
              ticks: {stroke: '#6A7485'},
              text: {fill: '#6A7485'},
              fontWeight: 100
            }}
          />
          {/* TODO: use props */}
          <YAxis
            // getY={d=>(d.y.length > 12 ? (d.y.slice(0,12) + '...') : d.y )}
            tickFormat={myFormatter}
            style={{
              ticks: {stroke: '#6A7485'},
              color: '#6A7485',
              fontWeight: 100
            }}
          />
          {/* { dataSorted.length > 0 ? (
          <HorizontalBarSeries 
             dataSorted={dataSorted} 
        barWidth={0.5} />
        ): null
        } */}

          <HorizontalBarSeries animation data={scaledData.filter((d)=>(!d.hasOwnProperty('display')?true:(d.display)))} barWidth={0.5} />
          <LabelSeries
            data={dataLabels}
            labelAnchorX="middle"
            labelAnchorY="text-after-edge"
          />
          {/* TODO: fix off-center bug */}
          {/* {title ? (
            <ChartLabel
              includeMargin={false}
              text={title}
              xPercent={0.5}
              yPercent={1.4}
              style={{
                // transform: 'rotate(-90)',
                textAnchor: 'middle'
              }}
            />
          ) : null} */}
        </XYPlot>
      </div>
    );
  }
}

const BarChartFactory = () => BarChart;
export default BarChartFactory;
