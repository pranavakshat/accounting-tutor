window.AUTH = {
  getUsers: function() { return JSON.parse(localStorage.getItem('acct_users') || '{}'); },
  saveUsers: function(u) { localStorage.setItem('acct_users', JSON.stringify(u)); },
  getCurrentUser: function() { return sessionStorage.getItem('acct_current_user'); },
  login: function(username, password) {
    var users = this.getUsers();
    if (users[username.toLowerCase()] && users[username.toLowerCase()] === btoa(unescape(encodeURIComponent(password)))) {
      sessionStorage.setItem('acct_current_user', username.toLowerCase());
      return true;
    }
    return false;
  },
  register: function(username, password) {
    username = username.toLowerCase().trim();
    if (!username || username.length < 3) return 'Username must be at least 3 characters.';
    if (!password || password.length < 4) return 'Password must be at least 4 characters.';
    var users = this.getUsers();
    if (users[username]) return 'Username already taken. Try another.';
    users[username] = btoa(unescape(encodeURIComponent(password)));
    this.saveUsers(users);
    sessionStorage.setItem('acct_current_user', username);
    return null;
  },
  logout: function() { sessionStorage.removeItem('acct_current_user'); },
  progressKey: function() { return 'acct_progress_' + (this.getCurrentUser() || 'guest'); }
};
