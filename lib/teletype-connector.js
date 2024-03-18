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

    resolveLogin(id) {
        let login = this.loginLookup.get(id);
        if (!login) {
            // TODO: actually resolve the login via teletypeService
        }
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
                    const login = this.resolveLogin(id);
                    console.log(body);
                    const msg = JSON.parse(body.body.toString()).msg;
                    this.view.addMsg(id + ": " + msg);
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
