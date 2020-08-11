var BaseStore = require('./base/_store');
var data = require('./base/_data');

var controller = {
        add: function ({code, description, hidden, image}) {
            store.saving();
            const promise = image ? API.getBase64FromFile(image) : Promise.resolve();
            promise.then(base64 => {
                return data.post(`${Project.api}institutions`, Object.assign({}, image ? { logoImage: base64.substr(base64.indexOf('base64') + 7), imageFormat: image.type } : {}, { code, description, hidden }))
                    .then(res => {
                        store.model = store.model || [];
                        store.model.push(res);
                        store.savedId = res.id;
                        AppActions.institutionAdded({hidden: res.hidden, id: res.code, name: res.description});
                        store.saved();
                    });
            })
            .catch(e => AjaxHandler.error(InstitutionsStore, e));
        },
        get: function () {
            store.loading();
            return data.get(`${Project.api}institutions`)
                .then(res => {
                    store.model = res;
                    store.loaded();
                })
                .catch(e => AjaxHandler.error(InstitutionsStore, e));
        },
        delete: function (id) {
            store.saving();
            data.delete(`${Project.api}institutions/${id}`)
                .then(() => {
                    const index = _.findIndex(store.model, {id});
                    if (index === -1) return;
                    const code = store.model[index].code;
                    store.model.splice(index, 1);
                    AppActions.institutionRemoved(code);
                    store.saved();
                })
                .catch(e => AjaxHandler.error(InstitutionsStore, e));
        },
        update: function (id, institution) {
            store.saving();
            (institution.image ? API.getBase64FromFile(institution.image) : Promise.resolve())
                .then(base64 => {
                    if (base64) base64 = base64.substr(base64.indexOf('base64') + 7);
                    return data.put(`${Project.api}institutions/${id}`, Object.assign({}, { ...institution }, base64 ? { logoImage: base64, imageFormat: institution.image.type } : {}))
                        .then(res => {
                            const index = _.findIndex(store.model, {id});
                            store.model[index] = res;
                            store.savedId = id;
                            store.saved();
                        })
                })
                .catch(e => AjaxHandler.error(InstitutionsStore, e));
        },
        deleteLogo: function (id) {
            store.saving();
            data.delete(`${Project.api}institutions/${id}/logo`)
                .then(() => {
                    const index = _.findIndex(store.model, {id});
                    if (index === -1) return;
                    if (store.model[index].imageFormat) delete store.model[index].imageFormat;
                    if (store.model[index].logoData) delete store.model[index].logoData;
                    if (store.model[index].logoUrl) delete store.model[index].logoUrl;
                    store.saved();
                })
                .catch(e => AjaxHandler.error(InstitutionsStore, e));
        },
    },
    store = Object.assign({}, BaseStore, {
        id: 'institutions',
        getInstitutions: function () {
            return store.model;
        },
        refresh: function () {
            return controller.get();
        },
    });

store.dispatcherIndex = Dispatcher.register(store, function (payload) {
    var action = payload.action; // this is our action from handleViewAction

    switch (action.actionType) {
        case Actions.ADD_INSTITUTION:
            controller.add(action.data);
            break;
        case Actions.GET_INSTITUTIONS:
            controller.get();
            break;
        case Actions.REMOVE_INSTITUTION:
            controller.delete(action.id);
            break;
        case Actions.UPDATE_INSTITUTION:
            controller.update(action.id, action.institution);
            break;
        case Actions.REMOVE_INSTITUTION_LOGO:
            controller.deleteLogo(action.id);
            break;
        default:
            return;
    }
});

controller.store = store;
module.exports = controller.store;
