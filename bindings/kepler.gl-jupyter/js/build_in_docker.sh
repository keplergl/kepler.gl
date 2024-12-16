#!/usr/bin/env bash

if [ -z "$MAPBOX_ACCESS_TOKEN" ]
then
  echo "Error: Please set a valid mapbox access token in MAPBOX_ACCESS_TOKEN."
  exit 1
fi

docker run \
  --rm \
  -it \
  --env MapboxAccessTokenJupyter="$MAPBOX_ACCESS_TOKEN" \
  --volume $(pwd):/keplergl \
  --workdir /keplergl \
  --env COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
  node:18 \
  sh -c 'corepack enable && npm install -g npm@8.19.2 && yarn install && yarn build'

 # yarn config set nodeLinker node-modules
