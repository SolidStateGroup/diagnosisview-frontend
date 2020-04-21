var BaseStore = require('./base/_store');
var data = require('./base/_data');

var controller = {
        get: function () {
            store.loading();
            return data.get(`${Project.public}settings`)
                .then(res => {
                    store.model = res;
                    store.loaded();
                })
                .catch(e => AjaxHandler.error(SettingsStore, e));
        },
    },
    store = Object.assign({}, BaseStore, {
        id: 'settings',
        getSettings: function () {
            return store.model;
        },
        refresh: function () {
            return controller.get();
        },
    });

store.dispatcherIndex = Dispatcher.register(store, function (payload) {
    var action = payload.action; // this is our action from handleViewAction

    switch (action.actionType) {
        case Actions.GET_SETTINGS:
            controller.get();
            break;
        default:
            return;
    }
});

controller.store = store;
module.exports = controller.store;
