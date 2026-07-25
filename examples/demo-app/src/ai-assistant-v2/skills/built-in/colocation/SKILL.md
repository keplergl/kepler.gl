# Colocation map

A colocation map shows the co-location of two variables V1 and V2 from a dataset A.

## When to use

Use this skill when the user wants to see where two variables co-occur (co-locate) across the same set of geographic features — e.g. "where do high income and high crime overlap?".

## Workflow

1. Create a categorical variable for the first variable (V1) using a classification method:
   - breaks in quantile / box map / equal interval / natural breaks / percentile / standard deviation / custom breaks
   - or clusters from a LISA analysis
2. Create a categorical variable for the second variable (V2) using the same kind of tool, so both are categorical.
3. Use `executeApi` with `commandId: "data.create-table"` to save the two categorical variables into a new dataset B, e.g.:
   ```sql
   SELECT ...,
     CASE WHEN V1 < 0 THEN 1 WHEN V1 >= 5 AND V1 < 10 THEN 2 WHEN V1 >= 10 THEN 3 END AS C1,
     CASE WHEN V2 < 4 THEN 1 WHEN V2 >= 8 AND V2 < 9 THEN 2 WHEN V2 >= 9 THEN 3 END AS C2
   FROM __TABLE__
   ```
4. Use `executeApi` with `commandId: "data.create-table"` again to compare the two categorical values from dataset B and save the result in a new dataset C:
   - keep the value if the two categories are the same
   - assign -1 if they are different
5. Visualize dataset C on the map using `executeApi` with `commandId: "map.add-layer"` with a "unique values" color scheme (paired colors), and assign gray to the value -1.

## Rules

- Keep skills portable: replace V1/V2 and dataset names with the user's actual variable and dataset names at runtime.
- Use `__TABLE__` as the table-name placeholder in any SQL; it is replaced with the real DuckDB table name at runtime.
- Do not call `map.add-layer` after `data.create-table` — `data.create-table` auto-creates a map layer. (Use `map.add-layer` only when visualizing a previously-saved dataset that has no layer yet, as in step 5.)