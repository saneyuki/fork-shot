/*global $: true */
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

/// <reference path="../../../../node_modules/rx/ts/rx.all.es6.d.ts" />
/// <reference path="../../../../tsd/third_party/jquery/jquery.d.ts" />
/// <reference path="../../../../tsd/third_party/react/react.d.ts" />

import AppActionCreator from '../../intent/action/AppActionCreator';
import Channel from '../../domain/Channel';
import {ChannelItem} from './ChannelItem';
import CommandTypeMod from '../../domain/CommandType';
import {DomainState} from '../../domain/DomainState';
import MessageActionCreator from '../../intent/action/MessageActionCreator';
import {MessageGateway} from '../../adapter/MessageGateway';
import Network from '../../domain/Network';
import {NetworkDomain} from '../../domain/NetworkDomain';
import {NetworkItemList} from './NetworkItemList';
import * as React from 'react';
import * as Rx from 'rx';
import UIActionCreator from '../../intent/action/UIActionCreator';

const CommandType = CommandTypeMod.type;

export default class SidebarViewController implements EventListenerObject {

    _element: Element;
    domain: DomainState;
    _disposeSignout: Rx.IDisposable;
    _disposeInitialRenderNetworks: Rx.IDisposable;
    _disposeSelectChannel: Rx.IDisposable;
    _disposeAddedNetwork: Rx.IDisposable;
    _disposeDeletedNetwork: Rx.IDisposable;
    _disposeJoinChannel: Rx.IDisposable;
    _disposePartFromChannel: Rx.IDisposable;

    constructor(domain: DomainState, element: Element, gateway: MessageGateway) {
        this._element = element;
        this.domain = domain;

        this._disposeSignout = AppActionCreator.getDispatcher().signout.subscribe(() => {
            this.clearAllNetworks();
            this.showEmptinesse();
        });

        this._disposeInitialRenderNetworks = domain.getNetworkDomain().initialState().subscribe((data) => {
            const networks = data.domain.map(function(domain){
                return domain.getValue();
            });

            this.hideEmptinesse();
            this.renderNetworks(networks);
        });

        // This should be scheduled on the next event loop
        // bacause to wait to complete other tasks.
        this._disposeSelectChannel = domain.getSelectedChannel().subscribe((channelId) => {
            this.selectChannel(channelId);
        });

        this._disposeAddedNetwork = domain.getNetworkDomain().addedNetwork().subscribe((network: NetworkDomain) => {
            this.addNetwork(network.getValue());
        });

        this._disposeDeletedNetwork = domain.getNetworkDomain().removedNetwork().subscribe((network: NetworkDomain) => {
            this.deleteNetwork(network);
        });

        this._disposeJoinChannel = domain.getNetworkDomain().joinedChannelAtAll().subscribe((channel) => {
            const value = channel.getValue();
            const networkId = value.network.id;
            this.joinChannel(networkId, value);
        });

        this._disposePartFromChannel = domain.getNetworkDomain().partedChannelAtAll().subscribe((channel) => {
            this.removeChannel(channel.getId());
        });

        element.addEventListener('click', this);
    }

    handleEvent(aEvent: Event): void {
        switch (aEvent.type) {
            case 'click':
                this.onClick(aEvent);
        }
    }

    onClick(aEvent: Event): void {
        const target: any = aEvent.target;
        if (!target.matches('.js-sidebar-channel, .js-sidebar-channel > *')) {
            return;
        }

        // This is very heuristic way.
        let button = target;
        if (!target.classList.contains('js-sidebar-channel')) {
            button = <Element>target.parentNode;
        }

        const channelId = parseInt(button.getAttribute('data-id'), 10);

        const isCloseButton = target.classList.contains('close');
        if (isCloseButton) {
            this.closeChannel(channelId, button);
        }
        else {
            UIActionCreator.selectChannel(channelId);
        }
    }

    joinChannel(networkId: number, channel: Channel): void {
        const network = this._element.querySelector('#network-' + String(networkId));
        if (!network) {
            throw new Error();
        }

        this.appendChannel(<HTMLElement>network, channel);
    }

    closeChannel(channelId: number, target: HTMLElement): void {
        const channelWrap = this.domain.networkSet.getChannelById(channelId);
        if (channelWrap.isNone) {
            return;
        }

        const channel = channelWrap.unwrap();
        const channelType = channel.type;
        const isLobby = (channelType === 'lobby');
        const command = isLobby ? CommandType.QUIT : CommandType.CLOSE;
        if (isLobby) {
            /*eslint-disable no-alert*/
            if (!window.confirm('Disconnect from ' + channel.name + '?')) {
                return;
            }
            /*eslint-enable*/
        }
        MessageActionCreator.inputCommand(channelId, command);

        // FIXME: This visual state should be written in css.
        target.style.opacity = '0.4';
    }

    clearAllNetworks(): void {
        let element = <HTMLElement>this._element.querySelector('.networks');
        element.innerHTML = '';
    }

    addNetwork(network: Network): void {
        this.hideEmptinesse();
        this.appendNetworks([network]);
    }

    deleteNetwork(network: NetworkDomain): void {
        const id = network.getId();
        const target = this._element.querySelector('#network-' + String(id));
        if (!!target) {
            target.parentNode.removeChild(target);
        }

        const newTarget = this._element.querySelector('.chan');
        if (!newTarget) {
            this.showEmptinesse();
        }
    }

    showEmptinesse(): void {
        let element = <HTMLElement>this._element.querySelector('.empty');
        element.style.display = 'block';
    }

    hideEmptinesse(): void {
        let element = <HTMLElement>this._element.querySelector('.empty');
        element.style.display = 'none';
    }

    renderNetworks(networks: Array<Network>): void {
        const element = <HTMLElement>this._element.querySelector('.networks');
        const view = React.createElement(NetworkItemList, {
            list: networks,
        });
        const html = React.renderToStaticMarkup(view);

        element.innerHTML = html;
    }

    appendNetworks(networks: Array<Network>): void {
        const element = <HTMLElement>this._element.querySelector('.networks');
        const view = React.createElement(NetworkItemList, {
            list: networks,
        });
        const html = React.renderToStaticMarkup(view);

        element.innerHTML = element.innerHTML + html;
    }

    appendChannel(network: HTMLElement, channel: Channel): void {
        const view = React.createElement(ChannelItem, {
            channel: channel,
        });
        const html = React.renderToStaticMarkup(view);

        network.innerHTML = network.innerHTML + html;
    }

    selectChannel(id: number): void {
        const active = this._element.querySelector('.active');
        if (!!active) {
            active.classList.remove('active');
        }

        const selector = '.js-sidebar-channel[data-id="' + String(id) + '"]';
        let target = this._element.querySelector(selector);
        if (!target) {
            return;
        }

        target.classList.add('active');

        const badge = target.querySelector('.badge');
        if (!!badge) {
            badge.classList.remove('highlight');
            // FIXME:
            $(badge).data('count', '');
            badge.textContent = '';
        }
    }

    removeChannel(id: number): void {
        const element = this._element.querySelector('.js-sidebar-channel[data-id=\'' + String(id) + '\']');
        element.parentNode.removeChild(element);
    }
}
