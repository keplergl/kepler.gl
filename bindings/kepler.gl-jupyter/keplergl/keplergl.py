import ipywidgets as widgets
from pkg_resources import resource_string
from traitlets import Unicode, Dict, Int, validate, TraitError
import pandas as pd
import geopandas
import shapely.wkt
import json

documentation = 'https://github.com/keplergl/kepler.gl/blob/master/docs/keplergl-jupyter/user-guide.md'
def _df_to_dict(df):
    ''' Create an input dict for Kepler.gl using a DataFrame object

    Inputs:
    - df: a DataFrame object

    Returns:
    - dictionary: a dictionary variable that can be used in Kepler.gl

    '''
    return df.to_dict('split')

def _gdf_to_dict(gdf):
    ''' Create an input dict for kepler.gl using a GeoDataFrame object

    Inputs:
    - gdf: a GeoDataFrame object

    Returns:
    - dictionary: a dictionary variable that can be used in Kepler.gl
    '''

    # get name of the geometry column
    # will cause error if data frame has no geometry column
    name = gdf.geometry.name

    copy = gdf.copy()
    # convert it to wkt
    copy[name] = copy.geometry.apply(lambda x: shapely.wkt.dumps(x))

    return _df_to_dict(copy)

def _normalize_data(data):
    if isinstance(data, pd.DataFrame):
        return _gdf_to_dict(data) if isinstance(data, geopandas.GeoDataFrame) else _df_to_dict(data)
    return data

def data_to_json(data, manager):
    '''Serialize a Python date object.
    Attributes of this dictionary are to be passed to the JavaScript side.
    '''

    if data is None:
        return None
    else:
        if type(data) is not dict:
            print(data)
            raise Exception('data type incorrect expecting a dictionary mapping from data id to value, but got {}'.format(type(data)))
            return None
        else:
            dataset = {}
            for key, value in data.items():
                normalized = _normalize_data(value)
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
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)
    value = Unicode('Hello World!').tag(sync=True)

    data = Dict({}).tag(sync=True, **data_serialization)
    config = Dict({}).tag(sync=True)
    height = Int(400).tag(sync=True)

    def __init__(self, **kwargs):
        super(KeplerGl, self).__init__(**kwargs)
        print('User Guide: {}'.format(documentation))

    @validate('data')
    def _validate_data(self, proposal):
        '''Validate data input.

        Makes sure data is a dict, and each value should be either a df, a geojson dictionary / string or csv string
        layers list.
        '''

        if type(proposal.value) is not dict:
            raise DataException('[data type error]: Expecting a dictionary mapping from id to value, but got {}'.format(type(proposal.value)))

        else:
            for key, value in proposal.value.items():
                if not isinstance(value, pd.DataFrame) and (type(value) is not str) and (type(value) is not dict):
                     raise DataException('[data type error]: value of {} should be a DataFrame, a Geojson Dictionary or String, a csv String, but got {}'.format(key, type(value)))

        return proposal.value

    def add_data(self, data, name="unnamed"):
        ''' Send data to Voyager

        Inputs:
        - data string, can be a csv string or json string
        - name string

        Example of use:
            keplergl.add_data(data_string, name="data_1")
        '''

        normalized = _normalize_data(data)
        copy = self.data.copy()
        copy.update({name: normalized})

        self.data = copy

    def save_to_html(self, data=None, config=None, file_name='keplergl_map.html', read_only=False):
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
        keplergl_html = resource_string(__name__, 'static/keplergl.html').decode('utf-8')
        # find open of body
        k = keplergl_html.find("<body>")

        data_to_add = self.data if data == None else data_to_json(data, None)
        config_to_add = self.config if config == None else config

        # type()
        # print (type(data_to_add))
        keplergl_data = json.dumps({"config": config_to_add, "data": data_to_add, "options": {"readOnly": read_only}})

        cmd = """window.__keplerglDataConfig = {};""".format(keplergl_data)
        frame_txt = keplergl_html[:k] + "<body><script>" + cmd + "</script>" + keplergl_html[k+6:]

        with open(file_name,'wb') as f:
            f.write(frame_txt.encode('utf-8'))

        print("Map saved to {}!".format(file_name))
