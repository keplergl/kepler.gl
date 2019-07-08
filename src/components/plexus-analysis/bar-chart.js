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

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faAngleRight,
  faSortAmountDown,
  faSortAmountDownAlt
} from '@fortawesome/free-solid-svg-icons';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  HorizontalBarSeries,
  makeWidthFlexible,
  LabelSeries,
  ChartLabel,
  Hint
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

  .control-panel__title {
    font-weight: 500;
    color: ${props => props.theme.labelColor};    
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

    this.state = {
      hovered: null,
    }
  }

  render() {
    const {
      data,
      title,
      xKeyArr,
      floatFormat,
      xKey,
      yKey,
      categoryLabel,
      paginationFunc,
      reverseFunc,
      maxBar,
      domainMax,
      listSize,
      analysisRankingReverse,
      analysisRankingPage,
      onLabelClick,
      height
    } = this.props;

    // TODO: make responsive
    const width = 270;

    // console.log('bar chart');
    // console.log(data);
    // format data
    // let formattedData = data;
    // {
    //   xKey && yKey && !Array.isArray(xKey)
    //     ? (formattedData = data.map((d, idx) => ({
    //         ...d,
    //         x: d[xKey],
    //         y: d[yKey]
    //       })))
    //     : (formattedData = data.map((d, idx) => ({
    //         ...d,
    //         x: d.x
    //       })));
    // }
    let formattedData = data;
    let dataSorted = data;
    let dataSliced = data;
    let max;
    let dataLabels;
    let bars = [];

    if (xKeyArr && data) {

      xKeyArr.forEach(x => {
        dataSliced = dataSliced.map((d, idx) => ({
          ...d,
          x: xKey ? d[x[xKey]] : d[x],
          y: d[yKey],
          valueLabel: xKey ? x[xKey] : x,
          actualValue: xKey ? d[x[xKey]] : d[x],
        }));
        bars.push(
          <HorizontalBarSeries
            animation
            data={dataSliced.filter(d =>
              !d.hasOwnProperty('display') ? true : d.display
            )}
            barWidth={0.5}
            onValueMouseOver={(datapoint, event)=>{
              // does something on click
              // you can access the value of the event
              console.error('bar chart hover');
              console.error(datapoint);
              console.error(event);
              this.setState({hovered: datapoint});
              // console.error(event);
            }}
          />
        );
      });

      // get largest value in data
      max = dataSliced.reduce((prev, current) =>
        prev.count > current.count ? prev : current
      ).count;

      // generate labels
      dataLabels = dataSliced
        .filter(d => (!d.hasOwnProperty('display') ? true : d.display))
        .map((d, idx) => ({
          x: d.count,
          y: d.name,
          label: d.count,
          // xOffset: 20,
          yOffset: 5,
          style: {fill: '#6A7485'}
        }));
      
    } else {
      if (xKey && yKey) {
        formattedData = data.filter(d => typeof d[yKey] !== undefined);
        formattedData = formattedData.map((d, idx) => ({
          ...d,
          x: d[xKey],
          y: d[yKey]
        }));
      } else {
        formattedData = data.filter(d => typeof d['y'] !== undefined);
        formattedData = data.map((d, idx) => ({
          ...d,
          x: d.x
        }));
      }

      dataSorted = formattedData;
      dataSliced = formattedData;

      // slice data for paginated bar chart
      if (paginationFunc && reverseFunc) {
        dataSorted = analysisRankingReverse
          ? formattedData.reverse()
          : formattedData;
        dataSliced = dataSorted.slice(
          (analysisRankingPage - 1) * maxBar,
          Math.min(
            maxBar + (analysisRankingPage - 1) * maxBar,
            dataSorted.length
          )
        );
        dataSliced = dataSliced.reverse();
      }

      // get largest value in data
      max = domainMax
        ? domainMax
        : dataSorted.reduce((prev, current) =>
            prev.x > current.x ? prev : current
          ).x;

      // generate labels
      dataLabels = dataSliced
        .filter(d => (!d.hasOwnProperty('display') ? true : d.display))
        .map((d, idx) => ({
          x: d.x,
          y: d.y,
          label: floatFormat ? d.x.toFixed(2) : d.x,
          xOffset: 20,
          yOffset: 7,
          style: {fill: '#6A7485'}
        }));

      bars.push(
        <HorizontalBarSeries
          animation
          data={dataSliced.filter(d =>
            !d.hasOwnProperty('display') ? true : d.display
          )}
          barWidth={0.5}
        />
      );
      // console.error('non stacked bar chart DONE');
    }

    // get bar chart labels
    let maxDom = 0;
    while (maxDom < max) {
      maxDom += 50;
    }

    // truncate long y-axis labels
    const MAX_LENGTH = 13;
    // dataSliced = dataSliced.map(d => ({
    //   ...d,
    //   y: d.y.length > MAX_LENGTH ? d.y.slice(0, MAX_LENGTH) + '...' : d.y
    // }));

    // labels right of bar

    function myFormatter(value, index, scale, tickTotal) {
      return (
        <foreignObject
          x="-90"
          y="-10"
          width="80"
          height="20"
          onClick={() => {
            console.log('BARCHART CLICK ' + value);
            console.log('BARCHART CLICK ' + index);
            console.log(dataSliced[index]);
            if(onLabelClick) onLabelClick(dataSliced[index].id);
          }}
        >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            width: 80, 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
            textAlign: 'end',
            cursor: 'pointer',
            ":hover": {
              textDecoration: 'underline',
              color: 'white',
            }
          }}
        >
          {/* <text>{value}</text> */}
          {value}
          </div>
        </foreignObject>
      );
    }

    const FlexibleXYPlot = makeWidthFlexible(XYPlot);
    let maxPage;

    if (paginationFunc && reverseFunc)
      maxPage =
        listSize % maxBar == 0
          ? Math.floor(listSize / maxBar)
          : Math.floor(listSize / maxBar) + 1;

    return (
      <div>
        {title || (paginationFunc && reverseFunc) ? (
          <ControlPanel>
            <div className="control-panel-item">
              <p className="control-panel__title">{title}</p>
            </div>
            {paginationFunc && reverseFunc ? (
              <div className="control-panel-item">
                <ControlBtn
                  onClick={() => {
                    reverseFunc(!analysisRankingReverse);
                    paginationFunc(1);
                  }}
                >
                  {analysisRankingReverse ? (
                    <FontAwesomeIcon icon={faSortAmountDown} />
                  ) : (
                    <FontAwesomeIcon icon={faSortAmountDownAlt} />
                  )}
                </ControlBtn>
                <ControlBtn
                  onClick={() => {
                    paginationFunc(Math.max(1, analysisRankingPage - 1));
                  }}
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </ControlBtn>
                <p>
                  Page {analysisRankingPage} of {maxPage}
                </p>
                <ControlBtn
                  onClick={() => {
                    paginationFunc(Math.min(maxPage, analysisRankingPage + 1));
                  }}
                >
                  <FontAwesomeIcon icon={faAngleRight} />
                </ControlBtn>
              </div>
            ) : null}
          </ControlPanel>
        ) : null}

        <XYPlot
          // xDomain={[0.0, 1.0].map(x => x * 100)}
          xDomain={[0, maxDom]}
          margin={{left: 100, right: 30, top: 25, bottom: 25}}
          height={height ? height : 160}
          width={width}
          onMouseLeave={() => this.setState({hovered: null})}
          stackBy={xKeyArr ? 'x' : ''}
          yType="ordinal"
        >
          <XAxis
            orientation={'top'}
            tickValues={[0, maxDom / 2, maxDom]}
            style={{
              ticks: {stroke: '#C3C9C5'},
              text: {fill: '#C3C9C5'},
              fontWeight: 200
            }}
          />
          {/* TODO: use props */}
          <YAxis
            // getY={d=>(d.y.length > 12 ? (d.y.slice(0,12) + '...') : d.y )}
            tickFormat={myFormatter}
            style={{
              ticks: {stroke: '#C3C9C5'},
              color: '#C3C9C5',
              fontWeight: 200
            }}
          />

          {bars}

          <LabelSeries
            data={dataLabels}
            labelAnchorX="middle"
            labelAnchorY="text-after-edge"
          />
          {this.state.hovered && (
            <Hint
              xType="literal"
              yType="literal"
              getX={d => d.x}
              getY={d => d.y}
              value={{
                Barangay: this.state.hovered.y,
                [categoryLabel ? categoryLabel : 'Category']: this.state.hovered.valueLabel,
                Count: this.state.hovered.actualValue,
              }}
            />
          )}
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
