'use babel';

import TeletypeChatView from './teletype-chat-view';
import TeletypeConnector from './teletype-connector';
import { CompositeDisposable, Disposable } from 'atom';

export default {

  teletypeChatView: null,
  // modalPanel: null,
  subscriptions: null,
  teletypeConnector: null,

  activate(state) {
      this.teletypeChatView = new TeletypeChatView();
      this.teletypeConnector = new TeletypeConnector(this.teletypeChatView);

      this.subscriptions = new CompositeDisposable(
        // Add an opener for our view.
        atom.workspace.addOpener(uri => {
          if (uri === 'atom://teletype-chat') {
            // return new TeletypeChatView();
            return this.teletypeChatView;
          }
        }),

        // Register command that toggles this view
        atom.commands.add('atom-workspace', {
          'teletype-chat:toggle': () => this.toggle()
        }),

        // Destroy any TeletypeChatView when the package is deactivated.
        new Disposable(() => {
          atom.workspace.getPaneItems().forEach(item => {
            if (item instanceof TeletypeChatView) {
              item.destroy();
            }
          });
        })
      );



    // this.teletypeChatView = new TeletypeChatView(state.teletypeChatViewState);
    // this.modalPanel = atom.workspace.addModalPanel({
    //   item: this.teletypeChatView.getElement(),
    //   visible: false
    // });
    //
    // // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    // this.subscriptions = new CompositeDisposable();
    //
    // // Register command that toggles this view
    // this.subscriptions.add(atom.commands.add('atom-workspace', {
    //   'teletype-chat:toggle': () => this.toggle()
    // }));
  },

  deactivate() {
    // this.modalPanel.destroy();
    this.subscriptions.dispose();
    // this.teletypeChatView.destroy();
  },

  consumeTeletype (teletypeService) {
    console.log("asked to consumeTeletype");
    this.teletypeConnector.setTeletypeService(teletypeService);
    // set local identity, better late then never...
    const foo = async () => {
        const localIdentity = await teletypeService.localUserIdentity();
        this.teletypeChatView.setLocalIdentity(localIdentity);
    }
    foo();
  },

  // serialize() {
  //   return {
  //     teletypeChatViewState: this.teletypeChatView.serialize()
  //   };
  // },

  toggle() {
    console.log('TeletypeChat was toggled!');
    atom.workspace.toggle('atom://teletype-chat');
    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );
  }

};
