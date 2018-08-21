var BaseStore = require('./base/_store');
var data = require('./base/_data');

var controller = {
        getUsers: function () {
            store.loading();
            data.get(Project.api + 'admin/users')
                .then(res => {
                    store.model = _.sortBy(_.filter(res, u => !u.deleted), u => -u.dateCreated || 0);
                    store.loaded();
                })
                .catch(e => AjaxHandler.error(UsersStore, e));
        },
        updateUsers: function (changes) {
            store.saving();
            Promise.all(_.map(changes, (change, uid) => {
                const user = _.find(store.model, user => user.id == uid);
                return data.put(Project.api + 'admin/user/' + uid, {...change, username: user.username});
            })).then(results => {
                _.each(results, res => {
                    var index = _.findIndex(store.model, user => user.id === res.id);
                    store.model[index] = res;
                });
                store.saved();
            })
            .catch(e => AjaxHandler.error(UsersStore, e));
        },
        createUser: function (details) {
            store.saving();
            data.post(Project.api + 'admin/user', details)
                .then(res => {
                    store.model.unshift(res);
                    store.saved();
                })
                .catch(e => AjaxHandler.error(UsersStore, e));
        },
        deleteUser: function (user) {
            store.saving();
            data.delete(Project.api + 'admin/user', user)
                .then(res => {
                    var index = _.findIndex(store.model, u => u.id === res.id);
                    if (index !== -1) {
                        store.model.splice(index, 1);
                    }
                    store.saved();
                })
                .catch(e => AjaxHandler.error(UsersStore, e));
        },
        updateUser: function (id, details) {
            store.saving();
            data.put(Project.api + 'admin/user/' + id, details)
                .then(res => {
                    var index = _.findIndex(store.model, user => user.id === res.id);
                    store.model[index] = res;
                    store.saved();
                })
                .catch(e => AjaxHandler.error(UsersStore, e));
        }
    },
    store = Object.assign({}, BaseStore, {
        id: 'users',
        getUsers: function () {
            return store.model;
        }
    });

store.dispatcherIndex = Dispatcher.register(store, function (payload) {
    var action = payload.action; // this is our action from handleViewAction

    switch (action.actionType) {
        case Actions.GET_USERS:
            controller.getUsers();
            break;
        case Actions.UPDATE_USERS:
            controller.updateUsers(action.changes);
            break;
        case Actions.CREATE_USER:
            controller.createUser(action.details);
            break;
        case Actions.DELETE_USER:
            controller.deleteUser(action.user);
            break;
        case Actions.UPDATE_USER:
            controller.updateUser(action.id, action.details);
            break;
        default:
            return;
    }
});

controller.store = store;
module.exports = controller.store;
