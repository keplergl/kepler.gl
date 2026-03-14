# Development Guide

This guide explains how to set up kepler.gl for Jupyter for local development.

## Prerequisites

- Python >= 3.9
- Node.js (for building the frontend)
- JupyterLab >= 4.0 or Notebook >= 7.0

## Installation

Navigate to the `bindings/python` directory:

```bash
cd bindings/python
```

### 1. Install JavaScript dependencies and build the frontend

```bash
npm install
npm run build
```

### 2. Install Python package in development mode

Using **uv** (recommended):

```bash
uv sync --dev
```

Or using **pip**:

```bash
pip install -e ".[dev]"
```

### 3. Start Jupyter

```bash
# With uv
uv run jupyter lab

# Or with pip
jupyter lab
```

## Development with Hot Reload

For active development with automatic rebuilding of the TypeScript/JavaScript:

```bash
# Terminal 1: Watch for TypeScript changes
npm run dev

# Terminal 2: Run Jupyter
uv run jupyter lab
```

The `npm run dev` command watches for changes in the `src/` directory and automatically rebuilds the widget JavaScript.

## Quick Test

```python
from keplergl import KeplerGl

# Create a map
map = KeplerGl(height=400)
map
```

## Running Tests

```bash
uv run pytest
```

## Available npm Scripts

- `npm run build` - Build TypeScript to `keplergl/static/`
- `npm run dev` - Build with watch mode for development
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint on source files

## Publishing to PyPI

Publishing is done manually via GitHub Actions using the "Run workflow" button.

### Version Format

The version in `pyproject.toml` determines what type of release you can publish:

- **Prerelease versions**: Must have a suffix like `a`, `b`, `rc`, or `dev` followed by a number
  - Examples: `0.4.0a1` (alpha), `0.4.0b1` (beta), `0.4.0rc1` (release candidate), `0.4.0.dev1` (development)
- **Official versions**: Clean semantic versions without any suffix
  - Examples: `0.4.0`, `1.0.0`

### Publishing Steps

1. **Update the version** in both files:
   - `pyproject.toml` (line: `version = "x.x.x"`)
   - `keplergl/_version.py` (line: `__version__ = "x.x.x"`)

2. **Go to GitHub Actions** → "Build and Publish KeplerGL Python Package" workflow

3. **Click "Run workflow"** and select the appropriate option:
   - **Prerelease** (checked by default): Publishes to PyPI as a prerelease. Version must have a prerelease suffix.
   - **Official release** (unchecked): Publishes to PyPI as an official release. Version must be a clean version.

4. The workflow will:
   - Build and test the package
   - Validate that the version format matches the publish type
   - Publish to PyPI if validation passes

### Validation Rules

| Checkbox | Version | Result |
|----------|---------|--------|
| ✓ Prerelease | `0.4.0a1` | ✅ Publishes |
| ✓ Prerelease | `0.4.0` | ❌ Fails (version must have prerelease suffix) |
| ☐ Official | `0.4.0` | ✅ Publishes |
| ☐ Official | `0.4.0a1` | ❌ Fails (version must not have prerelease suffix) |
