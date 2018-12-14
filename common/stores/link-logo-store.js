var BaseStore = require('./base/_store');
var data = require('./base/_data');

var controller = {
        add: function (startsWith, image, overrideDifficultyLevel) {
            store.saving();
            API.getBase64FromFile(image)
                .then(base64 => {
                    base64 = base64.substr(base64.indexOf('base64') + 7);
                    return data.post(`${Project.api}logo/rules`, { image: base64, imageFormat: image.type, startsWith, overrideDifficultyLevel })
                        .then(res => {
                            store.model = store.model || [];
                            store.model.push(res);
                            store.savedId = res.id;
                            store.saved();
                        });
                })
                .catch(e => AjaxHandler.error(LinkLogoStore, e));
        },
        get: function () {
            store.loading();
            data.get(`${Project.api}logo/rules`)
                .then(res => {
                    store.model = res;
                    store.loaded();
                })
                .catch(e => AjaxHandler.error(LinkLogoStore, e));
        },
        delete: function (id) {
            store.saving();
            data.delete(`${Project.api}logo/rules/${id}`)
                .then(() => {
                    store.model.splice(_.findIndex(store.model, {id}), 1);
                    store.saved();
                })
                .catch(e => AjaxHandler.error(LinkLogoStore, e));
        },
        update: function (id, linkLogo) {
            store.saving();
            (linkLogo.image ? API.getBase64FromFile(linkLogo.image) : Promise.resolve())
                .then(base64 => {
                    if (base64) base64 = base64.substr(base64.indexOf('base64') + 7);
                    return data.put(`${Project.api}logo/rules/${id}`, Object.assign({}, { ...linkLogo }, base64 ? { image: base64, imageFormat: linkLogo.image.type } : {}))
                        .then(res => {
                            const index = _.findIndex(store.model, {id});
                            store.model[index] = res;
                            store.savedId = id;
                            store.saved();
                        })
                })
                .catch(e => AjaxHandler.error(LinkLogoStore, e));
        },
    },
    store = Object.assign({}, BaseStore, {
        id: 'linkLogo',
        getLogos: function () {
            return store.model;
        },
    });

store.dispatcherIndex = Dispatcher.register(store, function (payload) {
    var action = payload.action; // this is our action from handleViewAction

    switch (action.actionType) {
        case Actions.ADD_LINK_LOGO:
            controller.add(action.startsWith, action.image, action.overrideDifficultyLevel);
            break;
        case Actions.GET_LINK_LOGOS:
            controller.get();
            break;
        case Actions.REMOVE_LINK_LOGO:
            controller.delete(action.id);
            break;
        case Actions.UPDATE_LINK_LOGO:
            controller.update(action.id, action.linkLogo);
            break;
        default:
            return;
    }
});

controller.store = store;
module.exports = controller.store;
