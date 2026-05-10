# Summary Panel Overlay (SampleMapPanel-style)

Add a small informational panel on top of a kepler.gl map exported via `save_to_html()` — useful for summary stats, legends of custom classifications, model metadata, or LISA / cluster counts.

## Why not a real React component?

The `SampleMapPanel` used in the kepler.gl demo app is part of that demo's source and is **not** exposed by the UMD bundle loaded in the standalone HTML export. The pragmatic equivalent is to inject an HTML/CSS overlay into the exported file after calling `save_to_html()`.

## Positioning

The map's zoom/rotate/split/legend control column sits against the right edge of the viewport and is roughly 40–50px wide. Place the panel at `right: 56px` (or `left: 66px` to sit next to the side panel toggle) so it does not block those controls.

| Placement | CSS |
|-----------|-----|
| Top-right, clear of map controls | `top: 16px; right: 56px;` |
| Top-left, clear of side-panel toggle | `top: 16px; left: 66px;` |
| Bottom-left, above attribution | `bottom: 36px; left: 16px;` |

## Pattern

1. Call `map.save_to_html(file_name='out.html')` as usual.
2. Build a small `<div>` + `<style>` snippet in Python.
3. Read the file, insert the snippet just before `</body>`, write it back.

## Example: LISA category counts overlay

```python
from collections import Counter

# Assume gdf has columns: LISA_LABEL (str), and `labels` / `colors` come from
# a pygeoda LISA result (lm.lisa_labels(), lm.lisa_colors()).
order = ["High-High", "Low-Low", "Low-High", "High-Low", "Not significant"]
label_to_color = {labels[i]: colors[i] for i in range(len(labels))}
counts = Counter(gdf["LISA_LABEL"])
total = sum(counts.values())
sig = sum(n for lbl, n in counts.items() if lbl != "Not significant")

rows = ""
for lbl in order:
    n = counts.get(lbl, 0)
    pct = 100 * n / total if total else 0
    swatch = label_to_color.get(lbl, "#888")
    rows += (
        f'<div class="lisa-row">'
        f'<span class="lisa-swatch" style="background:{swatch}"></span>'
        f'<span class="lisa-label">{lbl}</span>'
        f'<span class="lisa-count">{n:,} ({pct:.1f}%)</span>'
        f'</div>'
    )

panel_html = f"""
<div id="sample-map-panel">
  <div class="smp-header">Local Moran's I &mdash; HR60</div>
  <div class="smp-sub">Queen contiguity &middot; 999 permutations &middot; p &le; 0.05</div>
  <div class="smp-divider"></div>
  <div class="smp-stats">
    <div class="smp-stat"><span class="smp-stat-num">{total:,}</span><span class="smp-stat-lbl">Counties</span></div>
    <div class="smp-stat"><span class="smp-stat-num">{sig:,}</span><span class="smp-stat-lbl">Significant</span></div>
    <div class="smp-stat"><span class="smp-stat-num">{100*sig/total:.1f}%</span><span class="smp-stat-lbl">Sig. share</span></div>
  </div>
  <div class="smp-divider"></div>
  <div class="smp-rows">{rows}</div>
</div>
<style>
  #sample-map-panel {{
    position: absolute; top: 16px; right: 56px; z-index: 1000;
    width: 280px; padding: 14px 16px;
    background: rgba(36, 39, 48, 0.92); color: #f7f7f7;
    font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 12px; border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  }}
  #sample-map-panel .smp-header {{ font-size: 14px; font-weight: 600; margin-bottom: 2px; }}
  #sample-map-panel .smp-sub {{ font-size: 11px; color: #a0a7b4; }}
  #sample-map-panel .smp-divider {{ height: 1px; background: #3a3f4b; margin: 10px 0; }}
  #sample-map-panel .smp-stats {{ display: flex; justify-content: space-between; }}
  #sample-map-panel .smp-stat {{ display: flex; flex-direction: column; }}
  #sample-map-panel .smp-stat-num {{ font-size: 16px; font-weight: 600; color: #fff; }}
  #sample-map-panel .smp-stat-lbl {{ font-size: 10px; color: #a0a7b4; text-transform: uppercase; letter-spacing: 0.5px; }}
  #sample-map-panel .lisa-row {{ display: flex; align-items: center; padding: 3px 0; }}
  #sample-map-panel .lisa-swatch {{ width: 12px; height: 12px; margin-right: 8px; border-radius: 2px; flex: 0 0 auto; }}
  #sample-map-panel .lisa-label {{ flex: 1; color: #e0e2e7; }}
  #sample-map-panel .lisa-count {{ color: #a0a7b4; font-variant-numeric: tabular-nums; }}
</style>
"""

with open("out.html", "r", encoding="utf-8") as f:
    html = f.read()
html = html.replace("</body>", panel_html + "\n</body>")
with open("out.html", "w", encoding="utf-8") as f:
    f.write(html)
```

## Notes

- Use `position: absolute` (not `fixed`) so the panel stays inside the map container when the page is scrolled.
- For a light-theme map (`theme='light'`), swap the background to `rgba(255,255,255,0.95)` and text colors to dark greys.
- Keep the width ≤ 320px to avoid overlapping the kepler.gl side panel when it is open.
- This overlay is static HTML — it does not react to filter state or layer toggles. For dynamic behavior, subscribe to the redux store on `window` in the exported JS.
