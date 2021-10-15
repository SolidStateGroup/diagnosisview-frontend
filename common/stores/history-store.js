var BaseStore = require('./base/_store');
var data = require('./base/_data');
import AccountStore from './account-store';

var controller = {
        addToHistory: function (item) {
            store.saving();
            AsyncStorage.getItem('history', (err, res) => {
                if (err) {
                    store.goneABitWest(err);
                    console.log(err);
                    return;
                }

                var history = res ? JSON.parse(res) : [];
                const search = {
                    item,
                    date: moment().valueOf()
                };
                history.push(search);
                history = _.sortBy(history, entry => moment(entry.date).valueOf());
                if (history.length > 20) { // Only store 20 on the device
                    history.splice(0, 1);
                }

                if (AccountStore.hasActiveSubscription()) {
                    data.put(Project.api + 'user/history', {code: item.code, dateAdded: search.date})
                        .then(res => {
                            // console.log(res);
                            store.model = store.model || [];
                            store.model.push(search);
                            AsyncStorage.setItem("history", JSON.stringify(history));
                            store.saved();
                        })
                        .catch(e => AjaxHandler.error(HistoryStore, e));
                } else {
                    store.model = history;
                    AsyncStorage.setItem("history", JSON.stringify(history));
                    store.saved();
                }
            })
        },
        getHistory: function () {
            if (!AccountStore.hasActiveSubscription()) return;

            store.loading();
            // data.get('user/history')
            //     .then(res => {
                // @TODO mutate results with the name of the diangosis
            //         store.model = res;
            //         store.loaded();
            //     })
            setTimeout(() => {
                store.loaded();
            }, 2000);
        },
        setSubscribedHistory: function (subscribedHistory) {
            // Convert them to what we would normally store
            var history = [];
            _.each(subscribedHistory, h => {
                history.push({
                    item: {
                        code: h.code,
                        friendlyName: DiagnosisStore.getName(h.code)
                    },
                    date: h.dateAdded,
                })
            });
            AsyncStorage.setItem("history", JSON.stringify(_.take(_.reverse(_.sortBy(history, entry => moment(entry.date).valueOf())), 20)))
            store.model = history;
            store.loaded();
        },
        setDeviceHistory: function () {
            store.loading();
            AsyncStorage.getItem('history', (err, res) => {
                if (err) {
                    store.goneABitWest(err);
                    console.log(err);
                    return;
                }

                store.model = res ? JSON.parse(res) : [];
                store.loaded();
            })
        }
    },
    store = Object.assign({}, BaseStore, {
        id: 'history',
        getHistory: function () {
            return store.model;
        },
    });

store.dispatcherIndex = Dispatcher.register(store, function (payload) {
    var action = payload.action; // this is our action from handleViewAction

    switch (action.actionType) {
        case Actions.ADD_TO_HISTORY:
            controller.addToHistory(action.item);
            break;
        case Actions.GET_HISTORY:
            controller.getHistory();
            break;
        case Actions.SET_SUBSCRIBED_HISTORY:
            controller.setSubscribedHistory(action.history);
            break;
        case Actions.SET_DEVICE_HISTORY:
            controller.setDeviceHistory();
            break;
        default:
            return;
    }
});

controller.store = store;
module.exports = controller.store;
