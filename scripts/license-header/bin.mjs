// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Forked from uber-licence, MIT

import readdirp from 'readdirp';
import minimist from 'minimist';
import {readFileSync} from 'fs';
import process from 'global/process.js';
import console from 'global/console.js';

import LicenseFixer from './license-fixer.mjs';

var argv = minimist(process.argv.slice(2));
var cwd = process.cwd();

/*eslint no-process-exit: 0, no-console: 0*/
// jscs:disable maximumLineLength
if (argv.help || argv.h) {
    console.log('license-header');
    console.log('  ');
    console.log('  This binary will add a license to the top');
    console.log('  of all your files');
    console.log('');
    console.log('  Options:');
    console.log('    --dry      does not write to files');
    console.log('    --file     pattern of files to modify');
    console.log('    --dir      pattern for directories containing files');
    console.log('    --license  intended license (file)');
    console.log('    --legacy   licenses to replace');
    console.log('    --verbose  log skipped and empty files');
    console.log('    --silent   do not log fixed files');
    process.exit(0);
}

var fileFilter = ['*.js', '*.ts', '*.tsx', '*.mjs', '*.py'];
if (typeof argv.file === 'string') {
    fileFilter = [argv.file];
} else if (Array.isArray(argv.file)) {
    fileFilter = argv.file;
}

var directoryFilter = ['!.git', '!node_modules', '!coverage', '!env', '!.tox', '!vendor', '!Godeps', '!dist'];
if (typeof argv.dir === 'string') {
    directoryFilter = [argv.dir];
} else if (Array.isArray(argv.dir)) {
    directoryFilter = argv.dir;
}

var licenses = null;

if (typeof argv.license === 'string') {
    licenses = licenses || [];
    licenses.push(argv.license);
} else if (Array.isArray(argv.license)) {
    licenses = licenses || [];
    Array.prototype.push.apply(licenses, argv.license);
}

if (typeof argv.legacy === 'string') {
    licenses = licenses || [];
    licenses.push(argv.legacy);
} else if (Array.isArray(argv.legacy)) {
    licenses = licenses || [];
    Array.prototype.push.apply(licenses, argv.legacy);
}

if (licenses) {
    for (var i = 0; i < licenses.length; i++) {
        // Replace file names with content of files
        licenses[i] = readFileSync(licenses[i], 'utf8');
    }
} else {
    console.error('no license provided');
    process.exit(1);
}

var licenseFixer = new LicenseFixer({
    dry: argv.dry,
    silent: argv.silent,
    verbose: argv.verbose
});

// Set the intended license text
licenseFixer.setLicense(licenses[0]);
// Add a license to match and replace.
// There can be multiple recognized licenses, for migration purposes.
for (var i = 0; i < licenses.length; i++) {
    licenseFixer.addLicense(licenses[i]);
}

readTree({
    root: cwd,
    fileFilter: fileFilter,
    directoryFilter: directoryFilter
}, processFiles);

function readTree(options, callback) {
    var stream = readdirp(options);
    var files = [];
    stream.on('data', onData);
    stream.on('end', onEnd);
    stream.on('error', onEnd);
    function onData(event) {
        files.push(event.path);
    }
    function onEnd(err) {
        callback(err, files);
    }
}

function processFiles(err, files) {
    if (err) {
        console.error(err.message);
        process.exit(1);
        return;
    }

    var fixed = 0;
    for (var filesIndex = 0; filesIndex < files.length; filesIndex++) {
        var file = files[filesIndex];
        fixed = fixed + licenseFixer.fixFile(file);
    }

    if (argv.dry) {
        process.exit(fixed);
    } else {
        process.exit(0);
    }
}
