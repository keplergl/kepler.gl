# Api Reference

## Table of Content

-  [Overview](#overview)
-  [Ecosystem][ecosystem]
    - [Component][component]
    - [Reducer and Forward Dispatcher][reducer-and-forward-dispatcher]
    - [Actions and Updaters][actions-and-updaters]
    - [Processors and Schema Manager][processors-and-schema-manager]

-  [Get Started][get-started]

-  [Advanced Usage][advanced-usage]
    - [Using reducer plugin][reducer-plugin]
    - [Custom reducer initial state][custom-initial-state]
    - [Using updaters to modify kepler.gl state][using-updaters]
    - [Forward actions][forward-actions]
    - [Saving and loading maps with schema manager][saving-loading-w-schema]
    - [Replace UI component][replace-ui-component]
    - [Custom Mapbox Host][custom-mapbox-host]

-  [API]()
    - [Components][components]
    - [Reducers][reducers]
    - [Actions and Updaters][actions-updaters]
    - [Data Processor][processors]
    - [Schemas][schemas]

## Overview

Kepler.gl is a __Redux-connected__ component. You can embed kepler.gl in your App, which uses redux to manage its state. The basic implementation of kepler.gl reducer is simple. However, to make the most of it, it's recommended to have basic knowledge on:

- [React][react]
- [Redux][redux] state container
- [React Redux connect][react-redux]

To start out with kepler.gl, you simply need to add the Kepler.gl UI component and mount the Kepler.gl reducer. To give the user full access of all the functionalities of kepler.gl, this package also includes actions, schema managers and a set of utilities to load and save map data.

[ecosystem]: ./ecosystem.md
[get-started]: ./get-started.md
[advanced-usage]: ./advanced-usage.md
[components]: ./components/overview.md
[reducers]: ./reducers/overview.md
[actions-updaters]: ./actions/overview.md
[processors]: ./processors/overview.md
[schemas]: ./schemas/overview.md

[replace-ui-component]: ./advanced-usages/replace-ui-component.md
[custom-initial-state]: ./advanced-usages/custom-initial-state.md
[reducer-plugin]: ./advanced-usages/reducer-plugin.md
[using-updaters]: ./advanced-usages/using-updaters.md
[forward-actions]: ./advanced-usages/forward-actions.md
[saving-loading-w-schema]: ./advanced-usages/saving-loading-w-schema.md

[component]: ./ecosystem.md#component
[reducer-and-forward-dispatcher]: ./ecosystem.md#reducer-and-forward-dispatcher
[actions-and-updaters]: ./ecosystem.md#actions-and-updaters
[processors-and-schema-manager]: ./ecosystem.md#processors-and-schema-manager

[redux]: https://redux.js.org/
[react]: https://reactjs.org/
[react-redux]: https://react-redux.js.org/
