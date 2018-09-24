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
        },
        search: function (term) {
            var results = [];
            term = term.toLowerCase();
            results = _.sortBy(_.filter(store.model, diagnosis => {
                return !diagnosis.deleted && diagnosis.friendlyName.toLowerCase().indexOf(term) !== -1;
            }), diagnosis => {
                // Sort by highest priority display order (1) first
                var priority;
                _.each(diagnosis.links, l => {
                    if (!priority) {
                        priority = l.linkType.displayOrder;
                        return;
                    }

                    if (l.linkType.displayOrder < priority) {
                        priority = l.linkType.displayOrder;
                    }
                })
                return priority;
            }, 'friendlyName');
            console.log('results', results);
            return results;
        }
    },
    store = Object.assign({}, BaseStore, {
        id: 'diagnosis',
        getCodes: function () {
            return store.model;
        },
        search: function(term) {
            return controller.search(term);
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
