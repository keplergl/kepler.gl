#!/usr/bin/env bash
set -ex

yarn install --ignore-engines
npm rebuild
xvfb-run -a npm run cover
