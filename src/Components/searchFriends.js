import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';

class SearchFriendsComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>

      </div>
    )
  }
}

export default connect(state => {
  return {
    friends: state.friends
  }
})(SearchFriendsComponent)