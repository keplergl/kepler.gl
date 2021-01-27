#!/bin/bash

npm run build:umd

path=$1

if [ -z "$1" ]
  then
    path="../Napkin-Visual/"
fi

cp umd/keplergl.min.js $path/lib/build.min.js
