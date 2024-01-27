// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Forked from uber-licence, MIT

import {readFileSync, writeFileSync} from 'fs';
import console from 'global/console.js';

function LicenseFixer(options) {
    options = options || {};
    this.slashLicense = null;
    this.hashLicense = null;
    this.licenseExpressions = [];
    this.dry = options.dry || false;
    this.silent = options.silent || false;
    this.verbose = options.verbose || false;
    Object.seal(this);
}

LicenseFixer.prototype.addLicense = function addLicense(license) {
    this.licenseExpressions.push(createLicenseExpression(license));
};

function createLicenseExpression(license) {
    license = license.trim();
    // Transform the license into a regular expression that matches the exact
    // license as well as similar licenses, with different dates and line
    // wraps.
    var pattern = license.split(/\s+/).map(relaxLicenseTerm).join('') + '\\s*';
    return new RegExp(pattern, 'gmi');
}

function relaxLicenseTerm(term) {
    // There has been at least one occasion where someone replaced all single
    // quotes with double quotes throughout a file and got an extra license.
    return '\\s*((//|#)\\s*)*' + // wrap around any comment or spacing
        regexpEscape(term)
            .replace(/\d{4}/g, '\\d{4}') // dates to date patterns
            .replace(/['"]/g, '[\'"]'); // relax quotes
}

var regexpEscapePattern = /[|\\{}()[\]^$+*?.]/g;

function regexpEscape(string) {
    return string.replace(regexpEscapePattern, '\\$&');
}

LicenseFixer.prototype.setLicense = function setLicense(license) {
    this.slashLicense = createSlashLicense(license);
    this.hashLicense = createHashLicense(license);
};

function createSlashLicense(license) {
    return license.trim().split('\n').map(slashPrefix).join('');
}

function createHashLicense(license) {
    return license.trim().split('\n').map(hashPrefix).join('');
}

function slashPrefix(line) {
    return ('// ' + line).trim() + '\n';
}

function hashPrefix(line) {
    return ('# ' + line).trim() + '\n';
}

LicenseFixer.prototype.getLicenseForFile = function getLicenseForFile(file) {
    if (file.match(/\.(js|go|java|ts|tsx|mjs)$/)) {
        return this.slashLicense;
    } else if (file.match(/\.(pyx?|pxd)$/)) {
        return this.hashLicense;
    }
    return null;
};

LicenseFixer.prototype.fixContent = function fixContent(file, content) {
    var preamble = '';
    // Check for shebang
    var foundShebang = content.match(/^#!|#\s*(en)?coding=/m);
    if (foundShebang) {
        var shebangIndex = content.indexOf('\n');
        if (shebangIndex >= 0) {
            preamble += content.slice(0, shebangIndex + 1);
            content = content.slice(shebangIndex + 1).trim() + '\n';
        }
    }

    // check for @flow header
    var foundFlowHeader = content.match(/^\/\/ @flow|^\/\* @flow \*\//m);
    if (foundFlowHeader) {
        var flowIndex = content.indexOf('\n');
        if (flowIndex >= 0) {
            preamble += content.slice(0, flowIndex + 1);
            content = content.slice(flowIndex + 1).trim() + '\n';
        }
    }

    if (foundShebang || foundFlowHeader) {
        preamble += '\n';
    }

    // Remove old licenses
    for (var i = 0; i < this.licenseExpressions.length; i++) {
        // string replace hangs in some pathelogical cases of repeated licenses
        var match = this.licenseExpressions[i].exec(content);
        while (match) {
            content = content.slice(0, match.index) + content.slice(match.index + match[0].length);
            match = this.licenseExpressions[i].exec(content);
        }
    }

    var license = this.getLicenseForFile(file);
    if (license === null) {
        if (!this.silent) {
            console.error(`unrecognized file type ${file}`);
        }
        return null;
    }

    // Reintroduce the preamble and license
    content = preamble + license + '\n' + content;

    return content;
};

LicenseFixer.prototype.fixFile = function fixFile(file) {
    var original = readFileSync(file, 'utf8');

    if (original.length === 0) {
        // Ignore empty files
        if (this.verbose) {
            console.log(`empty ${file}`);
        }
        return false;
    }

    var content = this.fixContent(file, original);

    if (content === null) {
        // Return true on error so dry run fails
        return true;
    }

    if (original === content) {
        // No change
        if (this.verbose) {
            console.log(`skip ${file}`);
        }
        return false;
    }

    if (!this.silent) {
        console.log(`fix ${file}`);
    }

    if (this.dry) {
        return true;
    }

    writeFileSync(file, content, 'utf8');
    return true;
};

export default LicenseFixer