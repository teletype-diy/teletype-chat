'use babel';

export default class TeletypeChatView {

  constructor() {
    this.identity = "invalid";

    this.lastSiteId = 0;

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('teletype-chat');

    // Create message element
    this.messageContainer = document.createElement('div');
    // this.messageContainer.textContent = 'The TeletypeChat package is Alive! It\'s ALIVE!';
    // this.messageContainer.classList.add('inset-panel');
    this.messageContainer.classList.add('message-container');
    this.element.appendChild(this.messageContainer);


    // create input box
    const inputBoxDiv = document.createElement('div');
    inputBoxDiv.classList.add('padded', 'input-container');
    const inputBox = document.createElement("input");
    inputBox.setAttribute("type", "text");
    inputBox.autofocus = "autofocus";
    inputBox.placeholder = "Send chat message to peers...";
    // .native-key-bindings fixes backspace not working issue...
    inputBox.classList.add('input-text', 'native-key-bindings');
    // <input class='input-text' type='text' placeholder='Text'>


    inputBox.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        console.log('Enter key pressed!');
        // fetch msg
        const msg = inputBox.value;
        inputBox.value = "";

        // send msg to connector
        this.sendMsg(msg);
      }
    });

    inputBoxDiv.appendChild(inputBox);
    this.element.appendChild(inputBoxDiv);
  }

  setLocalIdentity(identity) {
    console.log(`local identity set to:`);
    console.log(identity);
    this.identity = identity;
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  setCallback(callback) {
    this.callback = callback;
  }

  sendMsg(msg) {
    if (!msg) return;
    // display as well
    this.addMsg(this.identity, msg);
    if (this.callback) this.callback(msg);
  }

  // addRemoteMsg(identity, msg) {
  //     // Create message element
  //     const messageLine = document.createElement('div');
  //     messageLine.classList.add('block', 'message-line');
  //     const message = document.createElement('span');
  //     message.textContent = msg;
  //     // TODO: use 'ui-site-#'  --- meh only background color -- use own classes
  //     // message.classList.add('message', `ui-site-${identity.siteId}`);
  //     message.classList.add('message', 'SitePositionsComponent-site', `color--site-${identity.siteId}`);
  //     messageLine.appendChild(message);
  //     this.messageContainer.appendChild(messageLine);
  // }

  addMsg(identity, msg) {
    // TODO: add color to msg:
    // "SitePositionsComponent-site site-2 viewing-current-editor color--site-2"

    // Create message element
    const messageLine = document.createElement('div');
    messageLine.classList.add('block', 'message-line', 'flex-row-container');

    const identityDiv = document.createElement('div');
    identityDiv.textContent = identity.login;
    identityDiv.classList.add('message', 'text-subtle');

    // <div class="SitePositionsComponent-site site-2 viewing-current-editor color--site-2"><img src="https://avatars.githubusercontent.com/invalid?s=80"></div>
    const iconSpan = document.createElement('span');
    const iconImg = document.createElement('img');
    iconImg.src = `https://avatars.githubusercontent.com/${identity.login}?s=40`;
    iconSpan.appendChild(iconImg);
    iconSpan.classList.add('chat-icon', 'SitePositionsComponent-site', `color--site-${identity.siteId}`, 'flex-row-item');
    if (identity.siteId === this.lastSiteId) {
        iconSpan.classList.add('teletype-chat-hidden');
    }

    const messageWrapper = document.createElement('div');
    const message = document.createElement('div');
    message.textContent = msg;
    message.classList.add('message');

    messageWrapper.classList.add('message-wrapper', 'flex-row-item');

    messageLine.appendChild(iconSpan);
    messageWrapper.appendChild(identityDiv);
    messageWrapper.appendChild(message);
    messageLine.appendChild(messageWrapper);
    this.messageContainer.appendChild(messageLine);

    // keep scrolling down
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;

    // set lastSiteId
    this.lastSiteId = identity.siteId;
  }

  getTitle() {
    // Used by Atom for tab text
    return 'Teletype Chat';
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://teletype-chat';
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  getDefaultLocation() {
    // This location will be used if the user hasn't overridden it by dragging the item elsewhere.
    // Valid values are "left", "right", "bottom", and "center" (the default).
    return 'right';
  }

  // // I am not your mom, do what you want...
  // getAllowedLocations() {
  //   // The locations into which the item can be moved.
  //   return ['left', 'right', 'bottom'];
  // }

}
