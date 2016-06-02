/**
 * MIT License
 *
 * Copyright (c) 2015 Tetsuharu OHZEKI <saneyuki.snyk@gmail.com>
 * Copyright (c) 2015 Yusuke Suzuki <utatane.tea@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
import * as assert from 'assert';

import {FetchDriver} from '../FetchDriver';

const ORIGIN = 'https://www.example.com';

function test(factory: (this: void) => FetchDriver): void {
    let driver: FetchDriver;

    before(() => {
        driver = factory();
    });

    describe('input is url string', function () {
        describe('without mode', function () {
            let req: Request;

            before(() => {
                req = driver.createRequest('/bar', {});
            });

            it('request.url', () => {
                assert.strictEqual(req.url, ORIGIN + '/bar');
            });

            it('request.mode', () => {
                assert.strictEqual(req.mode, driver.mode());
            });
        });

        describe('with mode', function () {
            let req: Request;

            before(() => {
                req = driver.createRequest('/bar', {
                    mode: 'cors',
                });
            });

            it('request.url', () => {
                assert.strictEqual(req.url, ORIGIN + '/bar');
            });

            it('request.mode', () => {
                assert.strictEqual(req.mode, driver.mode());
            });
        });
    });
}

describe('FetchDriver.createRequest', function () {

    describe('mode: same-origin', function () {
        test(() => {
            return new FetchDriver(ORIGIN, 'same-origin');
        });
    });

    describe('mode: cors', function () {
        test(() => {
            return new FetchDriver(ORIGIN, 'cors');
        });
    });

    describe('mode: no-cors', function () {
        test(() => {
            return new FetchDriver(ORIGIN, 'no-cors');
        });
    });
});