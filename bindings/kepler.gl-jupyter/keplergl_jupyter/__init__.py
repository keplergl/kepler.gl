from ._version import version_info, __version__

from .keplergl_jupyter import *

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'keplergl-jupyter',
        'require': 'keplergl-jupyter/extension'
    }]
