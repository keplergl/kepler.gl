### 1. Configuring Mapbox API hostname
The KeplerGL component accepts an optional parameter `mapboxApiUrl` to override the default value of `https://api.mapbox.com`.

```js
  <KeplerGl
      id="foo"
      mapboxApiAccessToken={token}
      mapboxApiUrl={"https://api.mapbox.cn"}
      width={width}
      height={height}/>
```

### 2. Overriding the default MapStyles
The default MapStyles KeplerGL uses might not be accessible to you, in this case you will need to provide MapStyle overrides. During construction of your component:
```js
  this.token = '';
  this.apiHost = "https://api.mapbox.cn";
  this.mapStyles = [
    {
      id: 'dark',
      label: 'Dark Streets 9',
      url: 'mapbox://styles/mapbox/dark-v9',
      icon: `${this.apiHost}/styles/v1/mapbox/dark-v9/static/-122.3391,37.7922,9.19,0,0/400x300?access_token=${this.token}&logo=false&attribution=false`,
      layerGroups: [] // DEFAULT_LAYER_GROUPS
    },
    {
      id: 'light',
      label: 'Light Streets 9',
      url: 'mapbox://styles/mapbox/light-v9',
      icon: `${this.apiHost}/styles/v1/mapbox/light-v9/static/-122.3391,37.7922,9.19,0,0/400x300?access_token=${this.token}&logo=false&attribution=false`,
      layerGroups: [] // DEFAULT_LAYER_GROUPS
    }
  ];
```

and In render:
```js
  <KeplerGl
      id="foo"
      mapboxApiAccessToken={this.token}
      mapboxApiUrl={}
      mapStyles={this.mapStyles}
      width={width}
      height={height}/>
```
