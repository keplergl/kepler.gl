# SPDX-License-Identifier: MIT
# Copyright contributors to the kepler.gl project

version_info = (0, 3, 7, 'final', 0)

_specifier_ = {'alpha': 'a', 'beta': 'b', 'candidate': 'rc', 'final': ''}

major, minor, patch, release, serial = version_info
__version__ = '%s.%s.%s%s'%(major, minor, patch,
  '' if release=='final' else '-' + _specifier_[release]+str(serial))
# The version of the attribute spec that this package
# implements. This is the value used in
# _model_module_version/_view_module_version.
#
# Update this value when attributes are added/removed from
# the widget models, or if the serialized format changes.
#
# The major version needs to match that of the JS package.
# Note: this follows the semver format, which is used to match the JS package version in keplergl-plugin.js
EXTENSION_SPEC_VERSION = '0.3.7'
