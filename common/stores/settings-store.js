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
        institutionAdded: function (institution) {
            if (!store.model) return;
            store.model.institutions.push(institution);
            store.loaded();
        },
        institutionRemoved: function (id) {
            if (!store.model) return;
            const index = _.findIndex(store.model.institutions, i => i.id === id);
            if (index === -1) return;
            store.model.institutions.splice(index, 1);
            store.loaded();
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
        case Actions.INSTITUTION_ADDED:
            controller.institutionAdded(action.institution);
            break;
        case Actions.INSTITUTION_REMOVED:
            controller.institutionRemoved(action.id);
            break;
        default:
            return;
    }
});

controller.store = store;
module.exports = controller.store;
