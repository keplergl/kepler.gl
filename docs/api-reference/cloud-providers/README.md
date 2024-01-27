# Cloud Providers

The kepler.gl application does not have a backend, however it offers integration point for optional commercial backends. Each backend can integrate with kepler by adding a "cloud provider" object to kepler's global list of cloud providers.

These objects must implement certain minimal set of methods, and can optionally immplement others, depending on the capability of the backend.

The set of methods available for cloud providers to implement is subject to change as new features are added to the front-end.


## Cloud Provider Object

A "cloud provider" object provides:
- a name and an icon
- any service specific methods (such as `uploadFile`)
- a set of oauth2 methods to plug into the authentication flow and get access tokens

Cloud-providers providers can implement the following properties

| Field/method | Description | Required? |
| --- | --- | --- |
| `name` | Name of the provider | required |
| `displayName` | Display name |
| `icon` | React Element to render as Icon |
| `thumbnail` | Size of the thumbnail image of the map that required by the provider |
| `hasPrivateStorage` | To participate in kepler's build-in private map saving function | required |
| `hasSharingUrl` | To participate in kepler's build-in share map via URL function | required |
| `getShareUrl` | To show user the shared Url of the map |
| `getMapUrl` | To update browser location once a map has been saved / loaded |
| `getAccessToken` | To participate in kepler's built-in oauth login routes |
| `getUserName` | To display user name of the logged in user |
| `login` | Method called to perform user login | required |
| `logout` | Method called to logout an user | required |
| `uploadMap` | Method called to upload map to storage | required |
| `listMaps` | Method called to load a catalog of maps saved by the current user | required |
| `downloadMap` | MEthod called to download a specific map | required |


## Adding a new Cloud Provider

An instance of the provider is added to array of cloud providers in the file `src/cloud-providers/providers.js` then passed to kepler.gl demo app. An example provider: [Dropbox Provider](https://github.com/keplergl/kepler.gl/blob/master/examples/demo-app/src/cloud-providers/dropbox-provider.js)

```js
import {Provider} from 'kepler.gl/cloud-providers';

class MyProvider extends Provider {
    constructor() {
        this.name = 'foo';
        this.displayName = 'My Provider';
    }

    // ... other required methods below
}

const myProvider = new MyProvider();
const App = () =>
    <KeplerGl
        mapboxApiAccessToken={CLOUD_PROVIDERS_CONFIGURATION.MAPBOX_TOKEN}
        id="map"
        cloudProviders={[myProvider]}
    />
```


## Cloud Provider Instance Fields and Methods

See [Cloud Provider API](./cloud-provider.md)
