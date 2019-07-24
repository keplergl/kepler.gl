import React, { Component } from 'react';
import styled from 'styled-components';
import demos from './carto-demos';

const FormElement = (component) => styled(component)`
  width: 100%;
  margin-bottom: 8px;
`;

const VizArea = FormElement(styled.textarea`
  resize: vertical
`);

const Input = FormElement(styled.input`
`);

const StyledSelect = FormElement(styled.select`
`);

const Header = styled.h4`
  color: ${props => props.theme.titleTextColor};
`;

const ErrorText = styled.p`
  color: red;
  font-weight: bold;
`

export default class CartoManager extends Component {

  constructor(props) {
    super(props);

    this.state = { 
      demo: {},
      error: null
    };
  }

  onSelectExample = (e) => {
    const value = e.target.value;

    if (value === 'demo') {
      return;
    }

    const selectedDemo = demos.find((demo) => demo.id === e.target.value);

    this.props.updateMap(selectedDemo.mapState);

    this.updateDemo(selectedDemo);
    this.reloadDemo(selectedDemo);
  }

  _changeUsername = (e) => {
    const demo = this.state.demo;
    demo.username = e.target.value;
    
    this.updateDemo(demo);
    this.reloadDemo(demo);
  }

  _changeApiKey = (e) => {
    const demo = this.state.demo;
    demo.apiKey = e.target.value;
    
    this.updateDemo(demo);
    this.reloadDemo(demo);
  }

  _changeDataset = (e) => {
    const demo = this.state.demo;
    demo.dataset = e.target.value;
    
    this.updateDemo(demo);
    this.reloadDemo(demo);
  }

  _changeSQL = (e) => {
    const demo = this.state.demo;
    demo.sql = e.target.value;
    
    this.updateDemo(demo);
    this.reloadDemo(demo);
  }

  _changeViz = (e) => {
    const demo = this.state.demo;
    demo.viz = e.target.value;
    
    this.updateDemo(demo);
    this.blendViz(demo.viz);
  }

  updateDemo(demo) {
    this.setState({ demo });
  }

  reloadDemo(demo) {
    if (!demo.username || !(demo.dataset || demo.sql)) {
      return;
    }

    window.loadCartoVLMap(demo);
  }

  blendViz(viz) {
    window.blendNewViz(viz).then(() => {
      this.setState({
        error: null
      });
    })
    .catch((error) => {
      this.setState({
        ...this.state,
        error: JSON.stringify(error)
      });
    });
  }

  _getForm() {
    return (<div>
      <Input type='text' onChange={this._changeUsername} placeholder='CARTO username' value={this.state.demo.username || ''} />
      <Input type='text' onChange={this._changeApiKey} placeholder='API key (defaults to default_public)' value={this.state.demo.apiKey || ''} />
      <Input type='text' onChange={this._changeDataset} placeholder='Dataset' value={this.state.demo.dataset || ''} />
      <Input type='text' onChange={this._changeSQL} placeholder='SQL query (overrides dataset)' value={this.state.demo.sql || ''} />
      <VizArea rows='10' onChange={this._changeViz} placeholder='Viz string' value={this.state.demo.viz || ''}></VizArea>
    </div>)
  }

  render() {
    const selectBox = (<StyledSelect onChange={this.onSelectExample}>
      <option value='demo'>
        Carto visualizations
      </option>
      {demos.map((demo) => (
        <option key={demo.id} value={demo.id}>{demo.name}</option> 
      ))}
    </StyledSelect>);

    const form = !this.state.demo ? null : this._getForm();

    return (<div>
      <Header>Pick an example from below</Header>
      {selectBox}
      {form}
      {this.state.error && <ErrorText>
        {this.state.error.name}:{this.state.error.type}
      </ErrorText>}
    </div>)
  }
}
