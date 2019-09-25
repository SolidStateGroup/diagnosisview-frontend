var BaseStore = require('./base/_store');
var data = require('./base/_data');

var controller = {
        add: function (type, criteria, link, transformation) {
            store.saving();
            data.post(`${Project.api}link/rules`, { criteriaType: type, criteria, link, transformation })
                .then(res => {
                    store.model = store.model || [];
                    store.model.push(res);
                    store.savedId = res.id;
                    store.saved();
                })
                .catch(e => AjaxHandler.error(LinkTransformStore, e));
        },
        get: function () {
            store.loading();
            data.get(`${Project.api}link/rules`)
                .then(res => {
                    store.model = res;
                    store.loaded();
                })
                .catch(e => AjaxHandler.error(LinkTransformStore, e));
        },
        delete: function (id) {
            store.saving();
            data.delete(`${Project.api}link/rules/${id}`)
                .then(() => {
                    store.model.splice(_.findIndex(store.model, {id}), 1);
                    store.saved();
                })
                .catch(e => AjaxHandler.error(LinkTransformStore, e));
        },
        update: function (id, transform) {
            store.saving();
            data.put(`${Project.api}link/rules/${id}`, transform)
                .then(res => {
                    const index = _.findIndex(store.model, {id});
                    store.model[index] = res;
                    store.savedId = id;
                    store.saved();
                })
                .catch(e => AjaxHandler.error(LinkTransformStore, e));
        },
    },
    store = Object.assign({}, BaseStore, {
        id: 'linkTransform',
        getTransforms: function () {
            return store.model;
        },
    });

store.dispatcherIndex = Dispatcher.register(store, function (payload) {
    var action = payload.action; // this is our action from handleViewAction

    switch (action.actionType) {
        case Actions.ADD_LINK_TRANSFORM:
            controller.add(action.type, action.criteria, action.link, action.transformation);
            break;
        case Actions.GET_LINK_TRANSFORMS:
            controller.get();
            break;
        case Actions.REMOVE_LINK_TRANSFORM:
            controller.delete(action.id);
            break;
        case Actions.UPDATE_LINK_TRANSFORM:
            controller.update(action.id, action.transform);
            break;
        default:
            return;
    }
});

controller.store = store;
module.exports = controller.store;
