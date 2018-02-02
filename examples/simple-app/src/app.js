import React, {Component} from 'react';
import {connect} from 'react-redux';
import window from 'global/window';
import KeplerGl, {updateVisData} from 'kepler.gl';

// Sample data
import sampleData from './data/sample-data';
import sampleTripData from './data/sample-trip-data';
import sampleHexIdCsv from './data/sample-hex-id-csv';
import sampleGeojson from './data/sample-geojson.json';

// Data processor
import {Processor} from 'kepler.gl';

class App extends Component {
  state = {
    width: window.innerWidth,
    height: 800
  };

  componentWillMount() {
    this._handleResize();
    window.addEventListener('resize', this._handleResize);
  }

  componentWillUnMount() {
    window.removeEventListener('resize', this._handleResize);
  }

  componentDidMount() {
    // load trip based data with config
    this.props.dispatch(
      updateVisData(
      // datasets
      {
        info: {
          label: 'Test Trip Data',
          id: 'test_trip_data'
        },
        data: sampleTripData
      },
      // option
      {},
      // config
      {
        filters: [
          {
            id: 'me',
            dataId: 'test_trip_data',
            name: 'tpep_pickup_datetime',
            type: 'timeRange',
            enlarged: true
          }
        ]
      })
    );

    // load point based data
    //this.props.dispatch(updateVisData(sampleData));

    // load data with h3 hex id
    this.props.dispatch(
      updateVisData({
        info: {
          label: 'Hexagon by Id',
          id: 'test_phone_data'
        },
        data: Processor.processCsvData(sampleHexIdCsv)
      })
    );

    // load geojson
    // this.props.dispatch(
    //   updateVisData({
    //     info: {label: 'SF Zip Geo'},
    //     data: Processor.processGeojson(sampleGeojson)
    //   })
    // );
  }

  _handleResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  render() {
    return (
      <div style={{position: 'absolute', width: '100%', height: '100%'}}>
        <KeplerGl
          id="kepler.gl"
          width={this.state.width}
          height={this.state.height}
        />
      </div>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
