'use strict';

import * as paths from 'path';
import * as os from 'os';
import * as fs from 'fs';

import { isWindows } from 'chord/base/common/platform';
import { mkdirp } from 'chord/base/node/pfs';


export const CHORD_DIR = isWindows ?
    paths.join(os.homedir(), 'Appdata', 'Roaming', 'chord') : paths.join(os.homedir(), '.chord');

if (!fs.existsSync(CHORD_DIR)) {
    mkdirp(CHORD_DIR);
}
