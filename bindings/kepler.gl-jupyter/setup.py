# SPDX-License-Identifier: MIT
# Copyright contributors to the kepler.gl project

from __future__ import print_function
from distutils import log
from setuptools import setup, find_packages
import os

from jupyter_packaging import (
    create_cmdclass,
    install_npm,
    ensure_targets,
    combine_commands,
    get_version,
    skip_if_exists
)

# Name of the project
name = 'keplergl'

here = os.path.dirname(os.path.abspath(__file__))
long_description = 'Keplergl Jupyter Extension'

log.info('setup.py entered')
log.info('$PATH=%s' % os.environ['PATH'])

# Get version
version = get_version(os.path.join(name, '_version.py'))

js_dir = os.path.join(here, 'js')

# Representative files that should exist after a successful build
jstargets = [
    os.path.join('keplergl', 'static', 'index.js'),
    os.path.join('keplergl-jupyter', 'labextension', 'package.json'),
]

data_files_spec = [
    ('share/jupyter/nbextensions/keplergl-jupyter',
     'keplergl/static', '**'),
    ('share/jupyter/labextensions/keplergl-jupyter',
     'keplergl-jupyter/labextension', "**"),
    ('etc/jupyter/nbconfig/notebook.d', '.', 'keplergl-jupyter.json'),
]

cmdclass = create_cmdclass('jsdeps', data_files_spec=data_files_spec)
js_command = combine_commands(
    install_npm(js_dir, npm=["yarn"], build_cmd='build'), ensure_targets(jstargets),
)

is_repo = os.path.exists(os.path.join(here, '.git'))
if is_repo:
    cmdclass['jsdeps'] = js_command
else:
    cmdclass['jsdeps'] = skip_if_exists(jstargets, js_command)


LONG_DESCRIPTION = 'A jupyter widget for kepler.gl, an advanced geospatial visualization tool, to render large-scale interactive maps.'

setup_args = {
    'name': 'keplergl',
    'version': version,
    'description': 'This is a simple jupyter widget for kepler.gl, an advanced geospatial visualization tool, to render large-scale interactive maps.',
    'long_description': LONG_DESCRIPTION,
    'include_package_data': True,
    'install_requires': [
        'ipywidgets>=7.8.1,<8',
        'traittypes>=0.2.1',
        'traitlets>=4.3.2',
        'geopandas>=0.14.3',
        'Shapely>=1.6.4.post2',
        'jupyter_packaging>=0.12.3',
        'jupyter>=1.0.0',
        'jupyterlab>=4.1.6',
        'notebook>=6.0.1',
        'pyarrow>=16.0.0',
        'geoarrow-pyarrow>=0.1.2',
        'geoarrow-pandas>=0.1.1',
    ],
    'packages': find_packages(),
    'zip_safe': False,
    'cmdclass': cmdclass,
    'author': 'Shan He',
    'author_email': 'shan@uber.com',
    'url': 'https://github.com/keplergl/kepler.gl/tree/master/bindings/kepler.gl-jupyter',
    'keywords': [
        'ipython',
        'jupyter',
        'widgets',
        'geospatial',
        'visualization',
        'webGL'
    ],
    'classifiers': [
        'Development Status :: 4 - Beta',
        'Framework :: IPython',
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'Topic :: Multimedia :: Graphics',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
    ],
}

setup(**setup_args)
