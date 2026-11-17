// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const {execFileSync} = require('child_process');
const path = require('path');

const usage = 'Usage: yarn release:check';
const args = process.argv.slice(2);
const checks = [
  {
    name: 'Workspace packages',
    args: ['--workspaces', '--include-workspace-root=false', '--access', 'public']
  },
  {name: 'Root bundle', args: ['--workspaces=false']}
];

if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
  console.log(usage);
  console.log('Runs workspace and bundle publish dry runs, stopping on the first failure.');
} else if (args.length) {
  console.error(usage);
  process.exitCode = 1;
} else {
  let currentCheck;
  try {
    for (const check of checks) {
      currentCheck = check.name;
      console.log(`Checking ${currentCheck}...`);
      // Fixed flags keep this command a dry run and ensure release builds execute.
      execFileSync(
        'npm',
        ['publish', ...check.args, '--tag', 'latest', '--dry-run', '--ignore-scripts=false'],
        {cwd: path.resolve(__dirname, '..'), stdio: 'inherit'}
      );
    }
    console.log('Both release dry runs passed.');
  } catch (error) {
    console.error(`${currentCheck} dry run failed: ${error.message}`);
    process.exitCode = error.status || 1;
  }
}
