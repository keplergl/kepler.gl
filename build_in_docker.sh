#!/usr/bin/env bash

docker run \
  --rm \
  --volume $(pwd):/keplergl \
  --workdir /keplergl \
  --env COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
  node:18 \
  sh -c 'corepack enable && npm install -g npm@8.19.2 && yarn install && yarn build'
