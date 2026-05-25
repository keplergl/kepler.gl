# Docker Setup for kepler.gl Demo App

Two Dockerfiles are provided:

- **Dockerfile** — production multi-stage build. Compiles the demo-app to static files and serves with `serve`.
- **Dockerfile.dev** — development mode with hot-reload via esbuild watch.

## Prerequisites

1. [Docker](https://docs.docker.com/get-docker/) installed and running
2. Create a `.env` file at the repository root (copy from `.env.template`):

```bash
cp .env.template .env
```

Fill in at least `MapboxAccessToken` for the map to render.

## Running with Docker Compose

From the repository root:

```bash
# Development mode (hot-reload, esbuild watch)
docker compose -f docker/docker-compose.yml up kepler-dev

# Production mode (static build served by serve)
docker compose -f docker/docker-compose.yml up kepler-prod
```

Then open http://localhost:8080.

To rebuild after code changes:

```bash
docker compose -f docker/docker-compose.yml up --build kepler-dev
```

## Running with Docker directly

### Development

```bash
docker build -f docker/Dockerfile.dev -t kepler-dev .
docker run -p 8080:8080 --env-file .env -e NODE_ENV=local kepler-dev
```

### Production

Make sure `.env` exists at the root — env vars are baked in at build time:

```bash
docker build -f docker/Dockerfile -t kepler-prod .
docker run -p 8080:8080 kepler-prod
```

## Notes

- The build context must be the repository root (both Dockerfiles reference `src/`, `scripts/`, etc.).
- The `.dockerignore` at the root excludes `node_modules/`, `.git/`, `website/`, `bindings/`, `test/`, and `docs/` to keep the build context small.
- The `gl` native package (used only for testing) is skipped during Docker builds by disabling postinstall scripts. The `esbuild` binary is manually installed afterward since it's required for bundling.
- Environment variables like `MapboxAccessToken` are embedded at build time in production mode. Rebuild the image to change them.
- The dev image provides a no-op `xdg-open` to prevent the server from crashing when it tries to open a browser.
