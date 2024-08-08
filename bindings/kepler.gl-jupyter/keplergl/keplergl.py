# SPDX-License-Identifier: MIT
# Copyright contributors to the kepler.gl project

#module for keplergl-jupyter
import base64
import sys
import json
import ipywidgets as widgets
from pkg_resources import resource_string
from traitlets import Unicode, Dict, Int, validate, TraitError
import pandas as pd
import geopandas
import pyarrow
import geoarrow.pyarrow as ga
import geoarrow.pandas as _
import shapely.wkt
from ._version import EXTENSION_SPEC_VERSION

documentation = 'https://docs.kepler.gl/docs/keplergl-jupyter'

# global variable use_arrow, which can be set by parameter use_arrow in KeplerGl
g_use_arrow = False

def _arrow_table_to_base64(arrow_table):
    '''Convert an arrow table to a base64 string'''
    batches = arrow_table.to_batches()
    sink = pyarrow.BufferOutputStream()
    writer = pyarrow.ipc.new_stream(sink, arrow_table.schema)
    for batch in batches:
        writer.write_batch(batch)
    arrow_buf = sink.getvalue()

    # TODO: we could send the bytes directly to the frontend using traitlets.Bytes
    base64_string = base64.b64encode(arrow_buf.to_pybytes()).decode()

    return base64_string

def _df_to_dict(df):
    ''' Create an input dict for Kepler.gl using a DataFrame object

    Inputs:
    - df: a DataFrame object

    Returns:
    - dictionary: a dictionary variable that can be used in Kepler.gl

    '''
    return df.to_dict('split')


def _df_to_arrow(df: pd.DataFrame):
    ''' Create an arrow base64string for Kepler.gl using a DataFrame object

    Inputs:
    - df: a DataFrame object

    Returns:
    - string: a base64 string that can be used in Kepler.gl
    '''
    arrow_table = pyarrow.Table.from_pandas(df)
    base64_string = _arrow_table_to_base64(arrow_table)

    return base64_string

def _gdf_to_dict(gdf):
    ''' Create an input dict for kepler.gl using a GeoDataFrame object

    Inputs:
    - gdf: a GeoDataFrame object

    Returns:
    - dictionary: a dictionary variable that can be used in Kepler.gl
    '''
    # reproject to 4326 if needed
    if gdf.crs and not gdf.crs == 4326:
        gdf = gdf.to_crs(4326)

    # get name of the geometry column
    # will cause error if data frame has no geometry column
    name = gdf.geometry.name

    # convert geodataframe to dataframe
    df = pd.DataFrame(gdf)
    # convert geometry to wkt
    df[name] = df.geometry.apply(lambda x: shapely.wkt.dumps(x))
    #  df[name] = shapely.wkt.dumps(df.geometry)

    return _df_to_dict(df)


def _gdf_to_arrow(gdf):
    ''' Create an arrow base64string for Kepler.gl using a GeoDataFrame object'''
    # reproject to 4326 if needed
    if gdf.crs and not gdf.crs == 4326:
        gdf = gdf.to_crs(4326)

    # get name of the geometry column
    # will cause error if data frame has no geometry column
    name = gdf.geometry.name

    array = ga.as_geoarrow(gdf.geometry, coord_type=ga.CoordType.INTERLEAVED)

    table = pyarrow.Table.from_pandas(gdf.drop(columns=[name]))
    arrow_table = table.append_column(name, array)
    base64_string = _arrow_table_to_base64(arrow_table)

    return base64_string


def _normalize_data(data, use_arrow=False):
    if isinstance(data, pd.DataFrame):
        if use_arrow:
            return _gdf_to_arrow(data) if isinstance(data, geopandas.GeoDataFrame) else _df_to_arrow(data)
        else:
            return _gdf_to_dict(data) if isinstance(data, geopandas.GeoDataFrame) else _df_to_dict(data)
    return data


def data_to_json(data, manager):
    '''Serialize a Python data object.
    Attributes of this dictionary are to be passed to the JavaScript side.
    '''
    if data is None:
        return None
    else:
        if not isinstance(data, dict):
            print(data)
            raise TraitError(
                f"data type incorrect expecting a dictionary mapping from data id to value, but got {type(data)}")
        else:
            dataset = {}
            # use g_use_arrow to determine if we should use arrow
            for key, value in data.items():
                normalized = _normalize_data(value, g_use_arrow)
                dataset.update({key: normalized})

            return dataset


def data_from_json(js, manager):
    '''Deserialize a Javascript date.'''
    return js


data_serialization = {
    'from_json': data_from_json,
    'to_json': data_to_json
}


class TraitError(Exception):
    pass


class DataException(TraitError):
    pass


@widgets.register
class KeplerGl(widgets.DOMWidget):
    """An example widget."""
    _view_name = Unicode('KeplerGlView').tag(sync=True)
    _model_name = Unicode('KeplerGlModal').tag(sync=True)
    _view_module = Unicode('keplergl-jupyter').tag(sync=True)
    _model_module = Unicode('keplergl-jupyter').tag(sync=True)
    _view_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)
    _model_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)

    # Attributes
    value = Unicode('Hello World!').tag(sync=True)
    data = Dict({}).tag(sync=True, **data_serialization)
    config = Dict({}).tag(sync=True)
    height = Int(400).tag(sync=True)

    def __init__(self, **kwargs):
        if 'show_docs' not in kwargs:
            kwargs['show_docs'] = True
        if kwargs['show_docs']:
            print(f"User Guide: {documentation}")
        kwargs.pop('show_docs')
        # assign use_arrow to global variable
        global g_use_arrow
        g_use_arrow = kwargs.get('use_arrow', False)

        super(KeplerGl, self).__init__(**kwargs)

    @validate('data')
    def _validate_data(self, proposal):
        '''Validate data input (return from data_to_json)

        Makes sure data is a dict, and each value should be either a df, a geojson dictionary / string or csv string
        layers list.
        '''

        if not isinstance(proposal.value, dict):
            raise DataException(f"[data type error]: Expecting a dictionary mapping from id to value, but got {type(proposal.value)}")
        else:
            for key, value in proposal.value.items():
                if not isinstance(value, pd.DataFrame) and not isinstance(value, str) and not isinstance(value, dict):
                    raise DataException(f"[data type error]: value of {key} should be a DataFrame, a Geojson Dictionary or String, a csv String, but got {type(value)}")

        return proposal.value

    def add_data(self, data, name="unnamed", use_arrow=False):
        ''' Send data to Voyager

        Inputs:
        - data string, can be a csv string or json string
        - name string

        Example of use:
            keplergl.add_data(data_string, name="data_1")
        '''
        copy = self.data.copy()

        # assume data is a GeoJSON or CSV string, convert it to arrow if use_arrow is True
        if use_arrow:
            global g_use_arrow
            g_use_arrow = use_arrow
            try:
                gdf = geopandas.read_file(data, driver='GeoJSON')
                copy.update({name: gdf})
            except Exception:
                # if it fails, assume it is a csv string
                # load csv string to a dataframe
                df = pd.read_csv(data)
                copy.update({name: df})

        self.data = copy

    def show(self, data=None, config=None, read_only=False, center_map=False):
        ''' Display current map in Google Colab

        Inputs:
        - data: a data dictionary {"name": data}, if not provided, will use current map data
        - config: map config dictionary, if not provided, will use current map config
        - read_only: if read_only is True, hide side panel to disable map customization
        - center_map: if center_map is True, the bound of the map will be updated acoording to the current map data

        Example of use:
            # this will display map in Google Colab
            from keplergl import KeplerGL
            map1 = KeplerGL()
            map1.show()

        '''
        keplergl_html = resource_string(
            __name__, 'static/keplergl.html').decode('utf-8')
        # find open of body
        k = keplergl_html.find("<body>")

        data_to_add = data_to_json(self.data if data is None else data, None)

        config_to_add = self.config if config is None else config

        keplergl_data = json.dumps({"config": config_to_add, "data": data_to_add, "options": {
                                   "readOnly": read_only, "centerMap": center_map}})

        cmd = f"window.__keplerglDataConfig = {keplergl_data};"
        frame_txt = keplergl_html[:k] + "<body><script>" + \
            cmd + "</script>" + keplergl_html[k+6:]

        if "google.colab" in sys.modules:
            from IPython.display import HTML, Javascript
            display(HTML(frame_txt))
            display(Javascript(
                f"google.colab.output.setIframeHeight('{self.height}');"))

    def _repr_html_(self, data=None, config=None, read_only=False, center_map=False):
        ''' Return current map in an html encoded string

        Inputs:
        - data: a data dictionary {"name": data}, if not provided, will use current map data
        - config: map config dictionary, if not provided, will use current map config
        - read_only: if read_only is True, hide side panel to disable map customization
        - center_map: if center_map is True, the bound of the map will be updated acoording to the current map data

        Returns:
        - a html encoded string

        Example of use:
            # this will save map with provided data and config
            keplergl._repr_html_(data={"data_1": df}, config=config)

            # this will save current map
            keplergl._repr_html_()

        '''
        keplergl_html = resource_string(
            __name__, 'static/keplergl.html').decode('utf-8')
        # find open of body
        k = keplergl_html.find("<body>")

        data_to_add = data_to_json(self.data if data is None else data, None)
        config_to_add = self.config if config is None else config

        # for key in data_to_add:
        #     print(type(data_to_add[key]))

        keplergl_data = json.dumps({"config": config_to_add, "data": data_to_add, "options": {
                                   "readOnly": read_only, "centerMap": center_map}})

        cmd = f"window.__keplerglDataConfig = {keplergl_data};"
        frame_txt = keplergl_html[:k] + "<body><script>" + \
            cmd + "</script>" + keplergl_html[k+6:]

        return frame_txt.encode('utf-8')

    def save_to_html(self, data=None, config=None, file_name='keplergl_map.html', read_only=False, center_map=False):
        ''' Save current map to an interactive html

        Inputs:
        - data: a data dictionary {"name": data}, if not provided, will use current map data
        - config: map config dictionary, if not provided, will use current map config
        - file_name: the html file name, default is keplergl_map.html
        - read_only: if read_only is True, hide side panel to disable map customization

        Returns:
        - an html file will be saved to your notebook

        Example of use:
            # this will save map with provided data and config
            keplergl.save_to_html(data={"data_1": df}, config=config, file_name='first_map.html')

            # this will save current map
            keplergl.save_to_html(file_name='first_map.html')

        '''
        frame_txt = self._repr_html_(
            data=data, config=config, read_only=read_only, center_map=center_map)

        with open(file_name, 'wb') as f:
            f.write(frame_txt)

        print(f"Map saved to {file_name}!")
