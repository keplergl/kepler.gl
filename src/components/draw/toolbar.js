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

// TODO: delete this file

import React, { PureComponent } from 'react';
import styled from 'styled-components';
import {EditorModes} from 'react-map-gl-draw';

const MODES = [
  { id: EditorModes.EDIT_VERTEX, text: 'Select Feature', icon: 'icon-select.svg' },
  { id: EditorModes.DRAW_POINT, text: 'Draw Point', icon: 'icon-point.svg' },
  { id: EditorModes.DRAW_PATH, text: 'Draw Polyline', icon: 'icon-path.svg' },
  { id: EditorModes.DRAW_POLYGON, text: 'Draw DrawPolygon', icon: 'icon-polygon.svg' },
  { id: EditorModes.DRAW_RECTANGLE, text: 'Draw Rectangle', icon: 'icon-rectangle.svg' }
];

const Container = styled.div`
  position: absolute;
  width: 48px;
  right: 24px;
  top: 200px;
  background: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
  outline: none;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Row = styled.div`
  height: 34px;
  padding: 7px;
  display: flex;
  justify-content: left;
  color: ${props => (props.selected ? '#ffffff' : 'inherit')};
  background: ${props => (props.selected ? '#0071bc' : props.hovered ? '#e6e6e6' : 'inherit')};
`;

const Img = styled.img`
  width: inherit;
  height: inherit;
`;

const Tooltip = styled.div`
  position: absolute;
  left: 52px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  min-width: 100px;
  max-width: 300px;
  height: 24px;
  font-size: 12px;
  z-index: 9;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Delete = styled(Row)`
  &:hover {
    background: ${props => (props.selected ? '#0071bc' : '#e6e6e6')};
  }
  &:active {
    background: ${props => (props.selected ? '#0071bc' : 'inherit')};
  }
`;

export default class Toolbar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      deleting: false,
      hoveredId: null
    };
  }

  // todo: replace
  _onHover = evt => {
    this.setState({hoveredId: evt && evt.target.id});
  };

  render() {
    const {selectedMode} = this.props;
    const {hoveredId} = this.state;

    return (
      <Container>
        {MODES.map(m => {
          return (
            <Row
              onClick={this.props.onSwitchMode}
              onMouseOver={this._onHover}
              onMouseOut={_ => this._onHover(null)}
              selected={m.id === selectedMode}
              hovered={m.id === hoveredId}
              key={m.id}
              id={m.id}
            >
              <Img id={m.id} onMouseOver={this._onHover} src={m.icon} />
              {hoveredId === m.id && <Tooltip>{m.text}</Tooltip>}
            </Row>
          );
        })}
        {/*<Delete*/}
          {/*selected={this.state.deleting}*/}
          {/*onClick={this._onDelete}*/}
          {/*onMouseOver={this._onHover}*/}
          {/*onMouseOut={_ => this._onHover(null)}*/}
        {/*>*/}
          {/*<Img*/}
            {/*id={'delete'}*/}
            {/*onMouseOver={this._onHover}*/}
            {/*onClick={this._onDelete}*/}
            {/*src={'icon-delete.svg'}*/}
          {/*/>*/}
          {/*{hoveredId === 'delete' && <Tooltip>{'Delete'}</Tooltip>}*/}
        {/*</Delete>*/}
      </Container>
    );
  }
}
