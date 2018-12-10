'use strict';

import * as path from 'path';


/**
 * filename is only from __filename
 */
export function filenameToNodeName(filename: string): string {
    let index = filename.indexOf(path.join('out', 'chord'));
    let nodeName = filename.slice(index + 4, -3).replace(/[/\\]/g, '.');
    return nodeName;
}
