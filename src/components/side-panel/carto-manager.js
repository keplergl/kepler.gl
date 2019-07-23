import React, { Component } from 'react';
import demos from './carto-demos';

export default class CartoManager extends Component {

  onSelectExample = (e) => {
    const value = e.target.value;

    if (value === 'demo') {
      return;
    }

    const selectedDemo = demos.find((demo) => demo.id === e.target.value);

    this.props.updateMap(selectedDemo.mapState);

    window.loadCartoVLMap({
      dataset: selectedDemo.dataset,
      query: selectedDemo.sql,
      viz: selectedDemo.viz
    });
  }

  render() {
    return (<select onChange={this.onSelectExample}>
      <option value='demo'>
        Carto visualizations
      </option>
      {demos.map((demo) => (
        <option key={demo.id} value={demo.id}>{demo.name}</option> 
      ))}
    </select>)
  }
}
