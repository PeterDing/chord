'use strict';

import * as assert from 'assert';
import { suite, test } from 'mocha';

import { getRandomSample } from 'chord/base/node/random';


suite('base/node/random', () => {

    test('getRandomSample', async function() {
        let l = [1, 2, 3, 4];
        let r = getRandomSample(l, 4).sort((x, y) => x - y);
        assert.equal(r.reduce((x, y) => x + y), l.reduce((x, y) => x + y));
    });

});
