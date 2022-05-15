/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const ROOT = path.join(__dirname, '../../');
const shasum = crypto.createHash('sha1');
shasum.update(fs.readFileSync(path.join(ROOT, 'build/.cachesalt')));

// Add `package.json` and `yarn.lock` files
const packageJsonPath = path.join(ROOT, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
const relevantPackageJsonSections = {
    dependencies: packageJson.dependencies,
    devDependencies: packageJson.devDependencies,
    build: packageJson.build,
    optionalDependencies: packageJson.optionalDependencies,
    resolutions: packageJson.resolutions
};
shasum.update(JSON.stringify(relevantPackageJsonSections));
const yarnLockPath = path.join(ROOT, 'yarn.lock');
shasum.update(fs.readFileSync(yarnLockPath));

// Add any other command line arguments
for (let i = 2; i < process.argv.length; i++) {
    shasum.update(process.argv[i]);
}
process.stdout.write(shasum.digest('hex'));
