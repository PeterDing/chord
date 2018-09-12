'use strict';

import * as assert from 'assert';
import { suite, test } from 'mocha';

import { getDescendentProp, setDescendentProp } from 'chord/base/common/property';


suite('base/common/property', () => {

    test('getDescendentProp', function() {
        let x = { a: { b: { c: [{ e: 100 }] } } };
        let result = getDescendentProp(x, 'a.b.c.0.e');
        assert.equal(result, 100);
    });

    test('setDescendentProp', function() {
        let x = { a: { b: { c: [{ e: 100 }] } } };
        let xx = setDescendentProp(x, 'a.b.c.0.e', 200);
        let result = xx.a.b.c[0].e;
        assert.equal(result, 200);
    });
});
