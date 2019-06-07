- To release a new version of keplergl_jupyter on PyPI:

Update _version.py (set release version, remove 'dev')
git add the _version.py file and git commit
change version in first_widget/_version.py
`rm -r dist`
`python setup.py sdist`
`twine upload dist/*`

Update _version.py (add 'dev' and increment minor)
git add and git commit
git push
git push --tags

- To release a new version of keplergl-jupyter on NPM:

```
# clean out the `dist` and `node_modules` directories
git clean -fdx
npm install
npm publish
```
