// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

const {readdirSync, statSync, readFileSync} = require('fs');
const {join} = require('path');;

const packages = [
    "constants",
    "utils",
    "styles",
    "localization",
    "deckgl-layers",
    "layers",
    "schemas",
    "table",
    "cloud-providers",
    "processors",
    "tasks",
    "actions",
    "reducers",
    "components"
]

const getAllFiles = function(dirPath, arrayOfFiles) {
    const files = readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function(file) {
        if (statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else if (file.match(/^.*\.(ts|tsx|js)$/)) {
            arrayOfFiles.push(join(__dirname, dirPath, "/", file))
        }
    })

    return arrayOfFiles
}

const cleanResults = res => {
    if (!res) 
        return []
    else 
        return res.map(found=>/from '([^\.][^']+)'/g.exec(found)[1].trim())
}

const pathsByPackage = packages.reduce((paths, package) => ({...paths, [package]: getAllFiles(`./src/${package}/src`)}), {})

const raw = Object.entries(pathsByPackage).reduce((deps, [package, paths]) => ({...deps, [package]:paths.reduce((matchArr, path) => matchArr.concat(cleanResults(readFileSync(path).toString().match(/from '([^\.][^']+)'/g))), [])}) ,{})

const versions = {
    "@danmarshall/deckgl-typings": "4.9.22",
    "@deck.gl/aggregation-layers": "8.6.0",
    "@deck.gl/core": "^8.6.0",
    "@deck.gl/extensions": "^8.6.0",
    "@deck.gl/geo-layers": "^8.6.0",
    "@deck.gl/layers": "^8.6.0",
    "@deck.gl/mapbox": "^8.6.0",
    "@deck.gl/mesh-layers": "^8.6.0",
    "@deck.gl/react": "^8.6.0",
    "@hubble.gl/core": "1.2.0-alpha.6",
    "@hubble.gl/react": "1.2.0-alpha.6",
    "@loaders.gl/core": "^3.0.9",
    "@loaders.gl/csv": "^3.0.9",
    "@loaders.gl/gltf": "^3.0.9",
    "@loaders.gl/json": "^3.0.9",
    "@loaders.gl/loader-utils": "^3.0.9",
    "@loaders.gl/polyfills": "^3.0.9",
    "@loaders.gl/shapefile": "^3.0.9",
    "@luma.gl/constants": "^8.5.10",
    "@luma.gl/core": "^8.5.10",
    "@mapbox/geo-viewport": "^0.4.1",
    "@mapbox/geojson-normalize": "0.0.1",
    "@mapbox/vector-tile": "^1.3.1",
    "@nebula.gl/edit-modes": "^0.14.0",
    "@reduxjs/toolkit": "^1.7.2",
    "@tippyjs/react": "^4.2.0",
    "@turf/bbox": "^6.0.1",
    "@turf/boolean-within": "^6.0.1",
    "@turf/helpers": "^6.1.4",
    "@types/classnames": "^2.3.1",
    "@types/d3-brush": "^3.0.1",
    "@types/d3-selection": "^3.0.2",
    "@types/exenv": "^1.2.0",
    "@types/keymirror": "^0.1.1",
    "@types/lodash.clonedeep": "^4.5.7",
    "@types/lodash.curry": "^4.1.7",
    "@types/lodash.debounce": "^4.0.7",
    "@types/lodash.flattendeep": "^4.4.7",
    "@types/lodash.get": "^4.4.6",
    "@types/lodash.isequal": "^4.5.5",
    "@types/lodash.memoize": "^4.1.7",
    "@types/lodash.pick": "^4.4.6",
    "@types/lodash.throttle": "^4.1.7",
    "@types/lodash.uniq": "^4.5.7",
    "@types/lodash.uniqby": "^4.7.7",
    "@types/lodash.xor": "^4.5.7",
    "@types/mapbox__geo-viewport": "^0.4.1",
    "@types/react-copy-to-clipboard": "^5.0.2",
    "@types/react-dom": "^18.0.0",
    "@types/react-lifecycles-compat": "^3.0.1",
    "@types/react-map-gl": "^6.1.2",
    "@types/react-modal": "^3.13.1",
    "@types/react-onclickoutside": "^6.7.4",
    "@types/react-redux": "^7.1.23",
    "@types/react-virtualized": "^9.21.20",
    "@types/react-vis": "^1.8.0",
    "@types/styled-components": "^5.1.25",
    "@typescript-eslint/parser": "^5.27.0",
    "classnames": "^2.2.1",
    "colorbrewer": "^1.5.0",
    "copy-to-clipboard": "^3.3.1",
    "d3-array": "^2.8.0",
    "d3-axis": "^2.0.0",
    "d3-brush": "^2.1.0",
    "d3-color": "^2.0.0",
    "d3-dsv": "^2.0.0",
    "d3-format": "^2.0.0",
    "d3-hexbin": "^0.2.2",
    "d3-request": "^1.0.6",
    "d3-scale": "^3.2.3",
    "d3-shape": "^1.3.7",
    "d3-selection": "^2.0.0",
    "decimal.js": "^10.2.0",
    "eslint-config-developit": "^1.2.0",
    "exenv": "^1.2.2",
    "fuzzy": "^0.1.3",
    "global": "^4.3.0",
    "h3-js": "^3.1.0",
    "html-webpack-plugin": "^4.3.0",
    "keymirror": "^0.1.1",
    "lodash.clonedeep": "^4.0.1",
    "lodash.curry": "^4.1.1",
    "lodash.debounce": "^4.0.8",
    "lodash.flattendeep": "^4.2.0",
    "lodash.get": "^4.4.2",
    "lodash.isequal": "^4.5.0",
    "lodash.memoize": "^4.1.2",
    "lodash.pick": "^4.4.0",
    "lodash.throttle": "^4.1.1",
    "lodash.uniq": "^4.0.1",
    "lodash.uniqby": "^4.7.0",
    "lodash.xor": "^4.5.0",
    "long": "^4.0.0",
    "mapbox": "^1.0.0-beta10",
    "mapbox-gl": "^1.13.1",
    "mini-svg-data-uri": "^1.0.3",
    "moment": "^2.10.6",
    "moment-timezone": "^0.5.32",
    "pbf": "^3.1.0",
    "prop-types": "^15.6.0",
    "react-color": "^2.17.3",
    "react-copy-to-clipboard": "^5.0.2",
    "react-intl": "^3.12.0",
    "react-json-pretty": "^2.2.0",
    "react-lifecycles-compat": "^3.0.4",
    "react-map-gl": "^5.0.3",
    "react-map-gl-draw": "0.14.8",
    "react-markdown": "^5.0.2",
    "react-modal": "^3.8.1",
    "react-onclickoutside": "^6.7.1",
    "react-palm": "^3.3.7",
    "react-redux": "^7.1.3",
    "react-sortable-hoc": "^1.8.3",
    "react-tooltip": "^4.2.17",
    "react-virtualized": "^9.21.1",
    "react-vis": "^1.8.0",
    "redux": "^4.0.5",
    "redux-actions": "^2.2.1",
    "reselect": "^4.0.0",
    "resize-observer-polyfill": "^1.5.1",
    "s2-geometry": "^1.2.10",
    "styled-components": "^4.1.3",
    "supercluster": "^7.1.0",
    "type-analyzer": "0.3.0",
    "typedoc": "^0.19.2",
    "viewport-mercator-project": "^6.0.0",
    "wellknown": "^0.5.0",
    "@kepler.gl/types": "2.5.5",
    "@kepler.gl/constants": "2.5.5",
    "@kepler.gl/utils": "2.5.5",
    "@kepler.gl/styles": "2.5.5",
    "@kepler.gl/localization": "2.5.5",
    "@kepler.gl/deckgl-layers": "2.5.5",
    "@kepler.gl/layers": "2.5.5",
    "@kepler.gl/schemas": "2.5.5",
    "@kepler.gl/table": "2.5.5",
    "@kepler.gl/cloud-providers": "2.5.5",
    "@kepler.gl/processors": "2.5.5",
    "@kepler.gl/tasks": "2.5.5",
    "@kepler.gl/actions": "2.5.5",
    "@kepler.gl/reducers": "2.5.5",
    "@kepler.gl/components": "2.5.5",
    "react": "^16.14.0",
    "@types/geojson": "^7946.0.7",
    "mjolnir.js":"^2.5.0",
    "react-dom": "^16.8.4",
    "@types/d3-array": "^2.0.0",
    "@types/d3-scale": "^3.2.2",
    "@types/geojson": "^7946.0.7",
    "@types/redux-actions": "^2.6.2",
    "@types/supercluster": "^7.1.0"
}

const mappings = {
    "global/window": "global",
    "global/console": "global",
    "global/document": "global",
    "@deck.gl/aggregation-layers/aggregation-layer": "@deck.gl/aggregation-layers",
    "@deck.gl/core/lib/composite-layer": "@deck.gl/core",
    "geojson":"@types/geojson",
    "react-palm/tasks": "react-palm",
    "deck.gl": "@danmarshall/deckgl-typings",
    "@tippyjs/react/headless": "@tippyjs/react"
}

const getDep = dep => {
    if (mappings[dep])
        return mappings[dep]
    else
        return dep
}

const result = {};
const unusedVersions = new Set(Object.keys(versions))
Object.entries(raw).forEach(([package, imports]) => {
    const packageRes = {}
    Array.from(new Set(imports)).forEach(dep => {
        if (!versions[getDep(dep)])
            console.warn('no version for ', getDep(dep))
        packageRes[getDep(dep)] = versions[getDep(dep)]
        packageRes[`@types/${dep}`] = versions[`@types/${dep}`]
        // if (versions[dep] && !unusedVersions.has(dep))
        //     console.log(`'${dep}'`)
        unusedVersions.delete(getDep(dep))
        unusedVersions.delete(`@types/${dep}`)
    })
    result[package] = Object.keys(packageRes).sort().reduce((obj, key) => ({...obj, [key]: packageRes[key]}), {})
});
const mainPackageResult = {}
Array.from(unusedVersions).sort().forEach(dep => {
    mainPackageResult[dep] = versions[dep]
})

console.log(JSON.stringify(result));
console.log('')
console.log(Array.from(unusedVersions).sort().join('\n'))