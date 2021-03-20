// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

const fs = require("fs");
const assert = require("assert").strict;
const path = require("path");

const { returnSmooshed } = require("./smoosh");

const args = process.argv.slice(2);

const dirs = args.length > 0 ? args : fs.readdirSync("./tests").map(f => `./tests/${f}`);

dirs.forEach((dir) => {
  const files = fs.readdirSync(dir);

  files
    .filter((file) => file.endsWith(".js"))
    .map((file) => file.substr(0, file.length - 3))
    .forEach((file) => {
      const fullFile = path.resolve(dir, file);
      console.log(`Testing ${fullFile}.js`);
      const smooshed = returnSmooshed(fullFile);

      const target = fs.readFileSync(fullFile + ".tsx", "utf8");
      assert.equal(smooshed, target);
    });
});

console.log("Done");
