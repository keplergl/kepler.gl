This is the source code of the demo website for kepler.gl.

## Developing

From the repository root, run `yarn start:web`, or run `yarn start` in this
folder after installing its dependencies. `yarn dev` is an alias for `yarn start`.
Set `MapboxAccessToken` to use Mapbox styles.

The website uses the same esbuild configuration for development and production.
Development copies static assets, watches JavaScript and Tailwind CSS, and serves
http://localhost:3003 with page reloads after rebuilds. Nested website routes fall
back to `index.html`.

`yarn start-prod` serves a minified production-mode website with watching enabled.
Like the production build, it requires the deployment environment variables
listed in `esbuild.config.mjs`. It is a local preview, not a deployment.

## Building

`yarn build` prepares the website and then builds and copies the separate
SQLRooms demo into `dist/demo-next`. Root `yarn deploy` uses this command.
`yarn esbuild` prepares only the main website; `yarn build-script` bundles it
without cleaning or copying static files.

The website dev server does not build the separate `/demo-next` application.
Use root `yarn start:sqlrooms` to develop that app. To validate its published
routes, build the complete website and use the test in
`test/demo-next.browser.cjs`.

Run `yarn test:build-config` in this folder for focused build/serve configuration
checks without launching servers or bundling the app.
