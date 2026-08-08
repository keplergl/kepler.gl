# Replacing Components

Example showing how to replace kepler.gl default components using the `injectComponents` method.

The example replaces the following components with custom versions:
- **Sidebar** — wrapped in a scaled container
- **PanelHeader** — removes default action items
- **PanelToggle** — adds a "Save Config" button that serializes and displays the current map config
- **CustomPanels** — adds two extra side panel tabs (Rocket, Chart)
- **MapPopover** — suppresses the tooltip for the point layer

#### 1. Install

```sh
touch yarn.lock && yarn
```

> `touch yarn.lock` is needed the first time so Yarn treats this as a standalone project,
> independent from the kepler.gl monorepo.

#### 2. Start the app

```sh
yarn start
```
