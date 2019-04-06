let redux = require('redux');
let io = require('socket.io-client');

let tokenReducer = (state = '', action) => {
  if (action.type == 'change-token') {
    console.log(action.value)
    return action.value;
  }

  return state;
}

let searchResults = (state = [], action) => {
  if (action.type == 'change-search-result') {
    return action.value;
  }

  return state;
}

let reducer = redux.combineReducers({
  tokenReducer: tokenReducer,
  searchResults: searchResults,
  friends: (state = [], action) => {
    if (action.type == 'change-friends-list') {
      console.log('Friends has changed', action.value);
      return action.value;
    }

    return state;
  },

  socket: (state = '', action) => {
    return {
      init: () => {
        this.urlConnect = `http://localhost:1999/`;
        this.socket = io.connect(this.urlConnect);
        this.socket.on('disconnect', () => console.log('You are disconnect'));
      },

      newPage: () => {
        this.socket.emit('newPage', { username: 'systemofpeter', password: 'Since2002' });
      }
    }
  }
})

let store = redux.createStore(reducer);
module.exports = store;
