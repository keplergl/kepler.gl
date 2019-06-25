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

import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import ColorPicker from './color-picker';
import ColorPalette from './color-palette';
import ColorTextInput from './color-text-input';

//to-do: left align color name and right align color swatch
const StyledCustomColorName = styled.span`
  float: left;
  padding: 3px;
`;

const StyledCustomColorSwatch = styled.div`
  float: right;
`;

const StyledColorRange = styled.div`
  padding: 6px 8px;
  margin-bottom: 8px;
  color: #6A7485;
  font-size: 11px;
`;

const defaultCustomPalette = ['#12939A','#FF991F','#DA70BF','#F6D18A','#829AE3']

class ColorPickerPane extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //to-do: update breaks to be based on selection
      colors: defaultCustomPalette
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e) => {
    e.preventDefault()
    this.setState({
      colors: ['#fff','#fff','#fff','#fff','#fff']
    });

  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }


  //to-do: allow colorpicker to update custom palette
  //to-do: allow user input of an arry of hex/rgba to update swatch and palette
  render() {
    return (
      <>
        <StyledColorRange>
          <ColorPalette colors={defaultCustomPalette}/>
          {this.state.colors.map(color =>
            <div key={color}>
              <span>{color.replace('\'','')} </span>
              <StyledCustomColorSwatch>
              <span>
                < ColorPicker color={"FFF"} key={color}
                  onChange={this.handleChange}/>
                </span>
                </StyledCustomColorSwatch>
            </div>)
          }
          <ColorTextInput />
        </StyledColorRange>

      </>
     );
  }
}

export default ColorPickerPane;


