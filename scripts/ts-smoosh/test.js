// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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
