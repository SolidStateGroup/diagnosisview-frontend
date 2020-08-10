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
  getCodes: function (isAdmin) {
    Dispatcher.handleViewAction({
      actionType: Actions.GET_CODES,
      isAdmin,
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
  },
  adminLogin: function (details) {
    Dispatcher.handleViewAction({
      actionType: Actions.ADMIN_LOGIN,
      details
    });
  },
  updateCode: function (diagnosis) {
    Dispatcher.handleViewAction({
      actionType: Actions.UPDATE_CODE,
      diagnosis
    });
  },
  updateLink: function (code, linkId, changes) {
    Dispatcher.handleViewAction({
      actionType: Actions.UPDATE_LINK,
      code,
      linkId,
      changes
    });
  },
  getCodeCategories: function () {
    Dispatcher.handleViewAction({
      actionType: Actions.GET_CODE_CATEGORIES
    });
  },
  getLinkTransforms: function () { //refresh the entire app
    Dispatcher.handleViewAction({
      actionType: Actions.GET_LINK_TRANSFORMS
    });
  },
  addLinkTransform: function (type, criteria, link, transformation) {
    Dispatcher.handleViewAction({
      actionType: Actions.ADD_LINK_TRANSFORM,
      type, criteria, link, transformation,
    });
  },
  removeLinkTransform: function (id) {
    Dispatcher.handleViewAction({
      actionType: Actions.REMOVE_LINK_TRANSFORM,
      id,
    });
  },
  updateLinkTransform: function (id, transform) {
    Dispatcher.handleViewAction({
      actionType: Actions.UPDATE_LINK_TRANSFORM,
      id,
      transform,
    });
  },
  getLinkLogos: function () { //refresh the entire app
    Dispatcher.handleViewAction({
      actionType: Actions.GET_LINK_LOGOS
    });
  },
  addLinkLogo: function (startsWith, image, overrideDifficultyLevel) {
    Dispatcher.handleViewAction({
      actionType: Actions.ADD_LINK_LOGO,
      startsWith, image, overrideDifficultyLevel
    });
  },
  removeLinkLogo: function (id) {
    Dispatcher.handleViewAction({
      actionType: Actions.REMOVE_LINK_LOGO,
      id,
    });
  },
  updateLinkLogo: function (id, linkLogo) {
    Dispatcher.handleViewAction({
      actionType: Actions.UPDATE_LINK_LOGO,
      id,
      linkLogo,
    });
  },
  getExternalStandards: function () {
    Dispatcher.handleViewAction({
      actionType: Actions.GET_EXTERNAL_STANDARDS
    });
  },
  deleteCode: function (code) {
    Dispatcher.handleViewAction({
      actionType: Actions.DELETE_CODE,
      code,
    });
  },
  getSettings: function () {
    Dispatcher.handleViewAction({
      actionType: Actions.GET_SETTINGS,
    });
  },
  getInstitutions: function () {
    Dispatcher.handleViewAction({
      actionType: Actions.GET_INSTITUTIONS,
    });
  },
  addInstitution: function (data) {
    Dispatcher.handleViewAction({
      actionType: Actions.ADD_INSTITUTION,
      data,
    });
  },
  removeInstitution: function (id) {
    Dispatcher.handleViewAction({
      actionType: Actions.REMOVE_INSTITUTION,
      id,
    });
  },
  updateInstitution: function (id, institution) {
    Dispatcher.handleViewAction({
      actionType: Actions.UPDATE_INSTITUTION,
      id,
      institution,
    });
  },
  institutionAdded: function (institution) {
    Dispatcher.handleViewAction({
      actionType: Actions.INSTITUTION_ADDED,
      institution,
    });
  },
  institutionRemoved: function (id) {
    Dispatcher.handleViewAction({
      actionType: Actions.INSTITUTION_REMOVED,
      id,
    });
  },
});
