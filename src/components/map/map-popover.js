/** @jsx createElement */
import createElement from 'react-stylematic';
import {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import window from 'global/window';

import {Pin} from '../common/icons';
import {FIELD_DISPLAY_FORMAT} from '../../constants/default-settings';
import {mapPopover} from '../../styles/styles';

const MAX_WIDTH = 400;
const MAX_HEIGHT = 600;

const propTypes = {
  fields: PropTypes.array,
  fieldsToShow: PropTypes.array,
  isVisible: PropTypes.bool,
  layer: PropTypes.object,
  data: PropTypes.oneOfType([
    PropTypes.array, PropTypes.object
  ]),
  freezed: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number,
  onClose: PropTypes.func
};

export default class MapPopover extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isMouseOver: false,
      width: 380,
      height: 160
    };
  }

  componentDidMount() {
    this._setContainerSize();
  }

  componentDidUpdate() {
    this._setContainerSize();
  }

  _setContainerSize() {
    const node = this.refs.popover;
    if (!node) {
      return;
    }

    const width = Math.min(node.scrollWidth, MAX_WIDTH);
    const height = Math.min(node.scrollHeight, MAX_HEIGHT);

    if (width !== this.state.width || height !== this.state.height) {
      this.setState({width, height});
    }
  }

  _getPosition(x, y) {
    const topOffset = 30;
    const leftOffset = 30;
    const {width, height} = this.state;
    const pos = {
      maxWidth: width
    };

    if (x + leftOffset + width > window.innerWidth) {
      pos.right = window.innerWidth - x + leftOffset;
    } else {
      pos.left = x + leftOffset;
    }

    if (y + topOffset + height > window.innerHeight) {
      pos.bottom = 10;
    } else {
      pos.top = y + topOffset;
    }

    return pos;
  }

  render() {
    const {x, y, isVisible, data, layer, freezed, fields, fieldsToShow = []} = this.props;
    const hidden = (!isVisible && !this.state.isMouseOver);

    if (!data || !layer || !fieldsToShow.length) {
      return null;
    }

    const infoProps = {data, layer, fieldsToShow, fields};

    const style = Number.isFinite(x) && Number.isFinite(y) ?
      this._getPosition(x, y) : {};

    return (
      <div ref="popover" className={classnames({hidden})}
        style={{...mapPopover, ...style}}
        onMouseEnter={() => {
          this.setState({isMouseOver: true});
        }}
        onMouseLeave={() => {
          this.setState({isMouseOver: false});
        }}>
        {freezed ?
          (<div>
            <div className="gutter"/>
            <div className="popover-pin" onClick={this.props.onClose}>
              <Pin size={30}/>
            </div>
          </div>)
         : null}
        <table className="popover-table">
          {layer.isAggregated ?
            <CellInfo {...infoProps}/> :
            <EntryInfo {...infoProps}/>}
        </table>
      </div>
    );
  }
}

const Row = ({name, value, url}) => {
  // Set 'url' to 'value' if it looks like a url
  if (!url && value && typeof value === 'string' && value.match(/^http/)) {
    url = value;
  }

  const asImg = (/<img>/).test(name);
  return (
    <tr key={name}>
      <td>{name}</td>
      <td>
        { asImg ? <img src={value}/> :
          url ? <a target="_blank" href={url}>{value}</a> :
            value
        }
      </td>
    </tr>
  );
};

const EntryInfo = ({fieldsToShow, fields, data}) => (
    <tbody>
      {fieldsToShow.map(name => <EntryInfoRow
        key={name}
        name={name}
        fields={fields}
        data={data}
      />)}
    </tbody>
);

const EntryInfoRow = ({name, fields, data}) => {
  const field = fields.find(f => f.name === name);
  if (!field) {
    return null;
  }

  const valueIdx = field.tableFieldIndex - 1;
  const format = _getCellFormat(field.type);

  return (
    <Row
      name={name}
      value={format ? format(data[valueIdx]) : data[valueIdx]}
    />
  );
};

const CellInfo = ({data, layer}) => {
  const {colorField, sizeField} = layer.config;
  const {colorAggregation, sizeAggregation} = layer.config.visConfig;

  return (
    <tbody>
      <Row
        name={'total points'}
        key="count"
        value={data.points.length}
      />
      {colorField ? <Row
        name={`${colorAggregation} ${colorField.name}`}
        key="color"
        value={data.colorValue || 'N/A'}
      /> : null}
      {sizeField ? <Row
        name={`${sizeAggregation} ${sizeField.name}`}
        key="size"
        value={data.elevationValue || 'N/A'}
      /> : null}
    </tbody>
  );
};

function _getCellFormat(type) {
  return FIELD_DISPLAY_FORMAT[type];
}

MapPopover.propTypes = propTypes;
