# Open modal

Build kepler.gl in a single index.html to be load into jupyter notebook

### Local dev
```sh
npm install
```
or
```sh
yarn --ignore-engines
```

add mapbox access token to node env
```sh
export MapboxAccessToken=<your_mapbox_token>
```

to Start the app
```sh
npm start
```

to Build. A single keplergl.html file will be put into `dist-workbench` folder

```sh
mkdir dist-workbench
npm run build-workbench
```


