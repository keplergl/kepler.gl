import React, {Component} from 'react';
import CartoHandler from '../../utils/cloud-providers/carto';

export default class CartoDatasets extends Component {

  constructor(props) {
    super(props);

    this.state = {
      authToken: localStorage.getItem('carto.token'),
      userInfo: localStorage.getItem('carto.user_info_url'),
      datasets: null
    };
  }

  componentWillMount() {
    if (this.state.authToken) {
      // Fetch carto datasets
    }
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
        })
    });
  }

  render() {
    if (!this.state.authToken) {
      return <button onClick={this.login}>Login with CARTO</button>;
    }

    if (this.state.datasets) {
      return this.datasets.map((dataset) => <span>{dataset.name}</span>);
    }

    if (this.state.userInfo) {
      return <pre>
        {JSON.stringify(this.state.userInfo)}
      </pre>
    }

    return 'Loading';
  }
}