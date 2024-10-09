# Demo App

This is the src code of kepler.gl demo app. You can copy this folder out and run it locally.

#### Pre requirement
- [Node.js ^18.x](http://nodejs.org): We use Node to generate the documentation, run a
  development web server, run tests, and generate distributable files. Depending on your system,
  you can install Node either from source or as a pre-packaged bundle.
- [Yarn 4.4.0](https://yarnpkg.com): We use Yarn to install our Node.js module dependencies
  (rather than using npm). See the detailed [installation instructions][yarn-install].

#### 1. Install Dependencies

```sh
yarn install
```


#### 2. Mapbox Token and Cloud storage client id
A collection of enviroment variables to pass mapbox tokens, and client ids for the cloud storages

```sh
export MapboxAccessToken=<your_mapbox_token>
export DropboxClientId=<your_dropbox_client_id>
export MapboxExportToken=<your_mapbox_export_token>
export CartoClientId=<your_carto_client_id>
export FoursquareClientId=<your_foursquare_client_id>
export FoursquareDomain=<your_foursquare_domain>
export FoursquareUserMapsURL=<your_foursquare_user_map_url>

```

#### 3. Start the app

```sh
yarn start
```

[yarn-install]: https://yarnpkg.com/getting-started/install