# SPDX-License-Identifier: MIT
# Copyright contributors to the kepler.gl project

"""Widget tests."""

import json
from pathlib import Path
import subprocess

import pytest
from keplergl import KeplerGl


def test_widget_creation():
    widget = KeplerGl()
    assert widget.height == 400
    assert widget.data == {}
    assert widget.config == {}


def test_widget_with_height():
    widget = KeplerGl(height=600)
    assert widget.height == 600


def test_widget_with_dataframe(sample_df):
    widget = KeplerGl(data={"cities": sample_df})
    assert "cities" in widget.data


def test_widget_with_geodataframe(sample_gdf):
    widget = KeplerGl(data={"points": sample_gdf})
    assert "points" in widget.data


def test_add_data(sample_df):
    widget = KeplerGl()
    widget.add_data(sample_df, name="test")
    assert "test" in widget.data


def test_widget_with_config():
    config = {"version": "v1", "config": {"mapState": {"zoom": 10}}}
    widget = KeplerGl(config=config)
    assert widget.config == config


def test_widget_use_arrow_default():
    widget = KeplerGl()
    assert widget._use_arrow is False


def test_widget_use_arrow_enabled():
    widget = KeplerGl(use_arrow=True)
    assert widget._use_arrow is True


def test_widget_use_arrow_with_dataframe(sample_df):
    widget = KeplerGl(data={"test": sample_df}, use_arrow=True)
    assert "test" in widget.data
    assert widget._use_arrow is True


def test_add_data_use_arrow(sample_df):
    widget = KeplerGl()
    assert widget._use_arrow is False
    widget.add_data(sample_df, name="test", use_arrow=True)
    assert "test" in widget.data
    assert widget._use_arrow is True


def test_add_data_use_arrow_none_preserves_widget_setting(sample_df):
    widget = KeplerGl(use_arrow=True)
    widget.add_data(sample_df, name="test")
    assert widget._use_arrow is True


def test_widget_default_mapbox_token():
    widget = KeplerGl()
    assert widget.mapbox_token == ""


def test_widget_mapbox_token_stored():
    widget = KeplerGl(mapbox_token="pk.abc123")
    assert widget.mapbox_token == "pk.abc123"


def test_widget_default_theme():
    widget = KeplerGl()
    assert widget.theme == ""


def test_widget_theme_stored():
    widget = KeplerGl(theme="light")
    assert widget.theme == "light"


def test_widget_default_app_name():
    widget = KeplerGl()
    assert widget.app_name == "kepler.gl"


def test_widget_app_name_stored():
    widget = KeplerGl(app_name="My Dashboard")
    assert widget.app_name == "My Dashboard"


def test_widget_show_docs_compat():
    """show_docs is a deprecated no-op; should not raise."""
    KeplerGl(show_docs=True)


def test_add_data_replaces_existing(sample_df):
    import pandas as pd
    widget = KeplerGl(data={"cities": sample_df})
    new_df = pd.DataFrame({"x": [99]})
    widget.add_data(new_df, name="cities")
    assert "cities" in widget.data
    # Serialized data should reflect the new single-column DataFrame, not the
    # original two-column one.
    from keplergl.serializers import serialize_dataset
    stored = serialize_dataset(widget.data["cities"], "cities")
    assert stored["data"]["columns"] == ["x"]


def test_init_with_multiple_datasets(sample_df, sample_gdf):
    widget = KeplerGl(data={"tab": sample_df, "geo": sample_gdf})
    assert "tab" in widget.data
    assert "geo" in widget.data


def test_add_data_does_not_remove_existing(sample_df):
    import pandas as pd
    widget = KeplerGl(data={"first": sample_df})
    widget.add_data(pd.DataFrame({"x": [1]}), name="second")
    assert "first" in widget.data
    assert "second" in widget.data


def _run_widget_javascript(dependency, source, data=None):
    """Execute browser-bundled code using the widget's npm tree, not root aliases."""
    result = subprocess.run(
        ["node", "--input-type=module", "-e", """
            import {readFileSync} from 'node:fs';
            import {createRequire} from 'node:module';
            import path from 'node:path';
            import {build} from 'esbuild';

            const request = JSON.parse(readFileSync(0, 'utf8'));
            const require = createRequire(path.join(process.cwd(), 'package.json'));
            const entry = require.resolve(request.dependency);
            if (!entry.startsWith(path.join(process.cwd(), 'node_modules') + path.sep)) {
                throw new Error('Run npm ci in bindings/python before widget runtime tests');
            }
            const {outputFiles} = await build({
                stdin: {contents: request.source, resolveDir: path.dirname(entry)},
                bundle: true,
                platform: 'browser',
                format: 'esm',
                target: ['es2020'],
                define: {global: 'globalThis'},
                write: false
            });
            const url = 'data:text/javascript;base64,' +
                Buffer.from(outputFiles[0].contents).toString('base64');
            const {run} = await import(url);
            console.log(JSON.stringify(await run(request.data)));
        """],
        cwd=Path(__file__).resolve().parents[1],
        input=json.dumps({"dependency": dependency, "source": source, "data": data}),
        capture_output=True,
        text=True,
        timeout=30,
    )
    assert result.returncode == 0, result.stderr
    return json.loads(result.stdout)


def test_widget_hubble_color_interpolation():
    # Resolve from Hubble so this exercises its older constants, D3 Interpolate,
    # and D3 Scale Chromatic with the overridden D3 Color 3 installation.
    result = _run_widget_javascript("@hubble.gl/react", """
        import {KEPLER_COLOR_PALETTES} from '@kepler.gl/constants/dist/color-palettes.js';
        import {interpolateRgb} from 'd3-interpolate';
        import {rgb} from 'd3-color';

        export function run() {
            const palette = KEPLER_COLOR_PALETTES.find(p => p.name === 'Blues');
            const interpolate = interpolateRgb('rgba(255,0,0,0.25)', 'rgba(0,0,255,0.75)');
            return {
                colors: palette.colors(3),
                empty: palette.colors(0),
                rgba: [0, 0.5, 1].map(t => {
                    const color = rgb(interpolate(t));
                    return [color.r, color.g, color.b, color.opacity];
                })
            };
        }
    """)
    assert result["rgba"] == [[255, 0, 0, 0.25], [128, 0, 128, 0.5], [0, 0, 255, 0.75]]
    assert len(result["colors"]) == 3
    assert result["colors"][0] == "#F7FBFF"
    assert result["colors"][-1] == "#08306B"
    assert result["colors"][1] not in (result["colors"][0], result["colors"][-1])
    assert result["empty"] == []


@pytest.mark.parametrize("loader_import", [
    "import {ParquetJSLoader} from '@loaders.gl/parquet/parquet-js-loader';",
    "const {ParquetJSLoader} = require('./index.cjs');",
], ids=["esm", "commonjs"])
def test_widget_parquet_decoding(loader_import):
    import pyarrow as pa
    import pyarrow.parquet as pq

    # Use an independent writer, multiple row groups, compression, and nullable
    # fields to exercise Thrift metadata/page decoding rather than just imports.
    table = pa.table({
        "id": pa.array([1, 2, 3], type=pa.int32()),
        "name": pa.array(["Kyiv", "東京", None], type=pa.string()),
        "value": pa.array([1.25, None, -2.5], type=pa.float64()),
        "active": pa.array([True, False, True], type=pa.bool_()),
    })
    output = pa.BufferOutputStream()
    pq.write_table(table, output, compression="snappy", row_group_size=2, use_dictionary=False)
    result = _run_widget_javascript("@loaders.gl/parquet", loader_import + """
        export async function run(bytes) {
            // Select the JS backend explicitly: the WASM backend bypasses Thrift.
            const table = await ParquetJSLoader.parse(Uint8Array.from(bytes).buffer);
            return {
                shape: table.shape,
                rows: table.data.map(row => ({
                    id: row.id,
                    name: row.name ?? null,
                    value: row.value ?? null,
                    active: row.active
                }))
            };
        }
    """, list(output.getvalue().to_pybytes()))
    assert result["shape"] == "object-row-table"
    assert result["rows"] == table.to_pylist()

