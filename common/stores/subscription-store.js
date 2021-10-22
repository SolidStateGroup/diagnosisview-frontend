var BaseStore = require('./base/_store');
var data = require('./base/_data');

var controller = {
        checkSubscription: async function ({onDone}) {
            store.loading();

            try {
                await RNIap.prepare();
            } catch (e) {}

            const subscriptions = await RNIap.getSubscriptions(iapItemSkus);
            // console.log('subscriptions', subscriptions);

            const transactionReceipt = await AsyncStorage.getItem('transactionReceipt');
            let receiptToValidate;
            if (!transactionReceipt) {
                store.purchases = await RNIap.getAvailablePurchases();
                // console.log('available purchases', store.purchases);

                // todo: set active subscription to true if there is a valid purchase
                const validPurchases = _.sortBy(store.purchases, ({transactionDate}) => -transactionDate);
                if (!validPurchases.length) {
                    store.loaded();
                    if (onDone) onDone();
                    return;
                };

                receiptToValidate = validPurchases[0].transactionReceipt;
            } else {
                receiptToValidate = transactionReceipt
            }

            const result = await API.validateReceipt(receiptToValidate);

            if (store.subscription && !result) {
                // Active subscription has expired, removed paid links from favourites
                AppActions.clearDeviceFavourites();
                AppActions.clearDeviceHistory();
            }

            store.loaded();

            if (onDone) onDone();
        },
        subscribe: function () {
            store.loading();

            const renewal = store.isSubscribed();

            RNIap.buySubscription(iapItemSkus[0])
                .then(purchase => {
                    // console.log(JSON.stringify(purchase));
                    return API.validateReceipt(Platform.OS === 'ios' ? purchase.transactionReceipt : purchase.purchaseToken);
                })
                .then(() => {
                    Alert.alert('', !renewal ? "Your subscription is active" : `Your subscription has been successfully extended to ${moment().add(1, 'y').format('DD/MM/YYYY')}`);
                    store.loaded()
                })
                .catch(e => {
                    AjaxHandler.error(SubscriptionStore, e)
                    console.error(e);
                    if (typeof e === 'object') {
                        switch (e.message) {
                            case 'You already own this item.': // Android only
                                if (store.purchases) {
                                    const sortedPurchases = _.sortBy(store.purchases, ({transactionDate}) => -transactionDate);
                                    const latestPurchase = sortedPurchases && sortedPurchases[0];
                                    if (!latestPurchase) {
                                        Alert.alert('', 'You have already purchased a subscription on this device but we are unable to retrieve the purchase from Play Store. Please contact support.');
                                        break;
                                    }
                                    store.loading();
                                    API.validateReceipt(latestPurchase.purchaseToken)
                                        .then(() => store.loaded())
                                        .catch(err => {
                                            AjaxHandler.error(SubscriptionStore, err);
                                            Alert.alert('', 'You have already purchased a subscription on this device but we were unable to validate it. Please contact support.');
                                        });
                                } else {
                                    Alert.alert('', 'You have already purchased a subscription on this device but we are unable to retrieve the purchase from Play Store. Please contact support.');
                                }
                                break;
                            case 'Cancelled.':
                                break;
                            default:
                                Alert.alert('', 'Sorry there was a problem with the subscription service. Please try again later.');
                                break;
                        }
                    } else {
                        Alert.alert('', 'Sorry there was a problem with the subscription service. Please try again later.');
                    }
                });
        },
        scheduleExpiryNotifications: (expiryDate) => {
            const now = moment();
            if (now.isBefore(moment(expiryDate).subtract(1, 'M'), 'd')) {
                console.log('Scheduling expiry warning for 1 month before expiry');
                API.push.scheduleLocalNotification('expiry-warning', 'Account expiry warning', `Your account will expire on ${moment(expiryDate).format('DD/MM/YY')}. Please renew now`, null, moment(expiryDate).subtract(1, 'M').valueOf());
            }
            if (now.isBefore(moment(expiryDate).subtract(1, 'w'), 'd')) {
                console.log('Scheduling expiry warning for 1 week before expiry');
                API.push.scheduleLocalNotification('expiry-warning', 'Account expiry warning', `Your account will expire on ${moment(expiryDate).format('DD/MM/YY')}. Please renew now`, null, moment(expiryDate).subtract(1, 'w').valueOf());
            }
            if (now.isBefore(moment(expiryDate).subtract(1, 'd'), 'd')) {
                console.log('Scheduling expiry warning for 1 day before expiry');
                API.push.scheduleLocalNotification('expiry-warning', 'Account expiry warning', 'Your account expires tomorrow. Please renew now for continued access to unlimited history/favourites on all devices', null, moment(expiryDate).subtract(1, 'd').valueOf());
            }
        },
        setSubscription: function ({autoRenewing, expiryDate, result, receipt}) {
            if (!autoRenewing) {
                controller.scheduleExpiryNotifications(expiryDate);
            } else {
                API.push.cancelAllNotifications();
            }
            const user = AccountStore.getUser();
            if (user && !user.activeSubscription && moment(store.subscription.expiryDate).isAfter(moment())) {
                const purchase = Platform.select({
                    ios: { transactionReceipt: result.latest_receipt },
                    android: { data: JSON.stringify({ packageName: DeviceInfo.getBundleId(), productId: iapItemSkus[0], purchaseToken: receipt }) },
                })
                AppActions.subscribe(purchase, true);
            }
            store.subscription = { autoRenewing, expiryDate: expiryDate.valueOf(), receipt };
            AsyncStorage.setItem('subscription', JSON.stringify(store.subscription));
        },
    },
    store = Object.assign({}, BaseStore, {
        id: 'subscription',
        subscription: null,
        isSubscribed: function () {
            if (!API.isMobile) return true
            return AccountStore.isAdmin() || (store.subscription && moment(store.subscription.expiryDate).isAfter(moment()));
        },
        isSubscriptionAutoRenewing: function () {
            return store.subscription && store.subscription.autoRenewing;
        },
        getSubscriptionExpiryDate: function() {
            return store.subscription && store.subscription.expiryDate;
        },
        getReceipt: function() {
            return store.subscription && store.subscription.receipt;
        },
        getPurchase: function() {
            if (!store.subscription) return null;
            return Platform.select({
                ios: { transactionReceipt: store.subscription.receipt },
                android: { data: JSON.stringify({ packageName: DeviceInfo.getBundleId(), productId: iapItemSkus[0], purchaseToken: store.subscription.receipt }) },
            });
        }
    });

store.dispatcherIndex = Dispatcher.register(store, function (payload) {
    var action = payload.action; // this is our action from handleViewAction

    switch (action.actionType) {
        case Actions.CHECK_SUBSCRIPTION:
            controller.checkSubscription(action.callbacks);
            break;
        case Actions.BUY_SUBSCRIPTION:
            controller.subscribe();
            break;
        case Actions.SET_SUBSCRIPTION:
            controller.setSubscription(action.details);
            break;
        default:
            return;
    }
});

controller.store = store;
module.exports = controller.store;
