# Custom Map Style

![map layers](https://studio-public-data.foursquare.com/statics/keplergl/documentation/f-map-styles-8.jpg 'custom map style')

Demo showing how to use kepler.gl with basemap services other than Mapbox.

Read more about [Custom Map Style][custom-map-styles].

## Pre-requirements

- [Node.js ^20.x](http://nodejs.org)
- [Yarn 4.4.0](https://yarnpkg.com): See the [installation instructions][yarn-install].

## 1. Install Dependencies

Go to the `examples/custom-map-style` directory and run:

```sh
touch yarn.lock && yarn
```

> `touch yarn.lock` is required once to mark this directory as a standalone Yarn project,
> independent of the monorepo root.

## 2. Start the App

```sh
yarn start
```

The app will be available at [http://localhost:8080](http://localhost:8080).

## Production Build

```sh
yarn build
```

The output will be in the `dist/` directory.

[custom-map-styles]: https://docs.kepler.gl/docs/api-reference/advanced-usages/custom-map-styles
[yarn-install]: https://yarnpkg.com/getting-started/install
