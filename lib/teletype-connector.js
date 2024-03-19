'use babel';

import { CompositeDisposable } from 'atom';

export default class TeletypeConnector {


    constructor(view) {
        // console.log("I am new TeletypeConnector");
        // console.log(teletypeService);
        this.view = view;

        this.subs = new CompositeDisposable();

        this.loginLookup = new Map();
    }

    destroy() {
        this.subs.dispose();
    }

    // TODO: add teletype api methods to connect to datachannel
    //       send chat msgs
    //       recieve replies
    subscribeToTeletypeDataChannel() {
        this.teletypeService.subscribeToDataChannel(
            {
                channelName: 'teletype-chat/chat-msg',
                callback: (body) => {
                    const id = body.senderId;
                    let identity = this.loginLookup.get(id);
                    console.log(body);
                    const msg = JSON.parse(body.body.toString()).msg;
                    if (!identity) {
                        // meh, we do not yet know you.
                        // ask api async for now...
                        const foo = async () => {
                            const identity = await this.teletypeService.peerIdentity(id);
                            this.loginLookup.set(id, identity);
                            this.view.addMsg(identity, msg);
                        }
                        foo();
                    } else {
                        // we know you and can proceed sync
                        this.view.addMsg(identity, msg);
                    }
                }
            }).then((channelDisposeable) => {
                console.log("channelDisposeable:");
                console.log(channelDisposeable);
                if (channelDisposeable) {
                    this.subs.add(channelDisposeable)
                }
            });
    }

    notifyTeletypeDataChannel(msg) {
        this.teletypeService.notifyOnDataChannel({
            channelName: 'teletype-chat/chat-msg',
            body: JSON.stringify({ msg: msg })
        });
    }

    setTeletypeService(teletypeService) {
        console.log("connector got a teletypeService");
        this.teletypeService = teletypeService;

        this.view.setCallback((msg) => {
            this.notifyTeletypeDataChannel(msg);
        })

        this.subscribeToTeletypeDataChannel();
    }
}
