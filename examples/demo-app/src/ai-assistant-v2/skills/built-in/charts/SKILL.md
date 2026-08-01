# Charts & summary statistics

Draw a histogram of one numeric variable, or compute summary statistics for
boxplots, scatterplots, bubble charts, and parallel coordinates plots. Works
on any kepler dataset **or** DuckDB table.

## When to use

Use this skill when the user wants to understand the distribution of, or
relationship between, numeric variables — without necessarily building a map
layer. Examples:
- "Show the distribution of income"
- "Are income and education correlated?"
- "Give me a boxplot of prices by category"
- "Plot population vs area, sized by density"
- "Compare these five variables at once"

Do NOT use this skill for:
- Map layer creation / styling → use the `kepler` skill.
- LISA clustering → use the `lisa-clustering` skill.
- Spatial filtering → use the `spatial-filter` skill.

## Tools at a glance

These five are called as **direct tools by name** — *not* through `executeApi`.
Every other built-in skill routes its actions through `executeApi`; this one is
the exception, because a chart's deliverable is the React component itself and
its tool name must survive to the UI for the right renderer to be selected.

| tool             | what it produces                                   | chart? |
| ---------------- | -------------------------------------------------- | :----: |
| `histogramTool`  | frequency distribution of one numeric variable     |  yes   |
| `boxplotTool`    | quartile/mean/std/IQR stats for several variables  |  no   |
| `scatterplotTool`| correlation + min/max/mean for two variables       |  no   |
| `bubbleChartTool`| x/y/size stats for three variables                 |  no   |
| `pcpTool`        | min/max/mean/std per variable, many at once        |  no   |

## Picking a chart

- Distribution of **one** numeric variable → `histogramTool`.
- Spread / outliers across **several** variables → `boxplotTool`.
- Relationship between **two** variables → `scatterplotTool`.
- Relationship between **three** variables → `bubbleChartTool`.
- **Many** variables compared at once → `pcpTool`.

## Data source

Any kepler dataset or DuckDB table works. The tools read kepler first, then
fall back to DuckDB under both naming conventions (the verbatim name and
`tbl_<sanitized>`). If a variable isn't found, **confirm the name** via
`executeApi` `data.query` / `SHOW TABLES` (or `data.create-table` results)
rather than guessing.

## Honesty rule

- `histogramTool` **draws a chart**, so do NOT restate every bin count in prose
  — a short summary of the shape is enough.
- The other four return **numbers only, no chart**. Their statistics MUST appear
  in your reply, and you MUST NOT claim a chart was drawn. If you only see
  numbers back from a tool, the user sees only your text.

## Workflow

1. Identify the dataset name and the numeric variable(s) the user is asking
   about. If unsure of a name, confirm it before calling.
2. Pick the tool using the guide above.
3. Call it directly by name with `datasetName` and the variable name(s).
4. Report the results in prose:
   - For `histogramTool`, describe the distribution shape (skew, modes, range)
     — the chart itself shows the bin counts.
   - For the four stats-only tools, restate the returned numbers (medians, IQRs,
     correlation, means, etc.) since no chart is rendered.

## Self-check (before your final message)

- If you called any tool other than `histogramTool`, your reply must contain
  its numeric results. If it doesn't, add them.
- If you called `histogramTool`, do not list every bin count; the chart already
  shows them.
- Never claim a chart was drawn for `boxplotTool`, `scatterplotTool`,
  `bubbleChartTool`, or `pcpTool` — they return numbers only.
