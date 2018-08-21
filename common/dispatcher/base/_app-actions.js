module.exports = {

    connected: function () { //when the device comes online
        Dispatcher.handleViewAction({
            actionType: Actions.CONNECTED,
        });
    },
    disconnected: function () { //when the device goes offline
        Dispatcher.handleViewAction({
            actionType: Actions.DISCONNECTED,
            //todo: maybe store last online
        });
    },
    active: function () { //when the device comes online
        Dispatcher.handleViewAction({
            actionType: Actions.ACTIVE,
        });
    },
    inactive: function () { //when the device goes offline
        Dispatcher.handleViewAction({
            actionType: Actions.INACTIVE,
            //todo: maybe store last online
        });
    },
    active: function (lastSession) { //When the device goes active
        Dispatcher.handleViewAction({
            actionType: Actions.ACTIVE,
            lastSession
        });
    },
    inactive: function () { //When the device goes inactive
        Dispatcher.handleViewAction({
            actionType: Actions.INACTIVE,
        });
    },
    refresh: function () { //refresh the entire app
        Dispatcher.handleViewAction({
            actionType: Actions.REFRESH
        });
    },
    registerNotifications: function (data) {
        Dispatcher.handleViewAction({
            actionType: Actions.REGISTER_NOTIFICATIONS,
            data: data
        });
    },
    setUser: function (user) {
        Dispatcher.handleViewAction({
            actionType: Actions.SET_USER,
            user
        });
    },
    register: function (details) { //refresh the entire app
        Dispatcher.handleViewAction({
            actionType: Actions.REGISTER,
            details
        });
    },
    login: function (details) { //refresh the entire app
        Dispatcher.handleViewAction({
            actionType: Actions.LOGIN,
            details
        });
    },
    logout: function () { //refresh the entire app
        Dispatcher.handleViewAction({
            actionType: Actions.LOGOUT
        });
    },
};
