import React, { Component } from 'react'
import styled from 'styled-components';

const StyledDataset = styled.div`
  cursor: pointer;
`;

export default class Dataset extends Component {

  _onClick = () => {
    this.props.onClick(
      `https://roman-carto.carto.com:443/api/v2/sql?q=select * from "roman-carto".${this.props.id}&format=geojson`
    );
  }

  render() {
    return <StyledDataset onClick={this._onClick}>
      {this.props.id}
    </StyledDataset>
  }
}