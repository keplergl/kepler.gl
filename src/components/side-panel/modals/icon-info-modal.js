import React, {Component} from 'react';
import {svgIcons as SvgIcons} from 'keplergl-layers/icon-layer/svg-icons.json';

export default class IconInfoModal extends Component {

  _renderUberIcon(id) {
    return (
      <i className={ `icon icon_${id}
      soft-micro--sides soft-micro--top float--left epsilon` }/>
    );
  }

  _renderCustomIcon(id) {
    return (
      <img style={{width: 20, height: 20}}src={`svgs/${id}.svg`}/>
    );
  }

  _renderIconItem({id, type}) {
    return (
      <div
        key={id}
        className="layout__item palm-one-whole one-third
        soft-tiny--right push-tiny--bottom">
        <div className="panel soft-tiny clearfix small">
          { type === 'uber' ? this._renderUberIcon(id) :
            this._renderCustomIcon(id) }
          <div className="panel panel--secondary soft-tiny--sides float--right">
            <code>{ id }</code>
          </div>
        </div>
      </div>
    );
  }

  _renderExampleTable() {
    return (
      <table className="table--bordered table--no-hover
      table--striped table--data table--small">
        <thead>
        <tr>
          <th>point_lat</th>
          <th>point_lng</th>
          <th className="text-orange">icon</th>
          <th>event</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>37.769897</td>
          <td>-122.41168</td>
          <td className="text-orange">android</td>
          <td>Trip requested</td>
        </tr>
        <tr>
          <td>37.806928</td>
          <td>-122.40218</td>
          <td></td>
          <td>Enroute</td>
        </tr>
        <tr>
          <td>37.778564</td>
          <td>-122.39096</td>
          <td className="text-orange">calendar</td>
          <td>Trip begin</td>
        </tr>
        <tr>
          <td>37.745995</td>
          <td>-122.30220</td>
          <td></td>
          <td>On trip</td>
        </tr>
        <tr>
          <td>37.329841</td>
          <td>-122.103847</td>
          <td className="text-orange">control-off</td>
          <td>Trip ended</td>
        </tr>
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div className="push-small--top">
        <div className="push-small--bottom">
          <h3>How to draw icons</h3>
          <span>In your csv, create a column, put the name of the icon you want
            to draw in it. You can leave the cell empty if you do not want the
            icon to show for some points. When the column is named </span>
            <div className="panel panel--secondary soft-micro--sides
            display--inline-block">
              <code>icon</code>
            </div>
          <span> Voyager will automatically create a icon layer for you.</span>
        </div>
        <div className="push-small--bottom">
          <h4>Example:</h4>
          { this._renderExampleTable() }
        </div>
        <div className="push-small--bottom">
          <h4>All Available Icons</h4>
          <span>Want to add more icons? send an email to </span>
          <span className="text-uber-blue-120">shan@uber.com</span>
          <div className="layout layout--flush push-tiny--top">
            { SvgIcons.map(this._renderIconItem) }
          </div>
        </div>
      </div>
    );
  }
}
