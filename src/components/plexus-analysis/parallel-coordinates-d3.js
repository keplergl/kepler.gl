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

import {format} from 'd3-format';
import {scaleLinear} from 'd3-scale';
import {divgrid} from './divgrid';
// import '~parcoord-es/parcoords.css';
import './test.scss';
import ParCoords from 'parcoord-es';

import * as d3 from 'd3';

// import './../bottom-widget.scss';
const ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1106px;

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
export class ParallelCoordinatesD3 extends Component {
  constructor(props) {
    super(props);

    const {data} = this.props;

    this.state = {
      visible: true,
      data: data,
      colorScale: d3
        .scaleLinear()
        .domain([0, 100])
        .range(['rgba(255,255,255,0.4)', 'rgb(255,255,255,1)'])
        .interpolate(d3.interpolateLab),
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

    console.log('pk domains');
    console.log(domains);
    console.log(this.state.data);

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
              yscale: d3.scaleLinear()
              .domain(d3.extent(this.state.data, function(a) {
                      return +a[d.name];
                    })
              )
              .range([220, 0]),
              ticks: 6,
        };
      }
    });

    console.log('createddim');
    console.log(dimensions);

    // linear color scale
    var colorScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range(['rgba(255,255,255,0.1)', 'rgb(255,255,255,1)'])
    .interpolate(d3.interpolateLab);



    let chart = ParCoords()('#example')
      .data(this.state.data)
      .color(d => {
        return colorScale(d['spatial']);
      })
      .dimensions(dimensions)
      .width(1106)
      .hideAxis(['name'])
      .margin({
        top: 40,
        right: 0,
        bottom: 30,
        left: 20
      })
      // .composite("darken")
      // .color(function(d) { return state.colorScale(d[selected]); })
      .render()
      .createAxes()
      .brushMode('1D-axes-multi') // enable brushing
      .interactive(); // command line mode;

    // create data table, row hover highlighting
    var grid = divgrid();
    d3.select('#grid')
      // .datum(this.state.data.slice(0, 10))
      .datum(this.state.data)
      .call(grid);

    var rows = d3.select('#grid').selectAll('.row');
    rows.on('mouseover', function(d) {
      chart.highlight([d]);
    });
    rows.on('mouseout', function(d) {
      chart.unhighlight();
    });

    // update data table on brush event
    chart.on('brush', function(d) {
      d3.select('#grid')
        // .datum(d.slice(0, 10))
        .datum(d)
        .call(grid)
        .selectAll('.row')
        .on({
          mouseover: function(d) {
            chart.highlight([d]);
          },
          mouseout: chart.unhighlight
        });
    });

    this.setState({
      pc: chart,
      table: grid,
      visible: !this.state.visible
    });

    console.log('DIDMOUNT');
  }

  refreshPC(data, selected) {
    if (this.state.pc != null) {
      var colorScale = d3
        .scaleLinear()
        .domain([0, 100])
        // .range(['red', 'blue'])
        // .range(['rgba(255,255,255,0.1)', 'rgb(255,255,255,1)'])
        .range(['black', 'white'])
        .interpolate(d3.interpolateLab);

      console.log('refresh pc ' + selected);
      console.log(this.state);
      // let chart = this.state.pc;

      this.state.pc
        .data(data)
        .color(d => {
          return colorScale(d[selected]);
        })
        .render();
    }
  }

  // updateTable(data, selected) {
  //   // create data table, row hover highlighting
  //   // var grid = this.state.
  //   d3.select('#grid')
  //     .datum(this.state.data.slice(0, 10))
  //     .call(grid);

  //   var rows = d3.select('#grid').selectAll('.row');
  //   rows.on('mouseover', function(d) {
  //     chart.highlight([d]);
  //   });
  //   rows.on('mouseout', function(d) {
  //     chart.unhighlight();
  //   });

  //   // update data table on brush event
  //   chart.on('brush', function(d) {
  //     d3.select('#grid')
  //       .datum(d.slice(0, 10))
  //       .call(grid)
  //       .selectAll('.row')
  //       .on({
  //         mouseover: function(d) {
  //           chart.highlight([d]);
  //         },
  //         mouseout: chart.unhighlight
  //       });
  //   });
  // }

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}
      >
      {/* TODO move to parent */}
        <ControlPanel>
          <div className="control-panel-item">
            <p className="control-panel__title">Parallel Coordinates</p>            
          </div>
          <div className="control-panel-item">
            <ControlBtn onClick={ ()=> {console.log('close');this.setState({visible: !this.state.visible});}}>
              {this.state.visible ? 'Hide' : 'Show'}
            </ControlBtn>     
          </div>
        </ControlPanel>
        {/* <div style={{width: '1106px', display: 'flex', justifyContent: 'space-between'}}>  
          <p>Parallel Coordinates</p>
          <button onClick={()=>{
            console.log('close');
            this.setState({visible: !this.state.visible});
            }}>Close</button>
        </div> */}
        <div
          id="example"
          className="parcoords ex"
          style={{width: '1106px', height: '280px', display: this.state.visible? 'block':'none'}}
        />
        <div id="grid" className="parcoords ex" style={{display: this.state.visible? 'block':'none'}}/>
      </div>
      // <div id="chart">
      //   <canvas id="background" />
      //   <canvas id="foreground" />
      //   <canvas id="highlight" />
      //   <svg />
      // </div>
    );
  }
}

const ParallelCoordinatesD3Factory = () => ParallelCoordinatesD3;
export default ParallelCoordinatesD3Factory;
