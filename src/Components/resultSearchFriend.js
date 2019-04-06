import React, { Component } from 'react'
import { connect } from 'react-redux'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const ListItemComponent = props => (
  <ListItem
    onClick={props.clickItem}
    className='listitem-search-result' style={styles.listItem}>
    <ListItemAvatar>
      <Avatar
        alt='core avatar listitem'
        src={props.info.image} />
    </ListItemAvatar>
    <ListItemText style={styles.listItemText} inset primary={props.info.name} />
  </ListItem>
)

class SearchResultComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickItem: {
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps.searchResults);
    return true;
  }

  render() {
    return (
      <List
        component='nav'
        style={styles.list}>
        {this.props.searchResults.map((result, index) => {
          return <ListItemComponent
            clickItem={() => console.log(result)}
            info={result}
            key={index} />
        })}
      </List>
    )
  }
}

const styles = {
  list: {
    width: '500px',
    height: '300px',
    margin: '0 auto',
    paddingTop: '15px',
    overflow: 'scroll'
  },
  listItem: {
    padding: '10px'
  },
  listItemText: {
    paddingLeft: '10px'
  }
}

export default connect(state => {
  return {
    searchResults: state.searchResults
  }
})(SearchResultComponent)