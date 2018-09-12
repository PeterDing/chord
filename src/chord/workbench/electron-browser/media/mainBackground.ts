'use strict';

import { getRandomInt } from 'chord/base/node/random';


const MAIN_BACKGROUND_MAP = {
    'searchView': 'linear-gradient(rgb(47, 67, 106), rgb(5, 7, 11) 85%)',
    // 'albumView': 'linear-gradient(rgb(30, 50, 100), rgb(4, 6, 12) 85%)',
    'artistView': 'linear-gradient(rgb(18, 18, 18), rgb(8, 8, 8) 85%)',
    // 'collectionView': 'linear-gradient(rgb(102, 56, 51), rgb(10, 6, 5) 85%)',
}

function pickColor(): string {
    let r = getRandomInt(0, 120);
    let g = getRandomInt(0, 120);
    let b = getRandomInt(0, 120);

    let dr = Math.floor(r * 0.1);
    let dg = Math.floor(g * 0.1);
    let db = Math.floor(b * 0.1);

    return `linear-gradient(rgb(${r}, ${g}, ${b}), rgb(${dr}, ${dg}, ${db}) 85%)`;
}

export function getMainBackground(key: string) {
    return MAIN_BACKGROUND_MAP[key] || pickColor();
}
