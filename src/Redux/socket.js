var io = require('socket.io-client');
class SocketClient {
  constructor() {
    this.urlConnect = `http://localhost:1999/`;
    this.socket = io.connect(this.urlConnect);
    this.socket.on('disconnect', () => console.log('You are disconnect'));

    this.socket.on('disconnected', () => {

    })
  }

  newPage() {
    console.log('New Page');
    this.socket.emit('newPage', { username: 'systemis', password: 'Since2002' });
  }
}

export default new SocketClient();