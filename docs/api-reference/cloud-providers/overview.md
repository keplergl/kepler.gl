# Cloud Providers

The kepler.gl application does not have a backend, however it offers integration point for optional commercial backends. Each backend can integrate with kepler by adding a "cloud provider" object to kepler's global list of cloud providers.

These objects must implement certain minimal set of methods, and can optionally immplement others, depending on the capability of the backend.

The set of methods available for cloud providers to implement is subject to change as new features are added to the front-end.


## Cloud Provider Object

A "cloud provider" object provides:
- a name and an icon
- any service specific methods (such as `uploadFile`)
- a set of oauth2 methods to plug into the authentication flow and get access tokens

Cloud-providers providers implement the following properties

| Field/method | Description |
| --- | --- |
| `name` | |
| `icon` | |
| `login` | |
| `uploadFile` | |
| `getAccessToken` | To participate in kepler's built-in oauth login routes |
| `getAccessTokenFromLocation` | To participate in kepler's built-in oauth login routes |
| `hasPrivateStorage` | To participate in kepler's build-in map saving function |
| `hasSharingUrl` | To participate in kepler's build-in share map via URL function |

## Adding a new Cloud Provider

An instance of the provider is added to array of cloud providers in the file `src/cloud-providers/providers.js`

## Cloud Provider Instance Fields and Methods

## name : String

The UI name of the provider

## icon : ReactElement

This should be a React SVG icon for the provider

## hasPrivateStorage() : Boolean

Whether the provider has private backend to store maps. If any provider supports private storage, The cloud storage icon in side panel will be shown.

## hasSharingUrl() : Boolean

Whether the provider supports share map with an URL. If any provider supports this feature, The share map url icon option will be shown as an option in the share map dropdown.

## Methods

### login()

### upload({})

### getAccessToken

This lets the provider participate in kepler's built-in oauth flow.

Can be ignored for providers that implement or use libraries that implement custom login flows (e.g signin using Google gapi).

### getAccessTokenFromLocation

This lets the provider participate in kepler's built-in oauth flow.

Can be ignored for providers that implement or use libraries that implement custom login flows (e.g signin using Google gapi).

