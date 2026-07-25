# Classify data into bins

Classify a numeric variable into bins using break values produced by a classification method.

## When to use

Use this skill when the user wants to bin or classify a numeric variable into discrete categories (quantile, natural breaks, equal interval, percentile, standard deviation, box, or custom breaks).

## Workflow

1. Use `executeApi` with `commandId: "data.classify"` and `input: { datasetName, variableName, method, k?, hinge? }` to compute break values. `method` is one of: quantile, natural breaks, equal interval, percentile, box, standard deviation, unique values.
2. If the user provides custom breaks, do not call the classify command — use the breaks directly.
3. Visualize the classified variable on the map using `executeApi` with `commandId: "map.add-layer"` and `input: { datasetName, layerType, colorBy, colorType: "breaks", colorMap }`. Build `colorMap` from the returned `breaks`: `[{value: <break>, color: "<hex>"}, ..., {value: null, color: "<hex>"}]` (the last `value: null` entry is the color for the highest bin).

## Rules

- When classifying data into bins using break values, the lower bound is inclusive and the upper bound is exclusive for all bins except the last bin, which is inclusive of both bounds.
- For example, for breaks at [1000, 1100], the bins are:
  - b1: values < 1000
  - b2: 1000 <= values < 1100
  - b3: values >= 1100
- If the user provides custom breaks, there is no need to call the classify command.