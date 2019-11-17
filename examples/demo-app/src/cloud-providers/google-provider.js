/* global window, gapi */
import {loadScript} from '../utils/load-script';

// We load `gapi` at run-time from this URL
const GOOGLE_API_URL = 'https://apis.google.com/js/api.js';

export default class GoogleProvider {
  // Create a new Google Account provider
  // To access Google Drive, specify it in scopes
  // @param scopes = ['https://www.googleapis.com/auth/drive'];
  constructor({clientId, appKey, name, appName, icon, discoveryDocs, scopes = []}) {
    // All cloud-providers providers must implement the following properties
    this.appName = appName;
    this.name = name;
    this.icon = icon;

    this._gapiInitializationOptions = {clientId, appKey, discoveryDocs, scopes};
    this._clearUserData();
  }

  /**
   * This method will handle the oauth flow by performing the following steps:
   * - Opening a popup window and letting the user select google account
   * - If already signed in to the browser, the window will disappear immediately
   * @returns {Promise<void>}
   */
  async login(onCloudLoginSuccess) {
    await this._initializeGoogleApi();

    // NOTE: We are not using async/await syntax here because:
    // - babel's "heavy-handed" transpilation of `async/await` moves this code into a callback
    // - but it needs to run directly in the `onClick` handler since it opens a popup
    // - and popups that are not a direct result of the user's actions are typically blocked by browser settings.
    return gapi.auth2.getAuthInstance().signIn().then(googleUser => {
      this._getUserData(googleUser);
      this._onLoginStatusChange();
      onCloudLoginSuccess(this.name);
    }).catch (error => {
      console.error('GOOGLE API LOGIN ERROR', error); // eslint-disable-line
    });
  }

  /**
   * Provides the current auth token.
   * @returns {any}
   */
  getAccessToken() {
    const token = this.accessToken;
    return (token || '') !== '' ? token : null;
  }

  // FOR DERIVED CLASSES

  _onLoginStatusChange(googleUser) {
    // Redefine in subclass
  }
  
  // PRIVATE

  // Initialize the Google API (gapi) by loading it dynamically and initializing with appropriate scope
  // TODO
  // gapi could potentially be initialized by other parts of kepler (in particular, by other cloud providers)
  // To fully handle that case we would likely need to use the advanced gapi authentication API,
  // as the recommended API we use here only supports one sign-in.
  async _initializeGoogleApi() {
    // Check if already initialized
    if (window.gapi) {
      return;
    }

    const {clientId, appKey, discoveryDocs, scopes} = this._gapiInitializationOptions;

    await loadScript(GOOGLE_API_URL);

    // gapi.load is supposed return a thenable object, but await does not seem to work on it so wrap in Promise instead
    await new Promise(resolve => gapi.load('client', resolve));

    // Initialize the JavaScript client library.
    // TODO - https://stackoverflow.com/questions/15657983/popup-blocking-the-gdrive-authorization-in-chrome

    const gapiOptions = {
      discoveryDocs,
      scope: scopes.join(" "),
      fetch_basic_profile: true,
      immediate: false
    };
    if (clientId) {
      gapiOptions.client_id = clientId;
    }
    if (appKey) {
      gapiOptions.appKey = appKey;
    }
    await gapi.client.init(gapiOptions);

    // For APIKEY, no authinstance is provided
    const authInstance = gapi.auth2.getAuthInstance();
    if (!authInstance) {
      return;
    }

    // LISTEN FOR LOGIN
    authInstance.isSignedIn.listen(isSignedIn => {
      if (isSignedIn) {
        // NOTE: This is only triggered on fresh login. I.e. signIn() does not trigger this if browser already logged in
        console.log('GOOGLE API LOGIN DETECTED'); // eslint-disable-line
      } else {
        console.log('GOOGLE API LOGOUT DETECTED');// eslint-disable-line
        this._clearUserData();
        this._onLoginChange(null);
      }

      // Update derived classes
      this._onLoginStatusChange();
      // TODO - also needs a callback to update the app UI...
    });
  }

  // Extract a minimum of user data from the GoogleUser object
  _getUserData(googleUser) {
    const userProfile = googleUser.getBasicProfile();
    this.email = userProfile.getEmail();
    this.domain = googleUser.getHostedDomain();
    this.imageUrl = userProfile.getImageUrl();

    this.scopes = googleUser.getGrantedScopes().split(' ');

    const authResponse = googleUser.getAuthResponse(true);
    this.accessToken = authResponse.access_token;
    this.idToken = authResponse.id_token;
  }

  // Clear user data
  _clearUserData() {
    this.signedIn = false;
    this.email = null;
    this.domain = null;
    this.imageUrl = null;
    this.scopes = [];
    this.accessToken = null;
    this.idToken = null;
  }
}
