var BaseStore = require('./base/_store');
var data = require('./base/_data');
import AccountStore from './account-store';

var controller = {
        addToHistory: function (item) {
            store.saving();
                const search = {
                    item,
                    date: moment().valueOf()
                };
                if (AccountStore.model) {
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
                    AsyncStorage.getItem('history', (err, res) => {
                        if (err) {
                            store.goneABitWest(err);
                            console.log(err);
                            return;
                        }

                        var history = res ? JSON.parse(res) : [];

                        history.push(search);
                        history = _.sortBy(history, entry => moment(entry.date).valueOf());
                        if (history.length > 20) { // Only store 20 on the device
                            history.splice(0, 1);
                        }

                        store.model = history;
                        AsyncStorage.setItem("history", JSON.stringify(history));
                        store.saved();
                    })
                }
        },
        getHistory: function () {

            store.loading();
            if (!AccountStore.model) {
                store.loaded()
                return
            }
            data.get(Project.api + 'user/history')
                .then(res => {
                    store.model = res.map((v)=>{
                        return {
                            "item": {
                                "code": v.code,
                                "friendlyName": v.friendlyName
                            },
                            "date": v.dateAdded
                        }
                    });
                    AsyncStorage.setItem("history", JSON.stringify(store.model))
                    store.loaded();
                })
        },
        clearDeviceHistory: function () {
            store.loading();
            store.model = null;
            AsyncStorage.setItem("history", "")
            store.loaded();
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
        case Actions.CLEAR_DEVICE_HISTORY:
            controller.clearDeviceHistory();
            break;
        default:
            return;
    }
});

controller.store = store;
module.exports = controller.store;
