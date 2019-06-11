from ._version import version_info, __version__

from .keplergl import *

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'keplergl-jupyter',
        'require': 'keplergl-jupyter/extension'
    }]
