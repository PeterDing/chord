'use strict';

import * as assert from 'assert';
import { suite, test } from 'mocha';

import { LRUCache } from 'chord/base/common/lru';


suite('platform/utils/common/lru', () => {

    test('LRUCache', function() {
        let cache = new LRUCache(0.2);
        cache.set('1', 1);

        setTimeout(() => { assert.equal(cache.get('1'), null); }, 0.5);
    });

});

