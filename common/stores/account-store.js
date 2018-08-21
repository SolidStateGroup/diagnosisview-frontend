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
        login: (details) => {
            store.loading();
            data.post(Project.api + 'login', details)
                .then(res => {
                    // Get device favourites and history to sync with server
                    var favouritesToSync = controller.getFavouritesToSync(res.favourites);
                    var historyToSync = controller.getHistoryToSync(res.history);

                    res = controller.processUser(res);

                    if (res.subscribed && !res.autoRenewing) {
                        controller.scheduleExpiryNotifications();
                    }

                    if (res.subscribed && (favouritesToSync.length || historyToSync.length)) {
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
            // console('is valid?', Platform.OS === 'ios' ?
            //     RNIap.validateReceiptIos(purchase.transactionReceipt, Project.debug) :
            //     RNIap.validateReceiptAndroid("com.solidstategroup.dvmobile.test", iapItemSkus[0], purchase.purchaseToken, '', true));
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
                            store.model.subscribed = false;
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
                        controller.scheduleExpiryNotifications();
                    }
                    store.saved();
                });
        },

        scheduleExpiryNotifications: () => {
            API.push.scheduleLocalNotification('expiry-warning', 'Account expiry warning', `Your account will expire on ${moment().add(1, 'y').format('DD/MM/YY')}. Please renew now`, null, moment().add(1, 'y').subtract(1, 'M').valueOf());
            API.push.scheduleLocalNotification('expiry-warning', 'Account expiry warning', `Your account will expire on ${moment().add(1, 'y').format('DD/MM/YY')}. Please renew now`, null, moment().add(1, 'y').subtract(1, 'w').valueOf());
            API.push.scheduleLocalNotification('expiry-warning', 'Account expiry warning', 'Your account expires tomorrow. Please renew now for continued access to unlimited history/favourites on all devices', null, moment().add(1, 'y').subtract(1, 'd').valueOf());
        },

        processUser: (res) => {
            res.subscribed = res.subscribed || res.activeSubscription || (res.paymentData && res.paymentData.length ? moment(JSON.parse(_.last(res.paymentData).response).expiryTimeMillis).isAfter(moment()) : false);

            if (Constants.simulate.SUBSCRIBED) {
                console.log("WARNING: SIMULATING SUBSCRIPTION")
                res.subscribed = true;
                if (Constants.simulate.EXPIRY) {
                    res.paymentData = res.paymentData || [];
                    const expiryDate = moment().add(1, 'y').subtract(14, 'days').valueOf();
                    res.paymentData.unshift(JSON.stringify({expiryTimeMillis: expiryDate, autoRenewing: false}));
                    res.subscribed = expiryDate.isAfter(moment());
                }
            }

            if (res.subscribed && res.favourites && res.favourites.length) {
                AppActions.setSubscribedFavourites(res.favourites);
            }

            if (res.subscribed && res.history && res.history.length) {
                AppActions.setSubscribedHistory(res.history);
            }

            return res;
        },

        getAccount: function (retrySubscription) {
            if (!store.model) return;

            store.loading();
            data.get(Project.api + 'account')
                .then(res => {
                    if (res.deleted) {
                        return controller.logout();
                    }
                    res = controller.processUser(res);

                    if (retrySubscription) {
                        res.subscribed = true;
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
            return store.model && store.model.subscribed;
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
        default:
            return;
    }
});

controller.store = store;
module.exports = controller.store;
