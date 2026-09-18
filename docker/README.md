# Docker Setup for kepler.gl Demo App

Two Dockerfiles are provided:

- **Dockerfile** — production multi-stage build. Compiles the demo-app to static files and serves with `serve`. Tokens and other deploy-specific settings are injected at **runtime** via `/config.json` and/or `KEPLER_*` env vars (not baked into the image).
- **Dockerfile.dev** — development build with esbuild watch mode inside the container.

## Prerequisites

1. [Docker](https://docs.docker.com/get-docker/) installed and running
2. For local prod Compose with env overrides, create a `.env` file at the repository root (copy from `.env.template`):

```bash
cp .env.template .env
```

Fill in at least `MapboxAccessToken` if you want Mapbox basemaps. MapLibre/Carto defaults work without a token.

## Runtime configuration

The production image reads `/config.json` from the static root (`/app/dist/config.json`). Copy the minimal starter and fill in only what you need (empty credential strings are ignored):

```bash
cp docker/config.example.json docker/config.json
```

`docker/config.full-example.json` lists every supported key. Use it as a reference — do not mount it as-is (`mapUrl` boots a sample map, and `mapStyle.mapStyles` replaces the built-in basemap list).

Mount it when running (uncomment the `volumes` block in `docker-compose.yml` after creating the file). Pick **one** of these patterns — do not combine a read-only mount with `KEPLER_*` overrides (the entrypoint must write the merged file, and the container **exits** if that write fails). Without `KEPLER_*` overrides there is nothing to write, so a read-only root filesystem still starts and serves with build-time defaults:

```yaml
# A) Config file only (read-only is fine)
volumes:
  - ./config.json:/app/dist/config.json:ro

# B) Config file + KEPLER_* env overrides (read-write mount required)
volumes:
  - ./config.json:/app/dist/config.json
environment:
  KEPLER_MAPBOX_ACCESS_TOKEN: ${MapboxAccessToken}

# C) Env only — no volume; entrypoint writes /app/dist/config.json inside the container
environment:
  KEPLER_MAPBOX_ACCESS_TOKEN: ${MapboxAccessToken}
  KEPLER_PAGE_TITLE: My Kepler
```

Supported `KEPLER_*` env vars (used in patterns B and C):

| Env var | Config path |
| --- | --- |
| `KEPLER_MAPBOX_ACCESS_TOKEN` | `credentials.MapboxAccessToken` |
| `KEPLER_MAPBOX_EXPORT_TOKEN` | `credentials.MapboxExportToken` |
| `KEPLER_DROPBOX_CLIENT_ID` | `credentials.DropboxClientId` |
| `KEPLER_CARTO_CLIENT_ID` | `credentials.CartoClientId` |
| `KEPLER_FOURSQUARE_CLIENT_ID` | `credentials.FoursquareClientId` |
| `KEPLER_FOURSQUARE_DOMAIN` | `credentials.FoursquareDomain` |
| `KEPLER_FOURSQUARE_API_URL` | `credentials.FoursquareAPIURL` |
| `KEPLER_FOURSQUARE_USER_MAPS_URL` | `credentials.FoursquareUserMapsURL` |
| `KEPLER_GOOGLE_DRIVE_CLIENT_ID` | `credentials.GoogleDriveClientId` |
| `KEPLER_MAP_CONFIG_URL` | `mapConfigUrl` |
| `KEPLER_MAP_URL` | `mapUrl` |
| `KEPLER_PAGE_TITLE` | `pageTitle` |
| `KEPLER_CONFIG_HREF` | Browser fetch URL for `config.json` (injected into `index.html`) |

The browser requests `/config.json` by default (origin root — same as GHCR, kepler.gl.com, and this image on port 8080). SPA routes like `/demo/:id` still hit that origin-root file, so the default needs no env. Set `KEPLER_CONFIG_HREF` only to read the config from somewhere else, for example `KEPLER_CONFIG_HREF=/shared/kepler-config.json` or an absolute URL on another host (CORS applies).

Serving the app itself at a browser-visible sub-path such as `https://host/kepler/` is **not supported**: `index.html` loads `/bundle.js` and `/bundle.css` from the origin root, the router declares its routes at `/`, `/auth`, and `/demo…` with no `basename`, and `loadSample` pushes `/demo/<id>`. A prefixed pathname therefore matches no route and renders an empty page. `KEPLER_CONFIG_HREF` relocates the config request only — it does not add sub-path support. Serve the app at the origin root; a reverse proxy in front is fine as long as it maps those root paths.

`mapConfigUrl` / `KEPLER_MAP_CONFIG_URL` replaces only the sample-gallery catalogue (`samples.json`). It does not rewrite compile-time `DATA_URL` or `ASSETS_URL`. Each catalogue row must use absolute `dataUrl`, `configUrl`, `imageUrl` (and `keplergl` / `remoteDatasetConfigUrl` when present) — the app does not prefix those paths. `ASSETS_URL` is only the "Try sample data" tab thumbnail CDN. A fully self-hosted gallery works by pointing `mapConfigUrl` at your own catalogue; see `docker/samples.example.json`.

See `docker/config.full-example.json` for every key supported today (credentials, `pageTitle`, `mapConfigUrl`, `mapUrl`, reducer `mapStyle`, KeplerGl `mapStyles` / `mapStylesReplaceDefault`, and serializable `applicationConfig` fields).

Not JSON-configurable (need a source build): `plugins`, `table`, `database`, `baseMapLibraryConfig` (functions). Map style `layerGroups[].filter` callbacks also cannot be expressed in JSON.

## Running with Docker Compose

From the repository root:

```bash
# Optional runtime config — then uncomment `volumes` in docker-compose.yml
cp docker/config.example.json docker/config.json

# Development mode (esbuild watch inside the container; still uses build-time .env)
docker compose -f docker/docker-compose.yml --env-file .env up kepler-dev

# Production mode (static build + runtime config / KEPLER_* from .env)
# Without a mounted config.json, credential and KEPLER_MAP_* / KEPLER_PAGE_TITLE env still apply.
docker compose -f docker/docker-compose.yml --env-file .env up kepler-prod
```

Then open http://localhost:8080.

## Published image (GHCR)

The production image is built from this repo (local `@kepler.gl/*` source, not npm) and published to `ghcr.io/keplergl/kepler.gl`. Tokens are still injected at runtime. No npm publish is required.

Tags:

- `latest` — current `master`
- `sha-<short>` — that commit
- git tags such as `v3.3.0-alpha.12` when a GitHub Release is published (same event as npm)

No-build (no clone). Env-only:

```bash
docker run -p 8080:8080 \
  -e KEPLER_MAPBOX_ACCESS_TOKEN='pk.your-token' \
  ghcr.io/keplergl/kepler.gl:latest
```

Or Compose — download `docker/docker-compose.ghcr.yml` and run:

```bash
curl -fsSO https://raw.githubusercontent.com/keplergl/kepler.gl/master/docker/docker-compose.ghcr.yml
docker compose -f docker-compose.ghcr.yml up
```

From this repo, with the root `.env` mapped like the build-from-source Compose file:

```bash
docker compose -f docker/docker-compose.ghcr.yml --env-file .env up
```

Pin `sha-…` (or a release tag) in production instead of `latest`. After the first publish, set the `kepler.gl` package visibility to **public** under the keplergl GitHub Packages settings if pulls are anonymous.

## Running with Docker Compose (build from source)

Once a locally built image exists, omit `--build` so Compose reuses it and starts in seconds, not minutes. Pass `--build` only after source or Dockerfile changes. If Compose still starts a build, force the existing image with `--no-build`:

```bash
docker compose -f docker/docker-compose.yml up --no-build kepler-prod
```

To rebuild after code changes on the host:

```bash
docker compose -f docker/docker-compose.yml up --build kepler-dev
```

> **Note:** The dev container does not mount the host source tree, so changes you make on the host require a rebuild (`--build`). The esbuild watch mode only picks up changes made inside the container itself (e.g. via `docker exec`).

## Running with Docker directly

### Development

```bash
docker build -f docker/Dockerfile.dev -t kepler-dev .
docker run -p 8080:8080 --env-file .env -e NODE_ENV=local kepler-dev
```

### Production

Build once, then choose a single runtime pattern.

Creating a root `.env` does **not** export variables into your shell. For `docker run`, either pass values explicitly, use `--env-file` with `KEPLER_*` keys, or load `.env` into the shell first (`set -a && source .env && set +a`) so `$MapboxAccessToken` expands.

```bash
docker build -f docker/Dockerfile -t kepler-prod .

# A) Config file only
docker run -p 8080:8080 \
  -v "$PWD/docker/config.json:/app/dist/config.json:ro" \
  kepler-prod

# B) Config file + KEPLER_* overrides (RW mount)
#    Option: explicit value
docker run -p 8080:8080 \
  -e KEPLER_MAPBOX_ACCESS_TOKEN='pk.your-token' \
  -v "$PWD/docker/config.json:/app/dist/config.json" \
  kepler-prod
#    Option: load root .env into the shell, then expand MapboxAccessToken
# set -a && source .env && set +a
# docker run ... -e KEPLER_MAPBOX_ACCESS_TOKEN="$MapboxAccessToken" ...

# C) Env only — prefer --env-file with KEPLER_* keys (see table above)
docker run -p 8080:8080 --env-file .env.kepler \
  kepler-prod
# Example .env.kepler:
#   KEPLER_MAPBOX_ACCESS_TOKEN=pk.your-token
#   KEPLER_PAGE_TITLE=kepler.gl demo
```

## Notes

- The build context must be the repository root (both Dockerfiles reference `src/`, `scripts/`, etc.).
- The `.dockerignore` at the root excludes nested `node_modules/`, other examples, `.git`, `website/`, `bindings/`, `test/`, `docs/`, and `.env*` so secrets are not copied into the build. Yarn installs use a BuildKit cache mount so lockfile rebuilds reuse downloaded packages. Docker Desktop and Compose v2 enable BuildKit by default; if `docker build` fails on `--mount`, run it with `DOCKER_BUILDKIT=1`.
- All postinstall scripts are disabled during `yarn install` to avoid building the `gl` native package (requires GPU headers, only used for tests). The `esbuild` platform binary is then installed selectively since it's required for bundling.
- Production images are built **without** baking Mapbox/cloud tokens. Change tokens by remounting `config.json` or updating `KEPLER_*` env and restarting — no rebuild.
- The dev image still reads `.env` at container start for esbuild `define` (watch/rebuild path). Prefer the prod image for deployable runtime injection.
- The dev image provides a no-op `xdg-open` to prevent the server from crashing when it tries to open a browser.
