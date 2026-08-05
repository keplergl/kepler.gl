# Node/Express

This example shows how to embed Kepler.gl in a node/express application.

#### 1. Install

```sh
touch yarn.lock && yarn
```

> `touch yarn.lock` is needed the first time so Yarn treats this as a standalone project,
> independent from the kepler.gl monorepo.

#### 2. Mapbox Token

Add a Mapbox access token to your environment (optional — a MapLibre basemap is used by default):

```sh
export MapboxAccessToken=<your_mapbox_token>
```

#### 3. Start the app

```sh
yarn start
```
