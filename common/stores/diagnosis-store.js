var BaseStore = require('./base/_store');
var data = require('./base/_data');
import AccountStore from './account-store';

var controller = {
        getCodes: function () {
            store.loading();
            data.get(Project.api + 'code')
                .then(res => {
                    store.model = res;
                    AsyncStorage.setItem('codes', JSON.stringify(res));
                    store.loaded();
                })
                .catch(e => AjaxHandler.error(DiagnosisStore, e));
        }
    },
    store = Object.assign({}, BaseStore, {
        id: 'diagnosis',
        getCodes: function () {
            return store.model;
        },
        search: function(term) {
            var results = [];
            term = term.toLowerCase();
            results = _.sortBy(_.filter(store.model, diagnosis => {
                return !diagnosis.deleted && diagnosis.friendlyName.toLowerCase().indexOf(term) !== -1;
            }), 'friendlyName');
            return results;
        },
        getName: function (code) {
            if (!store.model) return '';

            const diagnosis = _.find(store.model, {code});
            return diagnosis ? diagnosis.friendlyName : '';
        },
        getLink: function (code, type) {
            if (!store.model) return null;

            const diagnosis = _.find(store.model, {code});
            return diagnosis ? _.find(diagnosis.links, l => l.linkType.value === type) : null;
        }
    });

store.dispatcherIndex = Dispatcher.register(store, function (payload) {
    var action = payload.action; // this is our action from handleViewAction

    switch (action.actionType) {
        case Actions.GET_CODES:
            controller.getCodes();
            break;
        default:
            return;
    }
});

controller.store = store;
module.exports = controller.store;
