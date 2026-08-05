# Open Modal

This example demonstrates how to mount Kepler.gl inside a `react-modal` dialog, showcasing two different lifecycle behaviors:

- **Fresh state** (`mint: true`, the default) — the map resets every time the modal is reopened
- **Saved state** (`mint: false`) — the map preserves its state across open/close cycles

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
