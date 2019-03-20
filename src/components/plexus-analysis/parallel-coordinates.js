import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import {scaleLinear} from 'd3-scale';

import {
  ParallelCoordinates,
  makeWidthFlexible
} from 'react-vis';

import './../bottom-widget.scss';

const propTypes = {
  filters: PropTypes.arrayOf(PropTypes.object),
  datasets: PropTypes.object,
  uiState: PropTypes.object,
  visStateActions: PropTypes.object,
  uiStateActions: PropTypes.object,
  sidePanelWidth: PropTypes.number,
  containerW: PropTypes.number
};

export class ParallelCoordinatesK extends Component {
  render() {

    const {
      data
    } = this.props;

    const DEFAULT_DOMAIN = {min: Infinity, max: -Infinity};

    const domainStructure = Object.keys(data[0])
      .map(name => ({name, domain: [Infinity, -Infinity]}));
  
    const domains = data.reduce((acc, row) => {
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
  
    // begin by figuring out the domain of each of the columns
    const pdomains = data.reduce((res, row) => {
      Object.keys(row).forEach(key => {
        if (!res[key]) {
          res[key] = {...DEFAULT_DOMAIN};
        }
        res[key] = {
          min: 0,
          max: 1.0,
        };
      });
      return res;
    }, {});

    // use that to generate columns that map the data to a unit scale
    const scales = Object.keys(pdomains).reduce((res, key) => {
      const domain = pdomains[key];
      res[key] = scaleLinear()
        .domain([domain.min, domain.max])
        .range([0, 1]);
      return res;      
    }, {});

    // break each object into an array and rescale it
    const mappedData = data.map(row => {
      return Object.keys(row)
        .filter(key => key !== 'name')
        .map(key => ({
          x: key,
          y: scales[key](Number(row[key]))
        }));
    });
    const FlexiblePC = makeWidthFlexible(ParallelCoordinates);

    return (
        <ParallelCoordinates
            animation
            brushing
            data={data}
            domains={domains}
            tickTotal={5}
            margin={15}
            width={450}
            height={160}
        />
    );
  }
}

const ParallelCoordinatesKFactory = () => ParallelCoordinatesK;
export default ParallelCoordinatesKFactory;
