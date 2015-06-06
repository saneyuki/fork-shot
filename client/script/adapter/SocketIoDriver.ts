/**
 * @license MIT License
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

/// <reference path="../../../tsd/third_party/socket.io-client/socket.io-client.d.ts" />
/// <reference path="../../../node_modules/rx/ts/rx.d.ts" />

import * as io from 'socket.io-client';
import * as Rx from 'rx';

export default class SocketIoDriver {

    _socket: SocketIOClient.Socket;

    constructor() {
        this._socket = io.connect();
    }

    error(): Rx.Observable<any> {
        return Rx.Observable.create<any>((observer) => {
            this._socket.on('error', function (e: any) {
                observer.onError(e);
            });
        });
    }

    connectError(): Rx.Observable<void> {
        return Rx.Observable.create<void>((observer) => {
            this._socket.on('connect_error', function () {
                observer.onNext(undefined);
            });
        });
    }

    disconnect(): Rx.Observable<void> {
        return Rx.Observable.create<void>((observer) => {
            this._socket.on('disconnect', function () {
                observer.onNext(undefined);
            });
        });
    }

    auth(): Rx.Observable<any> {
        return Rx.Observable.create<any>((observer) => {
            this._socket.on('auth', function (data: any) {
                observer.onNext(data);
            });
        });
    }

    init(): Rx.Observable<any> {
        return Rx.Observable.create<any>((observer) => {
            this._socket.on('init', function (data: any) {
                observer.onNext(data);
            });
        });
    }

    join(): Rx.Observable<any> {
        return Rx.Observable.create<any>((observer) => {
            this._socket.on('join', function (data: any) {
                observer.onNext(data);
            });
        });
    }

    message(): Rx.Observable<any> {
        return Rx.Observable.create<any>((observer) => {
            this._socket.on('msg', function (data: any) {
                observer.onNext(data);
            });
        });
    }

    more(): Rx.Observable<any> {
        return Rx.Observable.create<any>((observer) => {
            this._socket.on('more', function (data: any) {
                observer.onNext(data);
            });
        });
    }

    network(): Rx.Observable<any> {
        return Rx.Observable.create<any>((observer) => {
            this._socket.on('network', function (data: any) {
                observer.onNext(data);
            });
        });
    }

    nickname(): Rx.Observable<any> {
        return Rx.Observable.create<any>((observer) => {
            this._socket.on('nick', function (data: any) {
                observer.onNext(data);
            });
        });
    }

    part(): Rx.Observable<any> {
        return Rx.Observable.create<any>((observer) => {
            this._socket.on('part', function (data: any) {
                observer.onNext(data);
            });
        });
    }

    quit(): Rx.Observable<any> {
        return Rx.Observable.create<any>((observer) => {
            this._socket.on('quit', function (data: any) {
                observer.onNext(data);
            });
        });
    }

    toggle(): Rx.Observable<any> {
        return Rx.Observable.create<any>((observer) => {
            this._socket.on('toggle', function (data: any) {
                observer.onNext(data);
            });
        });
    }

    topic(): Rx.Observable<any> {
        return Rx.Observable.create<any>((observer) => {
            this._socket.on('topic', function (data: any) {
                observer.onNext(data);
            });
        });
    }

    users(): Rx.Observable<any> {
        return Rx.Observable.create<any>((observer) => {
            this._socket.on('users', function (data: any) {
                observer.onNext(data);
            });
        });
    }

    emit(name: string, obj: any): void {
        this._socket.emit(name, obj);
    }
}
