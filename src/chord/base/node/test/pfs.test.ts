'use strict';

import * as assert from 'assert';
import { suite, test } from 'mocha';

import { mkdirp } from 'chord/base/node/pfs';
import * as fs from 'fs';


suite('base/node/pfs', () => {

    test('mkdirp', async function() {
        let dir = '/tmp/t/chord--1234567890/test/--------/a/b/c/d';
        try {
            let r = mkdirp(dir);
            assert.equal(r, true);
        } catch (e) {
            throw e;
        } finally {
            try {
                fs.rmdirSync('/tmp/t/chord--1234567890/test/--------/a/b/c/d');
                fs.rmdirSync('/tmp/t/chord--1234567890/test/--------/a/b/c');
                fs.rmdirSync('/tmp/t/chord--1234567890/test/--------/a/b');
                fs.rmdirSync('/tmp/t/chord--1234567890/test/--------/a');
                fs.rmdirSync('/tmp/t/chord--1234567890/test/--------');
                fs.rmdirSync('/tmp/t/chord--1234567890/test');
                fs.rmdirSync('/tmp/t/chord--1234567890');
            } catch (e) {}
        }
    });

});
