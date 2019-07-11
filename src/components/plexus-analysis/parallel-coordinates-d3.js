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

import {IconRoundSmall} from 'components/common/styled-components';
import {Close} from 'components/common/icons';

import {format} from 'd3-format';
import {scaleLinear} from 'd3-scale';
import {divgrid} from './divgrid';
// import '~parcoord-es/parcoords.css';
import './test.scss';
import ParCoords from 'parcoord-es';

import * as d3 from 'd3';

// import './../bottom-widget.scss';

const PCWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: ${props => props.width - 50}px;
  background-color: ${props => props.theme.sidePanelBg};

  #grid {
    ${props => props.theme.sidePanelScrollBar};
    // background-color: ${props => props.theme.titleTextColor};
    // color: ${props => props.theme.sidePanelBg};
    // padding: 10px;
  }
`;

const PCVisWrapper = styled.div`
  width: ${props => props.width - 50}px;
  height: 280px;
  display: ${props => props.display};
`;

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
    font-size: 1.2em;
    font-weight: 400;
    color: ${props => props.theme.labelColor};
  }
`;
const ControlBtn = styled.button`
  cursor: pointer;
  color: ${props => props.theme.labelColor};
  background: none;
  border: none;
`;
export class ParallelCoordinatesD3 extends Component {
  constructor(props) {
    super(props);

    const {data} = this.props;

    this.state = {
      visible: true,
      data: data.sort((a, b) => b['name'] - a['name']),
      pc: null,
      table: null
    };

    this.refreshPC = this.refreshPC.bind(this);
  }

  componentDidMount() {
    // initialize
    const domainStructure = Object.keys(this.state.data[0])
      .filter(d => d != 'name')
      .map(name => ({
        name,
        domain: [Infinity, -Infinity]
      }));

    let domains = this.state.data.reduce((acc, row) => {
      return acc.map(d => {
        return {
          name: d.name,
          domain: [
            Math.min(d.domain[0], row[d.name]),
            Math.max(d.domain[1], row[d.name])
          ]
        };
      });
    }, domainStructure);

    let pData = this.state.data.sort((a, b) => b['name'] - a['name']);
    let dimensions = {};
    domains.forEach(d => {
      if (
        d.name == 'desirability' ||
        d.name == 'spatial' ||
        d.name == 'temporal' ||
        d.name == 'economic' ||
        d.name == 'physiological' ||
        d.name == 'physical' ||
        d.name == 'psychological' ||
        d.name == 'sustainability' ||
        d.name == 'performance' ||
        d.name == 'fairness'
      ) {
        // dimensions[d.name] = {tickValues: [0, 20, 40, 60, 80, 100], ticks: 6,};
        // dimensions[d.name] = {ticks: 6,};
        dimensions[d.name] = {
          tickValues: [0, 20, 40, 60, 80, 100],
          yscale: d3
            .scaleLinear()
            .domain([0, 100])
            .range([220, 0])
        };
      } else {
        dimensions[d.name] = {
          yscale: d3
            .scaleLinear()
            .domain(
              d3.extent(this.state.data, function(a) {
                return +a[d.name];
              })
            )
            .range([220, 0]),
          ticks: 6
        };
      }
    });

    // linear color scale
    var colorScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range(['rgba(255,255,255,0.1)', 'rgb(255,255,255,1)'])
      .interpolate(d3.interpolateLab);

    let chart = ParCoords()('#example')
      .alpha(0.4)
      .mode('queue')
      .data(pData)
      // .color(d => {
      //   return colorScale(d['spatial']);
      // })
      .dimensions(dimensions)
      .width(this.props.width - 50)
      .hideAxis(['name', 'population', 'income', 'desirability', 'id'])
      .margin({
        top: 40,
        right: 60,
        bottom: 30,
        left: 20
      })
      // .composite("darken")
      // .color(function(d) { return state.colorScale(d[selected]); })
      // .render()
      .createAxes()
      // .brushMode('1D-axes') // enable brushing
      .interactive(); // command line mode;

    // create data table, row hover highlighting
    var grid = divgrid();
    d3.select('#grid')
      // .datum(this.state.data.slice(0, 10))
      .datum(pData)
      .call(grid);

    // update data table on brush event
    // chart.on('brush', function(d) {
    //   d3.select('#grid')
    //     .datum(d)
    //     .call(grid)
    //     .selectAll('.row')
    //     .on({
    //       mouseover: function(d) {
    //         chart.highlight([d]);
    //       },
    //       mouseout: chart.unhighlight
    //     });
      
    //   var rows = d3.select('#grid').selectAll('.row');
    //   rows.on('mouseover', function(d) {
    //     chart.highlight([d]);
    //   });
    //   rows.on('mouseout', function(d) {
    //     chart.unhighlight();
    //   });
    // });

    // add highlight line on row hover
    var rows = d3.select('#grid').selectAll('.row');
      rows.on('mouseover', function(d) {
        chart.highlight([d]);
      });
      rows.on('mouseout', function(d) {
        chart.unhighlight();
      });

    this.setState({
      pc: chart,
      table: grid,
    });

    console.log('DIDMOUNT');
  }

  refreshPC(data, selected) {
    if (this.state.pc != null) {
      var colorScale = d3
        .scaleLinear()
        .domain([0, 100])
        // .range(['red', 'yellow'])
        .range(["#bd0026", "#ffffb2"]) // TODO: get colors from legend
        // .range(["#bd0026", "#f03b20","#fd8d3c","#feb24c","#fed976","#ffffb2"]) // TODO: get colors from legend
        // .range(['rgba(255,255,255,0.1)', 'rgb(255,255,255,1)']) "#f03b20""#fd8d3c""#feb24c""#fed976""#ffffb2"
        // .range(['black', 'white'])
        .interpolate(d3.interpolateLab);

      // let chart = this.state.pc;

      console.error(data);
      let dataNew = data.forEach(d=>delete d.id);
      console.error(dataNew);
      // update color on indicator change
      let chart = this.state.pc;
      chart
        .data(data)
        .width(this.props.width - 50)
        .color(d => {
          return colorScale(d[selected]);
        })
        .alpha(0.4)
        .shadows()
        .render();

      // update table on filter
      var grid = divgrid();
        d3.select('#grid')
          // .datum(this.state.data.slice(0, 10))
          .datum(data)
          .call(grid); 
    
      // add mouse events on grid rows
      // var rows = d3.select('#grid').selectAll('.row');
      // rows.on('mouseover', function(d) {
      //   chart.highlight([d]);
      // });
      // rows.on('mouseout', function(d) {
      //   chart.unhighlight();
      // });
    }
  }

  render() {
    let {data, selected} = this.props;

    this.refreshPC(data, selected);

    // axis colorworkaround
    d3.selectAll('path.domain').attr(
      'style',
      'stroke:rgb(255,255,255);stroke-width:1.6px;'
    );
    d3.selectAll('.tick line').attr(
      'style',
      'stroke:rgb(255,255,255);stroke-width:1.6px;'
    );

    return (
      <PCWrapper width={this.props.width}
        // style={{
        //   display: 'flex',
        //   flexDirection: 'column',
        //   justifyContent: 'flex-start',
        //   alignItems: 'center',
        //   width: '100%',
        // }}
      >
        {/* TODO move to parent */}
        {/* <ControlPanel>
          <div className="control-panel-item">
            <p className="control-panel__title">Parallel Coordinates</p>
          </div>
          <div className="control-panel-item">
            <IconRoundSmall onClick={() => {
                console.log('close');
                this.setState({visible: !this.state.visible});
              }} >
              <Close height="12px" onClick={() => {
                console.log('close');
                this.setState({visible: !this.state.visible});
              }} />
            </IconRoundSmall>
          </div>
        </ControlPanel> */}
        {/* <div
          id="example"
          className="parcoords ex"
          style={{
            width: '1106px',
            height: '280px',
            display: this.state.visible ? 'block' : 'none'
          }}
        /> */}
        <PCVisWrapper id="example" className="parcoords ex" width={this.props.width - 50} visible={this.state.visible ? 'block' : 'none'}/>
        <div
          id="grid"
          className="parcoords ex"
          style={{display: this.state.visible ? 'block' : 'none'}}
        />
      </PCWrapper>
    );
  }
}

const ParallelCoordinatesD3Factory = () => ParallelCoordinatesD3;
export default ParallelCoordinatesD3Factory;
