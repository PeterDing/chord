'use strict';

import { CAudio } from 'chord/workbench/api/node/audio';

export function changeRate(rate: number) {
    CAudio.rate(rate);
}
