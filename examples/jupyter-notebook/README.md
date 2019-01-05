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

start the app
```sh
npm start
```

build a single keplergl.html file inside `dist-workbench` folder

```sh
mkdir dist-workbench
npm run build-workbench
```


