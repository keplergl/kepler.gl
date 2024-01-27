# Custom Theme

You can pass theme name or object used to customize Kepler.gl style. Kepler.gl provide an `'light'` theme besides the default 'dark' theme. When pass in a theme object Kepler.gl will use the value passed as input to overwrite values from [theme](https://github.com/keplergl/kepler.gl/blob/master/src/styles/src/base.ts).


```js
import KeplerGl from 'kepler.gl';

const Map = props => (
  <KeplerGl
    id="foo"
    width={width}
    mapboxApiAccessToken={token}
    height={height}
    theme="light"
  />
);
```

### Available Themes
| theme | |
| ------- | ------- |
| `dark` (default) | ![Screen Shot 2020-03-11 at 2 11 45 PM](https://user-images.githubusercontent.com/3605556/76464370-78c13080-63a2-11ea-977e-9678a25580f9.png) |
| `light`  | ![Screen Shot 2020-03-11 at 2 10 15 PM](https://user-images.githubusercontent.com/3605556/76464360-74951300-63a2-11ea-82fe-3d055dc0b8dd.png)  |
| `base`  | ![Screen Shot 2020-03-11 at 2 10 49 PM](https://user-images.githubusercontent.com/3605556/76464366-78289a00-63a2-11ea-944b-e5a9208bacde.png) |
