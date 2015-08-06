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

import {ChannelItem} from './ChannelItem';
import Network from '../../domain/Network';
import * as React from 'react';

export class NetworkItemList extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const list = this.props.list.map(function(network){
            return (
                <NetworkItem key={String(network.id)}
                             network={network} />
            );
        });

        return (
            <div>{list}</div>
        );
    }
}
NetworkItemList.propTypes = {
    list: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Network)).isRequired,
};

export class NetworkItem extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const network = this.props.network;
        const id = String(network.id);

        const channels = network.getChannelList().map(function(channel){
            return (
                <ChannelItem key={String(channel.id)}
                             channel={channel} />
            );
        });

        return (
            <section id={'network-' + id}
                     className='network'
                     data-id={id}
                     data-nick={network.nickname}>
                {channels}
            </section>
        );
    }
}
NetworkItem.propTypes = {
    network: React.PropTypes.instanceOf(Network).isRequired,
};