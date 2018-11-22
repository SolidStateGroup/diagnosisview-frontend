var BaseStore = require('./base/_store');
var data = require('./base/_data');

var controller = {
        register: (details) => {
            store.saving();
            data.post(Project.api + 'register', details)
                .then(res => {
                    controller.onLogin(res);
                    store.saved();
                    API.subscribe();
                })
                .catch(e => AjaxHandler.error(AccountStore, e));
        },
        setToken: (token) => {
            data.setToken(token);
        },
        adminLogin: (details) => {
            store.loading();
            data.post(Project.api + 'admin/login', details)
                .then(res => {
                    controller.onLogin(res);
                    store.loaded();
                })
                .catch(e => AjaxHandler.error(AccountStore, e));
        },
        login: (details) => {
            store.loading();
            data.post(Project.api + 'login', details)
                .then(res => {
                    // Get device favourites and history to sync with server
                    var favouritesToSync = controller.getFavouritesToSync(res.favourites);
                    var historyToSync = controller.getHistoryToSync(res.history);

                    res = controller.processUser(res);

                    if (res.activeSubscription && !res.autoRenewing) {
                        controller.scheduleExpiryNotifications(res.expiryDate);
                    }

                    if (res.activeSubscription && (favouritesToSync.length || historyToSync.length)) {
                        controller.setToken(res && res.token);
                        return (favouritesToSync.length ? data.put(Project.api + 'user/sync/favourites', favouritesToSync) : Promise.resolve(res))
                            .then(res => historyToSync.length ? data.put(Project.api + 'user/sync/history', historyToSync) : Promise.resolve(res))
                            .then(res => {
                                return controller.processUser(res);
                            })
                    } else {
                        return res;
                    }
                })
                .then(res => {
                    controller.onLogin(res);
                    store.loaded();
                })
                .catch(e => AjaxHandler.error(AccountStore, e));
        },

        onLogin(res) {
            store.model = res;
            if (!res) {
                AsyncStorage.removeItem('user');
            } else {
                AsyncStorage.setItem('user', JSON.stringify(res));
            }
            controller.setToken(res && res.token);
        },


        setUser: function (user) {
            controller.onLogin(user);
            store.loaded();
        },

        logout: function () {
            controller.setUser(null);
            AppActions.setDeviceFavourites();
            AppActions.setDeviceHistory();
            API.push && API.push.cancelAllNotifications();
        },

        getFavouritesToSync: function (serverFavourites) {
            var favouritesToSync = [];
            const deviceFavourites = FavouritesStore.getFavourites();
            _.each(deviceFavourites, deviceFave => {
                if (!_.find(serverFavourites, subFave => subFave.code === deviceFave.code && subFave.type === deviceFave.link.linkType.value)) {
                    console.log('Syncing device favourite to server', deviceFave);
                    favouritesToSync.push({code: deviceFave.code, type: deviceFave.link.linkType.value, dateAdded: deviceFave.date});
                }
            });
            return favouritesToSync;
        },

        getHistoryToSync: function (serverHistory) {
            var historyToSync = [];
            const deviceHistory = HistoryStore.getHistory();
            _.map(deviceHistory, deviceEntry => {
                if (!_.find(serverHistory, subEntry => subEntry.code === deviceEntry.item.code && subEntry.dateAdded === deviceEntry.date)) {
                    console.log('Syncing device history entry to server', deviceEntry);
                    historyToSync.push({code: deviceEntry.item.code, dateAdded: deviceEntry.date});
                }
            });
            return historyToSync;
        },

        subscribe: function (purchase, silent) {
            store.saving();

            const renewal = store.model.paymentData && store.model.paymentData.length ? true : false;

            // Get device favourites and history to sync with server
            var favouritesToSync = controller.getFavouritesToSync(store.model.favourites);
            var historyToSync = controller.getHistoryToSync(store.model.history);

            // Validate purchase
            console.log(JSON.stringify(purchase));
            data.post(`${Project.api}user/validate/${Platform.OS}`, purchase)
                .then(res => {
                    AsyncStorage.removeItem("retrySubscription");
                    return res;
                })
                .catch(e => {
                    return e.json().then(err => {
                        console.log('Failed to validate purchase', err);
                        if (err.status === 400) { // Failed validation
                            store.model.activeSubscription = false;
                            AsyncStorage.setItem('user', JSON.stringify(store.model));
                            store.saved();
                            return Promise.reject("Failed to validate purchase");
                        } else {
                            // Something else has gone wrong, store this purchase retry and return account to enable subscription on device
                            AsyncStorage.setItem("retrySubscription", JSON.stringify(purchase));
                            return data.get(Project.api + 'account');
                        }
                    })
                    .catch(err => {
                        // Something has gone very wrong, store this purchase for retry and return account to enable subscription on device
                        console.log('Failed to validate purchase', err);
                        AsyncStorage.setItem("retrySubscription", JSON.stringify(purchase));
                        return data.get(Project.api + 'account');
                    })
                })
                .then(res => favouritesToSync.length ? data.put(Project.api + 'user/sync/favourites', favouritesToSync) : Promise.resolve(res)) // Sync favourites
                .then(res => historyToSync.length ? data.put(Project.api + 'user/sync/history', historyToSync) : Promise.resolve(res)) // Sync history
                .then(res => {
                    console.log(res);
                    if (!silent) {
                        Alert.alert('', !renewal ? "Your account has been successfully activated" : `Your account has been successfully extended to ${moment().add(1, 'y').format('DD/MM/YYYY')}`);
                    }
                    store.model = this.processUser(res);
                    AsyncStorage.setItem('user', JSON.stringify(store.model));
                    if (!res.autoRenewing) {
                        controller.scheduleExpiryNotifications(res.expiryDate);
                    } else {
                        API.push.cancelAllNotifications();
                    }
                    store.saved();
                });
        },

        scheduleExpiryNotifications: (expiryDate) => {
            const now = moment();
            if (now.isBefore(moment(expiryDate).subtract(1, 'M'), 'd')) {
                console.log('Scheduling expiry warning for 1 month before expiry');
                API.push.scheduleLocalNotification('expiry-warning', 'Account expiry warning', `Your account will expire on ${expiryDate.format('DD/MM/YY')}. Please renew now`, null, expiryDate.subtract(1, 'M').valueOf());
            }
            if (now.isBefore(moment(expiryDate).subtract(1, 'w'), 'd')) {
                console.log('Scheduling expiry warning for 1 week before expiry');
                API.push.scheduleLocalNotification('expiry-warning', 'Account expiry warning', `Your account will expire on ${expiryDate.format('DD/MM/YY')}. Please renew now`, null, expiryDate.subtract(1, 'w').valueOf());
            }
            if (now.isBefore(moment(expiryDate).subtract(1, 'd'), 'd')) {
                console.log('Scheduling expiry warning for 1 day before expiry');
                API.push.scheduleLocalNotification('expiry-warning', 'Account expiry warning', 'Your account expires tomorrow. Please renew now for continued access to unlimited history/favourites on all devices', null, expiryDate.subtract(1, 'd').valueOf());
            }
        },

        processUser: (res) => {
            if (Constants.simulate.SUBSCRIBED) {
                console.log("WARNING: SIMULATING SUBSCRIPTION")
                res.activeSubscription = true;
                if (Constants.simulate.EXPIRY) {
                    res.paymentData = res.paymentData || [];
                    res.expiryDate = moment().add(1, 'y').subtract(14, 'days').valueOf();
                    res.paymentData.unshift(JSON.stringify({expiryTimeMillis: res.expiryDate, autoRenewing: false}));
                    res.activeSubscription = res.expiryDate.isAfter(moment());
                }
            }

            if (res.activeSubscription && res.favourites && res.favourites.length) {
                AppActions.setSubscribedFavourites(res.favourites);
            }

            if (res.activeSubscription && res.history && res.history.length) {
                AppActions.setSubscribedHistory(res.history);
            }

            return res;
        },

        getAccount: function (retrySubscription) {
            if (!store.model) return;

            DiagnosisStore.refresh()
                .then(() => data.get(Project.api + 'account'))
                .then(res => {
                    if (res.deleted) {
                        return controller.logout();
                    }
                    res = controller.processUser(res);

                    if (store.model.autoRenewing && !res.autoRenewing && res.activeSubscription) {
                        // Active subscription but cancelled (Android only), schedule expiry notifications
                        controller.scheduleExpiryNotifications(res.expiryDate);
                    }

                    if (store.model.activeSubscription && !res.activeSubscription) {
                        // Active subscription has expired, removed paid links from favourites
                        AppActions.setDeviceFavourites();
                    }

                    if (retrySubscription) {
                        res.activeSubscription = true;
                    }

                    console.log(res);

                    controller.onLogin(res);

                    if (retrySubscription) {
                        controller.subscribe(retrySubscription, true);
                    }
                    store.loaded();
                })
                .catch(e => AjaxHandler.error(AccountStore, e));
        },

        updateAccount: function (details) {
            if (!store.model) return;

            store.saving();
            data.put(Project.api + 'user/', details)
                .then(res => {
                    res = controller.processUser(res);

                    console.log(res);

                    controller.onLogin(res);
                    store.saved();
                })
                .catch(e => AjaxHandler.error(AccountStore, e));
        }
    },
    store = Object.assign({}, BaseStore, {
        id: 'account',
        getUser: function () {
            return store.model
        },
        isSubscribed: function () {
            return store.model && store.model.activeSubscription;
        },
        setUser: function(user) {
            controller.setUser(user);
        }
    });

store.dispatcherIndex = Dispatcher.register(store, function (payload) {
    var action = payload.action; // this is our action from handleViewAction

    switch (action.actionType) {
        case Actions.SET_USER:
            controller.setUser(action.user);
            break;
        case Actions.LOGOUT:
            controller.logout();
            break;
        case Actions.REGISTER:
            controller.register(action.details);
            break;
        case Actions.LOGIN:
            controller.login(action.details);
            break;
        case Actions.SUBSCRIBE:
            controller.subscribe(action.receipt, action.silent);
            break;
        case Actions.GET_ACCOUNT:
            controller.getAccount(action.retrySubscription);
            break;
        case Actions.UPDATE_ACCOUNT:
            controller.updateAccount(action.details);
            break;
        case Actions.SET_TOKEN:
            controller.setToken(action.token);
            break;
        case Actions.ADMIN_LOGIN:
            controller.adminLogin(action.details);
            break;
        default:
            return;
    }
});

controller.store = store;
module.exports = controller.store;
