import React, { Component } from 'react'
import styled from 'styled-components';

const StyledDataset = styled.div`
  cursor: pointer;
`;

export default class Dataset extends Component {

  _onClick = () => {
    this.props.onClick(this.props.id);
  }

  render() {
    return <StyledDataset onClick={this._onClick}>
      {this.props.id}
    </StyledDataset>
  }
}