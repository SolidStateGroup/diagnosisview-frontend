module.exports = Object.assign({}, require('./base/_app-actions'), {
  getFavourites: function () { //refresh the entire app
    Dispatcher.handleViewAction({
      actionType: Actions.GET_FAVOURITES
    });
  },
  setFavourite: function (code, name, link) { //refresh the entire app
    Dispatcher.handleViewAction({
      actionType: Actions.SET_FAVOURITE,
      code,
      name,
      link
    });
  },
  removeFavourite: function (code, link) { //refresh the entire app
    Dispatcher.handleViewAction({
      actionType: Actions.REMOVE_FAVOURITE,
      code,
      link
    });
  },
  getCodes: function () {
    Dispatcher.handleViewAction({
      actionType: Actions.GET_CODES
    });
  },
  getHistory: function () { //refresh the entire app
    Dispatcher.handleViewAction({
      actionType: Actions.GET_HISTORY
    });
  },
  addToHistory: function (item) {
    Dispatcher.handleViewAction({
      actionType: Actions.ADD_TO_HISTORY,
      item
    });
  },
  subscribe: function (receipt, silent) {
    Dispatcher.handleViewAction({
      actionType: Actions.SUBSCRIBE,
      receipt,
      silent
    });
  },
  getAccount: function (retrySubscription) { //refresh the entire app
    Dispatcher.handleViewAction({
      actionType: Actions.GET_ACCOUNT,
      retrySubscription
    });
  },
  setSubscribedFavourites: function (favourites) {
    Dispatcher.handleViewAction({
      actionType: Actions.SET_SUBSCRIBED_FAVOURITES,
      favourites
    });
  },
  setSubscribedHistory: function (history) {
    Dispatcher.handleViewAction({
      actionType: Actions.SET_SUBSCRIBED_HISTORY,
      history
    });
  },
  updateAccount: function (details) {
    Dispatcher.handleViewAction({
      actionType: Actions.UPDATE_ACCOUNT,
      details
    });
  },
  setDeviceFavourites: function () {
    Dispatcher.handleViewAction({
      actionType: Actions.SET_DEVICE_FAVOURITES,
    });
  },
  setDeviceHistory: function () {
    Dispatcher.handleViewAction({
      actionType: Actions.SET_DEVICE_HISTORY,
    });
  },
  getUsers: function () {
    Dispatcher.handleViewAction({
      actionType: Actions.GET_USERS,
    });
  },
  updateUsers: function (changes) {
    Dispatcher.handleViewAction({
      actionType: Actions.UPDATE_USERS,
      changes
    });
  },
  createUser: function (details) {
    Dispatcher.handleViewAction({
      actionType: Actions.CREATE_USER,
      details
    });
  },
  deleteUser: function (user) {
    Dispatcher.handleViewAction({
      actionType: Actions.DELETE_USER,
      user
    });
  },
  setToken: function(token) {
    Dispatcher.handleViewAction({
      actionType: Actions.SET_TOKEN,
      token
    });
  },
  updateUser: function(id, details) {
    Dispatcher.handleViewAction({
      actionType: Actions.UPDATE_USER,
      id,
      details
    });
  }
});
