#!/bin/sh
set -eu

CONFIG_PATH="${KEPLER_CONFIG_PATH:-/app/dist/config.json}"
export KEPLER_CONFIG_PATH="$CONFIG_PATH"

node /app/merge-runtime-config.js

exec serve -s dist -l 8080
