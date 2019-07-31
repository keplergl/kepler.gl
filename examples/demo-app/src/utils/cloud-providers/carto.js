const name = 'carto';
import DropboxIcon from '../../components/icons/dropbox-icon';

const carto = {};

/**
 * This method will handle the oauth flow by performing the following steps:
 * - Opening a new window
 * - Subscribe to message channel
 * - Receive the token when ready
 * - Close the opened tab
 */
function handleLogin(onCloudLoginSuccess) {
  const scopes = ['user:profile', 'datasets', 'wadus'];
  const link = `https://carto.com/oauth2/authorize?client_id=${carto.client_id}&response_type=token&state=0&scopes=${scopes.join(' ')}&redirect_uri=https://localhost:8080/auth`;
  const authWindow = window.open(link, '_blank', 'width=1024,height=716');
  const handleToken = e => {
    // TODO: add security step to validate which domain the message is coming from
    authWindow.close();
    window.removeEventListener('message', handleToken);
    if (window.localStorage) {
      window.localStorage.setItem('carto.token', e.data.access_token);
      window.localStorage.setItem('carto.user_info_url', e.data.user_info_url)
    }
    onCloudLoginSuccess();
  };
  window.addEventListener('message', handleToken);
}

function setAuthToken (token) {
  carto.client_id = token;
}

function getAccessTokenFromLocation (location) {
  const params = new URLSearchParams(location.hash.substr(1))

  return {
    access_token: params.get('access_token'),
    user_info_url: params.get('user_info_url')
  };
}

// All cloud-providers providers must implement the following properties
export default {
  name,
  getAccessToken: () => console.log('getAccessToken'),
  getAccessTokenFromLocation,
  handleLogin,
  icon: DropboxIcon,
  setAuthToken,
  uploadFile: () => console.log('uploadFil')
};
