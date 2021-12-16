var BaseStore = require('./base/_store');
var data = require('./base/_data');

var controller = {
        register: (details) => {
            store.saving();
            var favouritesToSync = controller.getFavouritesToSync(FavouritesStore.model);
            var historyToSync = controller.getHistoryToSync(HistoryStore.model);

            data.post(Project.api + 'register', details)
                .then(res => {
                    // Get device favourites and history to sync with server
                    controller.onLogin(res);
                    store.saved();
                    if (!SubscriptionStore.isSubscribed()) {
                        AppActions.buySubscription();
                    } else {
                        controller.subscribe(SubscriptionStore.getPurchase(), true);
                    }
                })
                .then(res => favouritesToSync.length ? data.put(Project.api + 'user/sync/favourites', favouritesToSync) : Promise.resolve(res)) // Sync favourites
                .then(res => historyToSync.length ? data.put(Project.api + 'user/sync/history', historyToSync) : Promise.resolve(res)) // Sync history
                .catch(e => AjaxHandler.error(AccountStore, e));
        },
        setToken: (token) => {
            data.setToken(token);
        },
        adminLogin: (details) => {
            //deprecated
            return controller.login(details)
        },
        login: (details) => {
            store.loading();
            AsyncStorage.setItem("history","")
            AsyncStorage.setItem("favourites","")
            data.post(Project.api + 'login', details)
                .then(res => {
                    controller.setToken(res && res.token);
                    return DiagnosisStore.refreshCodes().then(() => res)
                })
                .then(res => {

                    res = controller.processUser(res);

                    if (SubscriptionStore.isSubscribed() && !res.activeSubscription) {
                        controller.subscribe(SubscriptionStore.getPurchase(), true);
                    }

                        controller.setToken(res && res.token);
                    return res;
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
            SubscriptionStore.trigger("changed")
            controller.setToken(res && res.token);
        },


        setUser: function (user) {
            controller.onLogin(user);
            controller.getAccount()
            store.loaded();
        },

        logout: function () {
            controller.setUser(null);
            AppActions.clearDeviceFavourites();
            AppActions.clearDeviceHistory();
            AsyncStorage.setItem("subscriptionLinkedTo", "")
            AsyncStorage.setItem("history","")
            SubscriptionStore.subscription = null;
            AsyncStorage.setItem("favourites","")
            API.push && API.push.cancelAllNotifications();
        },

        getFavouritesToSync: function (serverFavourites) {
            var favouritesToSync = [];
            const deviceFavourites = FavouritesStore.getFavourites();
            _.each(deviceFavourites, deviceFave => {
                if (!_.find(serverFavourites, subFave => subFave.code === deviceFave.code && subFave.type === deviceFave.link.linkType.value)) {
                    // console.log('Syncing device favourite to server', deviceFave);
                    favouritesToSync.push({linkId: deviceFave.link.id, code: deviceFave.code, type: deviceFave.link.linkType.value, dateAdded: deviceFave.date});
                }
            });
            return favouritesToSync;
        },

        getHistoryToSync: function (serverHistory) {
            var historyToSync = [];
            const deviceHistory = HistoryStore.getHistory();
            _.map(deviceHistory, deviceEntry => {
                if (!_.find(serverHistory, subEntry => subEntry.code === deviceEntry.item.code && subEntry.dateAdded === deviceEntry.date)) {
                    // console.log('Syncing device history entry to server', deviceEntry);
                    historyToSync.push({code: deviceEntry.item.code, dateAdded: deviceEntry.date});
                }
            });
            return historyToSync;
        },

        subscribe: function (purchase, silent) {
            if (!store.model) return;

            store.saving();

            // Get device favourites and history to sync with server

            // Validate purchase
            // console.log(JSON.stringify(purchase));
            AsyncStorage.getItem('subscriptionLinkedTo')
                .then(res => {
                    if (res && res != store.model.id) {
                        // console.log('Attempted to activate subscription on device which already linked subscription to another account');
                        store.saved();
                        return Promise.reject(new Error('Attempted to activate subscription on device which already linked subscription to another account'));
                    }
                    return data.post(`${Project.api}user/validate/${Platform.OS}`, purchase)
                        .then((res)=>{
                            API.finalisePurchases()
                            return res
                        })
                })
                .then(res => {
                    AppActions.getAccount()
                    AsyncStorage.setItem("subscriptionLinkedTo", store.model.id.toString());
                    AsyncStorage.removeItem("retrySubscription");
                    return res;
                })
                .catch(e => {
                    if (e instanceof Error) {
                        return Promise.reject(e);
                    }
                    return e.json().then(err => {
                        // console.log('Failed to validate purchase', err);
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
                        // console.log('Failed to validate purchase', err);
                        AsyncStorage.setItem("retrySubscription", JSON.stringify(purchase));
                        return data.get(Project.api + 'account');
                    })
                })
                .then(res => {
                    // console.log(res);
                    store.model = this.processUser(res);
                    AsyncStorage.setItem('user', JSON.stringify(store.model));
                    store.saved();
                });
        },

        processUser: (res) => {
            return res;
        },

        getAccount: function (retrySubscription) {
            if (!store.model) return;

            DiagnosisStore.refresh()
                .then(LinkLogoStore.refresh)
                .then(() => data.get(Project.api + 'account'))
                .then(res => {
                    if (res.deleted) {
                        return controller.logout();
                    }
                    res = controller.processUser(res);

                    if (store.model.activeSubscription && !res.activeSubscription) {
                        // Active subscription has expired, removed paid links from favourites
                        AppActions.clearDeviceFavourites();
                        AppActions.clearDeviceHistory();
                    }

                    if (retrySubscription) {
                        res.activeSubscription = true;
                    }

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

            const institutionChanged = details.institution !== store.model.institution;

            store.saving();
            data.put(Project.api + 'user/', details)
                .then(res => {
                    if (!institutionChanged) return res;

                    return DiagnosisStore.refreshCodes().then(() => res);
                })
                .then(res => {
                    res = controller.processUser(res);

                    // console.log(res);

                    controller.onLogin(res);
                    store.saved();
                })
                .catch(e => AjaxHandler.error(AccountStore, e));
        },
        updateSubscription: function (details) {
            if (!store.model) return;
            store.saving();
            data.post(Project.api + 'user/subscriptions/chargebee', details)
                .then(res => {
                    controller.getAccount()
                })
                .then(res => {
                    store.saved();
                })
                .catch(e => AjaxHandler.error(AccountStore, e));
        },
    },
    store = Object.assign({}, BaseStore, {
        id: 'account',
        getUser: function () {
            return store.model
        },
        getExpiryDate: function () {
            if(store.model) {
                return moment(store.model.expiryDate)
            }
            return SubscriptionStore.subscription && moment(SubscriptionStore.subscription.expiryDate);
        },
        neverSubscribed: function () {
            if (API.isMobile && !store.model) {
                return !SubscriptionStore.subscription;
            }
            return !store.model || !store.model.expiryDate
        },
        hasActiveSubscription: function () {
            if (Constants.simulate.SUBSCRIBED) {
                return true
            }
            if (store.isAdmin())
                return true

            if (API.isMobile && !store.model) {
                return SubscriptionStore.isSubscribed();
            }
            return !store.hasExpiredSubscription() && store.model && store.model.activeSubscription;
        },
        isMobileSubscription: function (){
            if (Constants.simulate.MOBILE_SUBSCRIBED) {
                return true
            }
            return store.hasActiveSubscription() && !store.model.chargebeePlanId
        },
        hasExpiredSubscription: function () {
            if (store.isAdmin())
                return false

            return store.model && store.model.expiryDate && !store.model.autoRenewing && moment(store.model.expiryDate).isBefore(moment()) && store.model.expiryDate
        },
        setUser: function(user) {
            controller.setUser(user);
        },
        isAdmin: function () {
            return store.model && store.model.roleType === 'ADMIN';
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
        case Actions.UPDATE_SUBSCRIPTION:
            controller.updateSubscription(action.data);
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
