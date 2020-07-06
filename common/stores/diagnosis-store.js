var BaseStore = require('./base/_store');
var data = require('./base/_data');
import AccountStore from './account-store';

var controller = {
        getCodes: function (isAdmin) {
            store.loading();
            return data.get(Project.api + (isAdmin ? 'admin/codes' : 'code'))
                .then(res => {
                    store.model = res;
                    AsyncStorage.setItem('codes', JSON.stringify(res));
                    store.loaded();
                })
                .catch(e => AjaxHandler.error(DiagnosisStore, e));
        },
        getCategories: function () {
            store.loading();
            return data.get(Project.api + 'category')
                .then(res => {
                    store.categories = res;
                    AsyncStorage.setItem('codeCategories', JSON.stringify(res));
                    store.loaded();
                })
                .catch(e => AjaxHandler.error(DiagnosisStore, e));
        },
        getExternalStandards: function () {
            store.loading();
            return data.get(Project.api + 'admin/code/external-standards')
                .then(res => {
                    store.externalStandards = res;
                    AsyncStorage.setItem('externalStandards', JSON.stringify(res));
                    store.loaded();
                })
                .catch(e => AjaxHandler.error(DiagnosisStore, e));
        },
        search: function (term) {
            var results = [];
            term = term.toLowerCase();
            results = _.sortBy(_.filter(store.model, diagnosis => {
                return !diagnosis.deleted && diagnosis.friendlyName && diagnosis.friendlyName.toLowerCase().indexOf(term) !== -1;
            }), 'friendlyName');
            return results;
        },
        categorySearch: function (term) {
            var results = [];
            term = term.toLowerCase();
            results = _.sortBy(_.filter(store.categories, category => {
                return !category.hidden && category.friendlyDescription.toLowerCase().indexOf(term) !== -1;
            }), 'friendlyDescription');
            return results;
        },
        updateCode: function (diagnosis) {
            store.saving();
            data.put(Project.api + 'code', diagnosis)
                .then(res => {
                    var index = _.findIndex(store.model, diagnosis => diagnosis.code === res.code);
                    store.model[index] = res;
                    AsyncStorage.setItem('codes', JSON.stringify(res));
                    store.saved();
                })
                .catch(e => AjaxHandler.error(DiagnosisStore, e));
        },
        updateLink: function (code, linkId, changes) {
            store.saving();
            data.put(Project.api + 'admin/code/link', {
                id: linkId,
                ...changes
            })
                .then(res => {
                    var index = _.findIndex(store.model, diagnosis => diagnosis.code === code);
                    const linkIndex = _.findIndex(store.model[index].links, link => link.linkType.id === res.linkType.id);
                    store.model[index].links[linkIndex] = res;
                    AsyncStorage.setItem('codes', JSON.stringify(res));
                    store.saved();
                })
                .catch(e => AjaxHandler.error(DiagnosisStore, e));
        },
        deleteCode: function (code) {
            store.saving();
            data.delete(`${Project.api}admin/code`, {
                code,
            })
                .then(() => {
                    const index = _.findIndex(store.model, diagnosis => diagnosis.code === code);
                    if (index !== -1) {
                        store.model.splice(index, 1);
                        AsyncStorage.setItem('codes', JSON.stringify(res));
                    }
                    store.saved();
                })
                .catch(e => AjaxHandler.error(DiagnosisStore, e));
        },
    },
    store = Object.assign({}, BaseStore, {
        id: 'diagnosis',
        getCodes: function () {
            return store.model;
        },
        getCategories: function () {
            return store.categories;
        },
        getExternalStandards: function () {
            return store.externalStandards;
        },
        search: function(term) {
            return controller.search(term);
        },
        categorySearch: function (term) {
            return controller.categorySearch(term);
        },
        filterByCategory: function (category) {
            return _.filter(store.model, diagnosis => {
                return !diagnosis.deleted && _.find(diagnosis.categories, c => c.number === category.number);
            })
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
        },
        getLinkById: function (code, id) {
            if (!store.model) return null;

            const diagnosis = _.find(store.model, {code});
            return diagnosis ? _.find(diagnosis.links, {id}) : null;
        },
        refresh: function () {
            return Promise.all([controller.getCodes(), controller.getCategories()]);
        },
        refreshCodes: function() {
            return controller.getCodes();
        }
    });

store.dispatcherIndex = Dispatcher.register(store, function (payload) {
    var action = payload.action; // this is our action from handleViewAction

    switch (action.actionType) {
        case Actions.GET_CODES:
            controller.getCodes(action.isAdmin);
            break;
        case Actions.GET_CODE_CATEGORIES:
            controller.getCategories();
            break;
        case Actions.UPDATE_CODE:
            controller.updateCode(action.diagnosis);
            break;
        case Actions.UPDATE_LINK:
            controller.updateLink(action.code, action.linkId, action.changes);
            break;
        case Actions.GET_EXTERNAL_STANDARDS:
            controller.getExternalStandards();
            break;
        case Actions.DELETE_CODE:
            controller.deleteCode(action.code);
            break;
        default:
            return;
    }
});

controller.store = store;
module.exports = controller.store;
