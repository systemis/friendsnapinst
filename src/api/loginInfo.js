import $ from 'jquery';
class LoginInfo {
  constructor(fn) {
    this.host = 'http://localhost:1999'
  }

  getFriendList(fn) {
    $.ajax({
      url: `${this.host}/api/get-friends-list`, method: 'POST',
      success: data => {
        console.log(data)
        fn(data.error, data.result);
      },
      error: error => fn(error, null)
    })
  }
}

export default new LoginInfo();