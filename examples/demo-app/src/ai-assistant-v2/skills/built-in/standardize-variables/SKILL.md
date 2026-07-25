# Standardize multiple variables

Standardize (or apply a similar transformation to) multiple variables in a dataset, when the tool only handles one variable at a time and creates a new dataset for each operation.

## When to use

Use this skill when the user wants to standardize several variables in the same dataset (e.g. "z-score all of these columns").

## Workflow

1. For the first variable, use the original dataset as input and apply the standardization using `executeApi` with `commandId: "geoda.standardize"` and `input: { datasetName, variableName, method, outputDatasetName }`. `method` is one of: deviationFromMean, standardizeMAD, rangeAdjust, rangeStandardize, standardize. This creates a new dataset containing the standardized variable.
2. For each subsequent variable, use the most recently created dataset (which already contains the previously standardized variables) as the input for the next standardization.
3. Repeat this process for every variable to standardize, so that the final dataset contains all the standardized variables together.
4. After all variables are standardized, confirm that the final dataset contains all original columns plus all the new standardized columns.

## Rules

- Only use the original dataset for the first standardization; for every subsequent variable, use the latest dataset that includes all previous results.
- Keep skills portable: substitute the user's actual dataset and variable names at runtime.