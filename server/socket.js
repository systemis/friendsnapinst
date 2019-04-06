class SocketManager {
  constructor(server) {
    this.io = require('socket.io')(server);
    this.io.on('connect', socket => {
      console.log('New connect');
      socket.on('newPage', data => console.log(`New emit connect`, data));
      socket.on('disconnect', () => socket.emit('disconnected'));
    })
  }
}

module.exports = SocketManager;