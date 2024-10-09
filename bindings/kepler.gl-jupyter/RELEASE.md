# Kepler.gl Jupyter Releases

## Release a new version

When release a new version, the `keplergl-jupyter` js module will be published on NPM and the `keplergl` python module will be published on PyPI.

NOTE: __Version number of the js module **`kelergl-jupyter`** and the python module **`keplergl`** should match__

### Step1:

Update `version_info` in keplergl/_version.py in bindings/kepler.gl-jupyter folder.
Update `"version": "0.x.x"` to match the version info in js/package.json in bindings/kepler.gl-jupyter folder.
Update `EXTENSION_SPEC_VERSION` to match the js module version. Update `version` in js/package

```
git add keplergl/_version.py
git add js/package.json
git commit -am "keplergl==<version>"
```


### Step2:

Create a tag: `<version>-jupyter` e.g. v0.3.4-jupyter

```
git tag -a <version>-jupyter -m "<version>-jupyter"
git push origin master && git push origin <version>-jupyter
```

The new tag will trigger the Github Action `build-publish-pypi.yml`: __"Build KeplerGL Python and NPM packages"__. The packages will be built and tested, then published to NPM and PyPI using the secret tokens.

### Step3:

For conda-forge release, please use the repo: https://github.com/conda-forge/keplergl-feedstock

The new version should be automatically picked and built from PyPi by conda-forge. If you want to submit a manual build:

Edit `meta.yaml` under directory `recipes/`:

* Update the version number

```python
{% set version = "0.3.0" %}
```

* Update the sha256 value of the latest tarball in PyPi that is published in Step2.

```python
source:
  url: https://pypi.io/packages/source/{{ name[0] }}/{{ name }}/{{ name }}-{{ version }}.tar.gz
  sha256: cb21047b2104413af1c00ef1ac75794a19e0b578e51c69c86713911d97370167
```

* Create a pull request and wait for checking from conda-forge team.
