import React, {Component} from 'react';
import CartoHandler from '../../utils/cloud-providers/carto';
import CartoDataset from './carto-dataset';

export default class CartoDatasets extends Component {

  constructor(props) {
    super(props);

    this.state = {
      authToken: localStorage.getItem('carto.token'),
      userInfoUrl: localStorage.getItem('carto.user_info_url'),
      userInfo: null,
      datasets: [{
        name: 'world_borders'
      },{
        name: 'ne_50m_rivers_lake_centerlines'
      },{
        name: 'ne_10m_airports'
      }]
    };
  }

  componentWillMount() {
    this.fetchUserInfo();
  }

  componentDidUpdate() {
    // Fetch carto datasets
  }

  login = () => {
    CartoHandler.handleLogin(() => {
      const authToken = localStorage.getItem('carto.token');
      const userInfoUrl = localStorage.getItem('carto.user_info_url');

      this.setState({
        authToken
      });

      fetch(`${userInfoUrl}?api_key=${authToken}`)
        .then(response => response.json())
        .then(userInfo => {
          this.setState({
            userInfo
          });

          this.fetchUserInfo();
        })
    });
  }

  selectDataset = dataUrl => {
    this.props.onLoadRemoteMap({
      dataUrl
    });
  }

  fetchUserInfo() {
    if (!this.state.authToken || !this.state.userInfoUrl) {
      return;
    }

    const { authToken, userInfoUrl } = this.state;

    fetch(`${userInfoUrl}?api_key=${authToken}`)
      .then(response => response.json())
      .then(userInfo => {
        this.setState({
          userInfo
        });
      });
  }

  render() {
    if (!this.state.authToken) {
      return <button onClick={this.login}>Login with CARTO</button>;
    }

    if (this.state.datasets) {
      return this.state.datasets.map(
        (dataset) => <CartoDataset key={dataset.name} id={dataset.name} onClick={this.selectDataset} />
      );
    }

    if (this.state.userInfo) {
      return <pre>
        {JSON.stringify(this.state.userInfo)}
      </pre>
    }

    return 'Loading';
  }
}