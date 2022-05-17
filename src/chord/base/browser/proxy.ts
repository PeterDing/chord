'use strict';

const remote = global.electronRemote;

import { Logger } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';
const logger = new Logger(filenameToNodeName(__filename));


// If proxyRules is '' or null, this action cancels browser's proxy
export function setBrowserGlobalProxy(proxyRules: string) {
    return;
    logger.info('Set Browser Global Proxy:', proxyRules);
    remote.getCurrentWebContents().session.setProxy({ proxyRules: proxyRules || null });
}
