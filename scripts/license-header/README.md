Utility to add license header to your files.

Forked from [uber-licence](https://github.com/uber/uber-licence).

Running the `license-header` binary adds licencing information to every javascript file in your project.

You can run `license-header --dry` where it does not mutate any files and instead outputs the number of files it would change.

You can use `--file` and `--dir` to specify your own file and directory filters to select source files to consider.

## Recommended usage

```
// package.json
{
  "scripts": {
    "check-license": "license-header --dry",
    "add-license": "license-header"
  },
  "devDependencies": {
    "minimist": "^1.1.0",
    "readdirp": "^2.1.0",
    "pre-commit": "0.0.9"
  },
  "pre-commit": [
    "test",
    "check-license"
  ],
  "pre-commit.silent": true
}
```

Add missing headers.

```bash
yarn run babel-node ./scripts/license-header/bin
```

Migrate to a new header.

```bash
yarn run babel-node ./scripts/license-header/bin --license ./scripts/license-header/FILE-HEADER --legacy ./LICENSE
```

