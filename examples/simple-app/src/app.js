import React, {Component} from 'react';
import {connect} from 'react-redux';
import window from 'global/window';
import KeplerGl, {KeplerGlSchema, Processor, updateVisDataAndConfiguration, updateVisData} from 'kepler.gl';

// Sample data
import sampleData from './data/sample-data';
import sampleTripData from './data/sample-trip-data';
import sampleHexIdCsv from './data/sample-hex-id-csv';
import sampleGeojson from './data/sample-geojson.json';
import jsonTripData from './data/json-sample-trip-data';

// configurations
import pointPlotConfiguration from './configurations/point-plot';

// helper
const overrideDataId = (configuration, datasetId) => {
  configuration.appConfig.config.visState.filters =
    configuration.appConfig.config.visState.filters.map(filter => ({
      ...filter,
      dataId: datasetId
    }));
  configuration.appConfig.config.visState.layers =
    configuration.appConfig.config.visState.layers.map(layer => ({
      ...layer,
      config: {
        ...layer.config,
        dataId: datasetId
      }
    }));

  return configuration;
};

/**
 * TODO: we need to decide if we should define this helpers within kepler.gl module or not
 * @param data
 * @param configuration
 * @returns {{datasets: {info: {id: string}, data: *}, parsedConfig: Object}}
 */
const migrateDataAndConfiguration = (data, configuration) => {
  // this is a mocked dataset. Kepler.gl requires at least one dataset to bind layers against
  // mapbuilder
  const dataId = 'test_this_one';
  const config = overrideDataId(configuration, dataId);

  // call out this in the documentation
  const parsedConfig = KeplerGlSchema.parseSavedConfig(config.appConfig);
  //
  const jsonData = Processor.processRowObject(data);

  // pass this structure to keplergl
  const newData = {
    info: {
      id: dataId
    },
    data: jsonData
  };

  return {datasets: newData, parsedConfig};
};

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

    // this._loadConfig();
  }

  /**
   * Loads an existing configuration from disk
   * @private
   */
  _loadConfig() {
    const {datasets, parsedConfig} = migrateDataAndConfiguration(jsonTripData, pointPlotConfiguration);
    const {dispatch} = this.props;

    if (parsedConfig) {
      dispatch(updateVisDataAndConfiguration({datasets, appConfig: parsedConfig}));
    }
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
          // create default prop for getAddress
        />
      </div>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
