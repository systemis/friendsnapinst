import React, { Component } from 'react';
import { connect } from 'react-redux';
import Input from '@material-ui/core/Input'
import LoadingIcon from './Components/loading.gif';
import loginRequest from './api/loginInfo';
import SearchResultComponent from './Components/resultSearchFriend';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      isloading: true
    }
  }

  componentWillMount() {
  }

  onSearchChange(searchChangedValue) {
    searchChangedValue = searchChangedValue.toLowerCase();
    const { friends } = this.props || [];
    var results = [];
    const maxCountCompare = 200;
    const maxLoop = friends.length <= maxCountCompare ? friends.length : maxCountCompare;
    for (let i = 0; i < maxLoop; i++) {
      let pos = friends[i];
      if (pos.name.toLowerCase().indexOf(searchChangedValue) >= 0) {
        results.push(pos);
      }
    }

    console.log(results);
    this.props.dispatch({ type: 'change-search-result', value: results });
  }

  componentDidMount() {
    this.props.socket.init();
    this.props.socket.newPage();
    loginRequest.getFriendList((error, result) => {
      if (error || !result || result.length <= 0) return false;
      console.log('Error when get list friends', error);
      console.log('Result when get list friends', result.length);
      this.setState({ isloading: false });
      this.props.dispatch({ type: 'change-friends-list', value: result });
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.searchValue !== nextState.searchValue) {
      clearTimeout(this.timer);
    }

    return true;
  }

  componentWillUpdate() {
    this.timer = setTimeout(() => {
      console.log('this changed', this.state.searchValue);
      this.onSearchChange(this.state.searchValue);
    }, 1000);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="App" style={{ position: 'relative' }}>
        <div className='header'>
          <Input
            style={{ width: '500px', padding: '10px' }}
            className='hashtagSearchInput'
            placeholder='Hastag do you like to search ?'
            onChange={event => {
              if (!event) return false;
              let value = event.target.value;
              this.setState({ searchValue: value });
            }}
          />
          <div className='showing-user-result'>
            <SearchResultComponent />
          </div>
        </div>
        {this.state.isloading && (
          <div
            className='loading-container'
            style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
            <LoadingIcon />
          </div>
        )}
      </div>
    );
  }
}

export default connect(state => {
  return {
    friends: state.friends,
    socket: state.socket
  }
})(App);
