## TS Smoosh

Combine type decls with related source files.


# Use

Given a JavaScript file (or list of files) like so:

```
$ node ts-smoosh/bin ./src/some-file.js
```

Will produce `.jsx` files using nearby `.d.ts` files.


# Running Tests

```
$ node test
```

Test cases live in various directories in `./tests`. Tests run by comparing the output against golden master `.tsx` files. To update the masters, run `node ts-smoosh/bin ./test/0X-dir/somefile.js`.

# Notes

Here are articles and docs I that were helpful when writing this script.

- [Using the Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- [Blog post about using TS's parser directly](https://medium.com/allenhwkim/how-to-parse-typescript-from-source-643387971f4e)
- [TypeScript compiler APIs revisited](https://blog.scottlogic.com/2017/05/02/typescript-compiler-api-revisited.html)
- [TypeScript API Playground on Glitch](https://typescript-api-playground.glitch.me/#example=Transformation%203)
