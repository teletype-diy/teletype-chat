'use babel';

export default class TeletypeChatView {

  constructor() {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('teletype-chat');

    // Create message element
    this.messageContainer = document.createElement('div');
    // this.messageContainer.textContent = 'The TeletypeChat package is Alive! It\'s ALIVE!';
    this.messageContainer.classList.add('message');
    this.element.appendChild(this.messageContainer);


    // create input box
    const inputBoxDiv = document.createElement('div');
    const inputBox = document.createElement("input");

    inputBox.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        console.log('Enter key pressed!');
        // fetch msg
        const msg = inputBox.value;
        inputBox.value = "";

        // send msg to connector
        this.sendMsg(msg);

        // display as well
        this.addMsg(msg);
      }
      // TODO: backspace does not work for some reason..
    });

    inputBoxDiv.appendChild(inputBox);
    this.element.appendChild(inputBoxDiv);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  setCallback(callback) {
    this.callback = callback;
  }

  sendMsg(msg) {
    if (this.callback) this.callback(msg);
  }

  addMsg(msg) {
    // TODO: add color to msg:
    // "SitePositionsComponent-site site-2 viewing-current-editor color--site-2"

    // Create message element
    const message = document.createElement('div');
    message.textContent = msg;
    message.classList.add('message');
    this.messageContainer.appendChild(message);
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
