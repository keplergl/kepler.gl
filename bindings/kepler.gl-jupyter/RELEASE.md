# Kepler.gl Jupyter Releases

## Release a new version

To release a new version. You need publish both the js module in NPM and the python module on PyPI.

__Version number of the js module **`kelergl-jupyter`** and the python module **`keplergl`** should match__

### To release a new version of keplergl-jupyter on NPM:

- Go to the js folder
```
npm version patch | minor | major
git commit -am "keplergl-jupyter@<version>"
npm login
npm publish
```

### To release a new version of keplergl on PyPI:

- Update `version_info` in  keplergl/_version.py. in bindings/kepler.gl-jupyter folder. Update `EXTENSION_SPEC_VERSION` to match the js module version

```
git add keplergl/_version.py
git commit -am "keplergl==<version>"
```

- Remove dist, build and upload to PyPI
```
rm -r dist
python setup.py sdist
twine upload dist/*
```

### add tags
```
git tag -a <version>-jupyter -m "<version>-jupyter
git push origin master && git push origin <version>-jupyter
```
