import React from 'react';
import styled from 'styled-components';
import {event, select} from 'd3-selection';
import {brushX} from 'd3-brush';

const propTypes = {
  domain: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
  onBrush: React.PropTypes.func.isRequired,
  range: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
  value: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
  width: React.PropTypes.number.isRequired
};

const StyledG = styled.g`
  .selection {
    stroke: none;
    fill: ${props => props.theme.rangeBrushBgd};
    opacity: 1;
  }
`;
export default class RangeBrush extends React.Component {
  componentDidMount() {
    const {range: [min, max], value: [val0, val1]} = this.props;
    // We want the React app to respond to brush state and vice-versa
    // but d3-brush fires the same events for both user-initiated brushing
    // and programmatic brushing (brush.move). We need these flags to
    // distinguish between the uses.
    //
    // We don't use state because that would trigger another `componentDidUpate`
    this.brushing = false;
    this.moving = false;

    this.root = select(this.rootContainer);
    this.brush = brushX()
      .on('start', () => {
        this.brushing = true;
      })
      .on('brush', () => {
        if (this.moving) {
          return;
        }

        event.selection === null ? this._reset() : this._brush(event.selection);
      })
      .on('end', () => {
        if (!this.moving && event.selection === null) {
          this._reset();
        }

        this.brushing = false;
        this.moving = false;
      });

    this.root.call(this.brush);

    if (val0 === min && val1 === max) {
      this._reset();
    }
  }

  componentDidUpdate(prevProps) {
    const {range: [min, max], value: [val0, val1], width} = this.props;
    const [prevVal0, prevVal1] = prevProps.value;

    if (prevProps.width !== width) {
      this.root.call(this.brush);
      this._move(val0, val1);
    }

    if (!this.brushing && !this.moving) {
      if (val0 === min && val1 === max) {
        this.moving = true;
        this.brush.move(this.root, null);
      }

      if (prevVal0 !== val0 || prevVal1 !== val1) {
        this.moving = true;
        this._move(val0, val1);
      }
    }
  }

  _reset() {
    const [minValue, maxValue] = this.props.range;
    this.props.onBrush(minValue, maxValue);
  }

  _move(val0, val1) {
    const {domain: [min, max], width} = this.props;
    const scale = x => (x - min) * width / (max - min);
    this.brush.move(this.root, [scale(val0), scale(val1)]);
  }

  _brush([sel0, sel1]) {
    const {domain: [min, max], onBrush, width} = this.props;
    const invert = x => x * (max - min) / width + min;
    onBrush(invert(sel0), invert(sel1));
  }

  render() {
    return <StyledG className="kg-range-slider__brush"
                    innerRef={comp => {
      this.rootContainer = comp;
    }}/>;
  }
}

RangeBrush.displayName = 'RangeBrush';
RangeBrush.propTypes = propTypes;
