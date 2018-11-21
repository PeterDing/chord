'use strict';

import * as assert from 'assert';
import { suite, test } from 'mocha';

import { deepCopy } from 'chord/base/common/objects';


suite('base/common/objects', () => {

    test('deepCopy', function() {
        let x = { a: { b: { c: [{ e: 100 }] } } };
        let result = deepCopy(x);
        assert.equal(JSON.stringify(result), '{"a":{"b":{"c":[{"e":100}]}}}');
    });

});
