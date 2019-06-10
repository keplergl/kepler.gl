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

// TODO: this will move onto kepler.gl core
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {ItemSelector} from 'kepler.gl/components';
import {Button} from 'kepler.gl/components/common/styled-components';
import {CORS_LINK, LOADING_URL_MESSAGE} from '../../constants/default-settings';

const propTypes = {
  onSelectCity: PropTypes.func.isRequired
};

const StyledDescription = styled.div`
  font-size: 14px;
  color: ${props => props.theme.labelColorLT};
  line-height: 18px;
  margin-bottom: 12px;
`;

const InputForm = styled.div`
  flex-grow: 1;
  padding-top: 10px;
  padding-bottom: 40px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.inputPadding};
  color: ${props => (props.error ? 'red' : props.theme.titleColorLT)};
  background-color: ${props => props.theme.panelBackgroundLT};
  height: ${props => props.theme.inputBoxHeight};
  border: 0;
  outline: 0;
  font-size: ${props => props.theme.inputFontSize};

  :active,
  :focus,
  &.focus,
  &.active {
    outline: 0;
  }
`;

const StyledFromGroup = styled.div`
  margin-top: 30px;
`;

const ArrowSvg = () => (
  <svg
    className="side-panel-logo__logo"
    width="30px"
    height="30px"
    viewBox="0 0 22 15"
  >
    <g transform="translate(11, -3) rotate(45.000000)">
      <rect fill="#1FBAD6" x="5" y="0" width="10" height="10" />
      <rect fill="#25282F" x="2" y="3" width="10" height="10" />
    </g>
  </svg>
);

export const StyledInputLabel = styled.div`
  font-size: 11px;
  color: ${props => props.theme.textColorLT};
  letter-spacing: 0.2px;
  ul {
    padding-left: 12px;
  }
`;

export const StyledBtn = styled.button`
  background-color: ${props => props.theme.primaryBtnActBgd};
  color: ${props => props.theme.primaryBtnActColor};
  margin: 20px 0px;
  padding: 10px;
  text-align: right;
`;

export const StyledCityButton = styled.button`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 400;
  font-size: 0.875em;
  background-color: #25282F;
  // color: ${props => props.theme.primaryBtnActColor};
  color: #bababa;
  margin: 20px;
  padding: 20px;
  text-align: left;
  width: 70%;
  height: 80px;
  display:flex;
  flex-direction:row;
  align-items:center;
  border:none;
  border-left: 7px solid #D0CFCE;
  // box-shadow: 0px 6px 8px 0px rgba(0,0,0,0.2);
  // box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius:0 5px 5px 0;
  cursor: pointer;
  :hover {
    //box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    border: 1px solid #3ba7ef;
  }
  `;

export const StyledCityText = styled.div`
  display: block;
  flex: 90%;
`;

export const StyledCityArrow = styled.div`
  flex: 10%;
  align-items: right;
`;

export const StyledCityName = styled.div`
  font-size: 1.5em;
`;

export const StyledCityDetails = styled.div`
  font-size: 1em;
  color: darkgrey;
`;

export const StyledError = styled.div`
  color: red;
`;

export const StyledErrorDescription = styled.div`
  font-size: 14px;
`;

const Error = ({error, url}) => (
  <StyledError>
    <StyledErrorDescription>{url}</StyledErrorDescription>
    <StyledErrorDescription>{error.message}</StyledErrorDescription>
  </StyledError>
);

class SelectCity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataUrl: null,
      city: null,
      isInactive: false,
      cities: ['Baguio City', 'Dagupan City']
    };
  }
  onCityChange = e => {
    // TODO: validate url
    // this.props.selectedCity = e;
    // dispatch
    this.props.onChangeCity(e);
    this.setState({
      city: e,
      dataUrl: 'http://127.0.0.1:8000/barangays/' + e + '/geo.json',
      isInactive: false
    });
  };

  onSelectCity = () => {
    const {selectedCity} = this.props;
    if (!selectedCity) {
      return;
    }
    // var dataUrl = 'http://127.0.0.1:8000/barangays/'+selectedCity+'/geo.json';
    var dataUrl =
      'http://127.0.0.1:8000/config/' + selectedCity + '/config.json';
    this.props.onSelectCity({dataUrl});
  };

  onSelect = e => {
    console.log(e);
    console.log('HERE');
    this.props.onChangeCity(e);
    // const {selectedCity} = this.props;
    // if (!selectedCity) {
    //   return;
    // }
    // var dataUrl = 'http://127.0.0.1:8000/barangays/'+selectedCity+'/geo.json';
    var dataUrl = 'http://127.0.0.1:8000/config/' + e + '/config.json';
    this.props.onSelectCity({dataUrl});
    console.log('HEKE');
  };

  render() {
    console.log('SELECT CITY');
    console.log(this.props);
    const {activeCities, selectedCity, onChangeCity} = this.props;
    return (
      <div>
        <InputForm>
          <StyledFromGroup>
            {activeCities.map(city => (
              <StyledCityButton onClick={() => this.onSelect(city.id)}>
                <StyledCityText>
                  <StyledCityName>{city.name}</StyledCityName>
                  <StyledCityDetails>as of March 18, 2019</StyledCityDetails>
                </StyledCityText>
                <StyledCityArrow>
                  <ArrowSvg />
                </StyledCityArrow>
              </StyledCityButton>
            ))}
            {/* <ItemSelector
              selectedItems={activeCities.find(op => op.id === selectedCity)}
              options={activeCities}
              multiSelect={false}
              searchable={false}
              onChange={e => onChangeCity(e)}
              getOptionValue={op => op.id}
              displayOption={op => op.name}
              placeholder="Select a city..."
            />
            
            <div style={{padding: '10px'}} />
            <Button onClick={this.onSelectCity} width="70px">
              Select
            </Button> */}
          </StyledFromGroup>
          {this.props.error && (
            <Error error={this.props.error} url={this.props.option.dataUrl} />
          )}
        </InputForm>
      </div>
    );
  }
}

SelectCity.propTypes = propTypes;

export default SelectCity;
