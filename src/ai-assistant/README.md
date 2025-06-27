# Kepler.gl AI Assistant Module

The AI Assistant is a module that adds an AI chatbot to Kepler.gl. This module aims to integrates Kepler.gl with AI-powered capabilities, enabling it to interact with multiple AI models seamlessly.

## Overview

The system is designed to enable Kepler.gl, a React-based single-page application, to integrate an AI Assistant Module for performing tasks with large language models (LLMs) like OpenAI GPT models, Google Gemini models, Ollama models, etc.

![image](https://github.com/user-attachments/assets/77a240f1-037f-488e-8261-b7e82c42606d)

Below is a flow map that shows how a user can update a basemap in Kepler.gl through a simple AI-driven prompt, showcasing the integration of LLMs with application actions and rendering.

![image](https://github.com/user-attachments/assets/17992157-3393-4fcb-8e72-7edf46268c6c)

The AI Assistant Module also provides a set of tools to support data analysis and visualization. These AI Tools are designed to be used in conjunction with the Kepler.gl application and transform kepler.gl into a powerful spatial data analysis and visualization tool. For more details about the AI Assistant Module, please to https://github.com/geodacenter/openassistant.

## AI Tools

LLMs use these AI Tools to perform spatial data analysis and visualization tasks to help users explore and understand their data.

For example, a user can ask the AI Assistant to simply change the basemap to a `voyager` basemap, and the AI Assistant will call the `basemap` tool to change the basemap.

<img width="741" alt="Screenshot 2025-05-30 at 11 54 21 AM" src="https://github.com/user-attachments/assets/6e7a1e45-17b1-48c9-9ce6-5ead3430d703" />

For complex tasks, the AI Assistant can use multiple tools to perform the task. For example, a user can ask the AI Assistant if the points dataset loaded in kepler.gl is clustering in zipcode areas. The AI Assistant could call the following tools to perform the task:

1. `mapBoundary` to get the boundary of current map view
2. `queryUSZipcode` to get a list of zipcodes using the map boundary
3. `usZipcode` to fetch the geometries of the zipcodes from Github site
4. `saveData` to save the zipcode areas as a new GeoJSON dataset in kepler.gl
5. `spatialJoin` to count the number of points in each zipcode area
6. `saveData` to save the spatialJoin result as a new dataset in kepler.gl
7. `weightsCreation` to create a e.g. queen contiguity weights using the spatialJoin result
8. `local Moran's I` to apply local Moran's I using the counts and the queen contiguity weights
9. `saveData` to save the local Moran's I result as a new dataset in kepler.gl
10. `addLayer` to add the local Moran's I result as a new layer in kepler.gl

![kepler-vectortile-ai-3](https://github.com/user-attachments/assets/406afbfe-4671-42a6-8f38-90cdf171c363)

These fine grained spatial tools are designed to transform the LLMs, which are fundarmentally statistical language models, into powerful spatial data analysis and visualization AI Agent.

As of May 2025, the AI Assistant Module supports the following AI Tools:

- Kepler.gl Tools

  - [basemap](https://github.com/keplergl/kepler.gl/blob/main/src/ai-assistant/src/tools/kepler-tools/basemap-tool.tsx)
  - [mapBoundary](https://github.com/keplergl/kepler.gl/blob/main/src/ai-assistant/src/tools/kepler-tools/boundary-tool.tsx)
  - [addLayer](https://github.com/keplergl/kepler.gl/blob/main/src/ai-assistant/src/tools/kepler-tools/layer-creation-tool.tsx)
  - [updateLayerColor](https://github.com/keplergl/kepler.gl/blob/main/src/ai-assistant/src/tools/kepler-tools/layer-style-tool.tsx)
  - [loadData](https://github.com/keplergl/kepler.gl/blob/main/src/ai-assistant/src/tools/kepler-tools/loaddata-tool.tsx)
  - [saveData](https://github.com/keplergl/kepler.gl/blob/main/src/ai-assistant/src/tools/kepler-tools/savedata-tool.tsx)

- Plot Tools

  - eCharts Plots
    - [boxplot](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/plots/src/echarts/boxplot/tool.ts)
    - [bubbleChart](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/plots/src/echarts/bubble-chart/tool.ts)
    - [histogram](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/plots/src/echarts/histogram/tool.ts)
    - [parallel coordinate](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/plots/src/echarts/pcp/tool.ts)
    - [scatterplot](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/plots/src/echarts/scatterplot/tool.ts)
  - [Vega-Lite Plots](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/plots/src/vegalite/tool.ts) (coming soon)

- Query Tools

  - [genericQuery](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/duckdb/src/tool.ts)
  - [filterDataset](https://github.com/keplergl/kepler.gl/blob/main/src/ai-assistant/src/tools/query-tool.tsx)

- OSM Tools

  - [geocoding](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/osm/src/geocoding.ts)
  - [isochrone](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/osm/src/isochrone.ts)
  - [routing](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/osm/src/routing.ts)
  - [roads](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/osm/src/roads.ts)
  - [US County](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/osm/src/us/county.ts)
  - [US State](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/osm/src/us/state.ts)
  - [US Zipcode](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/osm/src/us/zipcode.ts)
  - [Query US Zipcodes](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/osm/src/us/queryZipcode.ts)

- Spatial Analysis Tools (powered by [Geoda](https://geodacenter.github.io/geoda-lib/))
  - Geo Tools
    - [area](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/geoda/src/spatial_ops/area.ts)
    - [buffer](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/geoda/src/spatial_ops/buffer.ts)
    - [centroid](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/geoda/src/spatial_ops/centroid.ts)
    - [dissolve](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/geoda/src/spatial_ops/dissolve.ts)
    - [length](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/geoda/src/spatial_ops/length.ts)
    - [perimeter](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/geoda/src/spatial_ops/perimeter.ts)
  - Data Tools
    - [data classification](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/geoda/src/data-classify/tool.ts)
      - quantile
      - natural Jenks breaks
      - equal interval
      - percentile
      - box
      - standard deviation
      - unique values
    - data by rates (comming soon)
  - Spatial Join
    - [spatialJoin](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/geoda/src/spatial_join/tool.ts)
    - [spatialFilter](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/geoda/src/spatial_join/spatial-filter.ts)
  - Spatial Weights
    - [weightsCreation](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/geoda/src/weights/tool.ts)
      - queen/rook
      - k-nearest neighbors
      - distance band
  - Spatial Autocorrelation
    - [global Moran's I](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/geoda/src/spatial_autocorrelation/global-moran.ts)
    - [local spatial autocorrelation](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/geoda/src/lisa/tool.ts)
      - local Moran's I
      - local Geary's C
      - local Getis-Ord Gi\*
      - quantile LISA
    - [spatial regression](https://github.com/GeoDaCenter/openassistant/blob/main/packages/tools/geoda/src/regression/tool.ts)
      - OLS with spatial diagnostics
      - Spatial Lag Model
      - Spatial Error Model

## Tutorials

Next: [Spatial Data Analysis using Kepler.gl AI Assistant](https://github.com/keplergl/kepler.gl/blob/main/docs/spatial-analysis-tutorial/README.md)
