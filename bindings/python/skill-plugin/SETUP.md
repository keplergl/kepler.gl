---
name: setup
description: One-time setup for the kepler-gl plugin — verify Python and the keplergl package so map export works.
---

The kepler-gl plugin generates maps by running a local Python script that imports `keplergl` and exports a standalone `.html` file. On the first use, confirm the environment is ready:

1. Check Python is available (`python3 --version`); if not, tell the user and stop.
2. Check the `keplergl` package version: `python3 -c "import keplergl, importlib.metadata; print(importlib.metadata.version('keplergl'))"`.
   - The skill requires the **0.4.x release line** — the 0.3.x widget on PyPI uses a different API and the skill examples won't work.
   - If missing or < 0.4.0, install it: `pip install "keplergl>=0.4.0"` (or `pip install --pre "keplergl>=0.4.0"` when only a release candidate is published).
3. Only surface this once per session — after confirming, proceed straight to generating maps.
