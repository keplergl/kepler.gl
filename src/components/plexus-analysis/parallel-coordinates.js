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

import {format} from 'd3-format';
import {scaleLinear} from 'd3-scale';

import {
  ParallelCoordinates,
  makeWidthFlexible
} from 'react-vis';

import './../bottom-widget.scss';


export class ParallelCoordinatesK extends Component {
  render() {

    const {
      data
    } = this.props;

    const DEFAULT_DOMAIN = {min: Infinity, max: -Infinity};

    const domainStructure = Object.keys(data[0])
      .filter(d => d != 'name')
      .map(name => ({name, domain: [Infinity, -Infinity]}));
  
    const domains = data.reduce((acc, row) => {
      return acc.map((d,i) => {
        return {
          name: d.name,
          domain: [
            i < 2 ? Math.min(d.domain[0], row[d.name]) : 0,
            i < 2 ? Math.max(d.domain[1], row[d.name]) : 100
          ]
        };
      });
    }, domainStructure);
  
    // begin by figuring out the domain of each of the columns
    // const pdomains = data.reduce((res, row) => {
    //   Object.keys(row).forEach(key => {
    //     if (!res[key]) {
    //       res[key] = {...DEFAULT_DOMAIN};
    //     }
    //     res[key] = {
    //       min: Math.min(res[key].min, row[key]),
    //       max: Math.max(res[key].max, row[key])
    //     };
    //   });
    //   return res;
    // }, {});

    // // use that to generate columns that map the data to a unit scale
    // const scales = Object.keys(pdomains).reduce((res, key) => {
    //   const domain = pdomains[key];
    //   res[key] = scaleLinear()
    //     .domain([domain.min, domain.max])
    //     .range([0, 1]);
    //   return res;      
    // }, {});

    // // break each object into an array and rescale it
    // const mappedData = data.map(row => {
    //   return Object.keys(row)
    //     .filter(key => key !== 'name')
    //     .map(key => ({
    //       x: key,
    //       y: scales[key](Number(row[key]))
    //     }));
    // });
    const FlexiblePC = makeWidthFlexible(ParallelCoordinates);
    // console.log("Parallel Coordinates");
    // console.log(domainStructure);
    // console.log(domains);
    // console.log(data);
    // console.log(mappedData);

    // const wideFormat = format('.3r');

    return (
        <ParallelCoordinates
            animation
            brushing
            data={data}
            domains={domains}
            // tickFormat={t => wideFormat(t)}
            // tickTotal={5}
            // margin={15}
            margin={{left: 0, right: 0, top: 30, bottom: 25}}            
            width={750}
            height={170}
            style={{
              lines: {
                strokeOpacity: 0.7,
                strokeWidth: '1px',
              },
              deselectedLineStyle: {
                strokeOpacity: 0.1,
                strokeWidth: '1px',
              },
              labels:{
                fontSize: 9,
                transform: 'translate(0 -15)',
                textAnchor: 'middle',                
                fill: '#6A7485',
              },
              
            }}
        />
    );
  }
}

const ParallelCoordinatesKFactory = () => ParallelCoordinatesK;
export default ParallelCoordinatesKFactory;
