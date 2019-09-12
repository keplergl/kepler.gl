# Demo App

This is the src code of kepler.gl demo app. You can copy this folder out and run it locally.

#### 1. Install

```sh
npm install
```

or

```sh
yarn --ignore-engines
```


#### 2. Mapbox Token
add mapbox access token to node env

```sh
export MapboxAccessToken=<your_mapbox_token>
```

#### 3. Extra Feature
##### 3.1 Provide a default mapbox token when users export map as HTML 

In order to provide a default mapbox token for html map export functionality do the following

```sh
export MapboxExportToken=<your_export_token>
```

##### 3.2 Enable Dropbox integration
In order to enable Dropbox map storing do the following

```sh
export DropboxClientId=<your_dropbox_id>
```

#### 3. Start the app

```sh
npm start
```


