# Demo App

This is the src code of kepler.gl demo app. You can copy this folder out and run it locally.

#### Pre requirement
- [Node.js ^18.x](http://nodejs.org): We use Node to generate the documentation, run a
  development web server, run tests, and generate distributable files. Depending on your system,
  you can install Node either from source or as a pre-packaged bundle.
- [Yarn 4.4.0](https://yarnpkg.com): We use Yarn to install our Node.js module dependencies
  (rather than using npm). See the detailed [installation instructions][yarn-install].

#### 1. Install Dependencies

Go to the root directory and install the dependencies using yarn:

```sh
yarn bootstrap
```

Then, go to the `examples/demo-app` directory and install the dependencies using yarn:

```sh
yarn install
```

#### 2. Environment Variables
Create a `.env` file at the root directory by copying from `.env.template`:

```sh
cp .env.template .env
```

Then update the following environment variables in your `.env` file:

```sh
MAPBOX_ACCESS_TOKEN=<your_mapbox_token>
DROPBOX_CLIENT_ID=<your_dropbox_client_id>
MAPBOX_EXPORT_TOKEN=<your_mapbox_export_token>
CARTO_CLIENT_ID=<your_carto_client_id>
FOURSQUARE_CLIENT_ID=<your_foursquare_client_id>
FOURSQUARE_DOMAIN=<your_foursquare_domain>
FOURSQUARE_USER_MAPS_URL=<your_foursquare_user_map_url>
```

#### 3. Start the app

```sh
yarn start:local
```

[yarn-install]: https://yarnpkg.com/getting-started/install
