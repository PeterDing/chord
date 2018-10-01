'use strict';

import * as paths from 'path';
import * as fs from 'fs';


export function mkdirp(path: string, mode?: number): boolean {
    const mkdir = (path: string, mode?: number) => {
        try {
            fs.mkdirSync(path, mode);
            return true;
        } catch(e) {
            if (e.code == 'ENOENT') {
                throw e;
            }

            try {
                if (!fs.statSync(path).isDirectory()) {
                    throw new Error(`${path} exists and is not a directory`);
                }
                return true;
            } catch (e) {
                throw e;
            }
        }
    }

    // path is root
    if (path === paths.dirname(path)) {
        return true;
    }

    try {
        return mkdir(path, mode);
    } catch (e) {
        if (e.code == 'ENOENT') {
            mkdirp(paths.dirname(path), mode);
            return mkdir(path, mode);
        }
        throw e;
    }
}
