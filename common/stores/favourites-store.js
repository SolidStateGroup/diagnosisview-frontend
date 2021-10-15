var BaseStore = require('./base/_store');
var data = require('./base/_data');
import AccountStore from './account-store';

var controller = {
        setFavourite: function(code, name, link) {
            store.saving();
            AsyncStorage.getItem('favourites', (err, res) => {
                if (err) {
                    store.goneABitWest(err);
                    console.log(err);
                    return;
                }

                var favourites = res ? JSON.parse(res) : [];
                if (favourites.length >= 5 && !AccountStore.hasActiveSubscription())  {
                    Alert.alert('', `Maximum number of favourites reached. ${!AccountStore.getUser() ? 'Please sign in or create an account to add more' : 'Please subscribe or renew your subscription to add more'}`);
                    return;
                }

                if (_.find(favourites, f => f.code === code && f.link.id === link.id)) {
                    return;
                }

                const favourite = {
                    code,
                    name,
                    link,
                    date: Date.now()
                };

                favourites.push(favourite);
                AsyncStorage.setItem('favourites', JSON.stringify(favourites));

                if (AccountStore.hasActiveSubscription()) {
                    data.put(Project.api + 'user/favourites', {linkId: link.id, code, type: link.linkType.value, dateAdded: favourite.date})
                        .then(res => {
                            // console.log(res);
                            store.model = store.model || [];
                            store.model.push(favourite);
                            store.saved();
                        })
                        .catch(e => AjaxHandler.error(FavouritesStore, e));
                } else {
                    store.model = favourites;
                    store.saved();
                }
            });
        },
        removeFavourite: function(code, link) {
            store.saving();
            AsyncStorage.getItem('favourites', (err, res) => {
                if (err) {
                    store.goneABitWest(err);
                    // console.log(err);
                    return;
                }

                var favourites = res ? JSON.parse(res) : [];
                var index = _.findIndex(favourites, f => f.code === code && f.link.id === link.id);
                if (index !== -1) {
                    favourites.splice(index, 1);
                }

                if (AccountStore.hasActiveSubscription()) {
                    index = _.findIndex(store.model, f => f.code === code && f.link.id === link.id);
                    if (index === -1) return;
                    const favourite = store.model[index];
                    data.delete(Project.api + 'user/favourites', {linkId: favourite.originalLinkId === 0 ? 0 : link.id, code, type: link.linkType.value})
                        .then(res => {
                            // console.log(res);
                            if (index !== -1) {
                                store.model.splice(index, 1);
                            }
                            AsyncStorage.setItem('favourites', JSON.stringify(favourites));
                            store.saved();
                        })
                        .catch(e => AjaxHandler.error(FavouritesStore, e));
                } else {
                    store.model = favourites;
                    AsyncStorage.setItem('favourites', JSON.stringify(favourites));
                    store.saved();
                }
            });
        },
        getFavourites: function () {
            if (!AccountStore.hasActiveSubscription()) return;

            store.loading();
            // data.get(Project.api + 'user/favourites')
            //     .then(res => {
                // @TODO mutate results with the name of the diangosis
                // @TODO would expect entire link object back here
            //         store.model = res;
            //         store.loaded();
            //     });
            setTimeout(() => {
                store.loaded();
            }, 2000);
        },
        setSubscribedFavourites: function (subscribedFavourites) {
            // Convert them to what we would normally store
            var favourites = [];
            _.each(subscribedFavourites, f => {
                const link = f.linkId ? DiagnosisStore.getLinkById(f.code, f.linkId) : DiagnosisStore.getLink(f.code, f.type);
                if (!link) return;
                favourites.push({
                    code: f.code,
                    name: DiagnosisStore.getName(f.code),
                    link,
                    originalLinkId: f.linkId,
                    date: f.dateAdded
                })
            });
            AsyncStorage.setItem("favourites", JSON.stringify(favourites));
            store.model = favourites;
            store.loaded();
        },
        setDeviceFavourites: function () {
            store.loading();
            AsyncStorage.getItem('favourites', (err, res) => {
                if (err) {
                    store.goneABitWest(err);
                    console.log(err);
                    return;
                }

                const favourites = res ? JSON.parse(res) : [];
                store.model = _.take(_.reverse(_.sortBy(SubscriptionStore.isSubscribed() ? favourites : _.filter(favourites, f => f.link.difficultyLevel === 'GREEN' || f.link.freeLink), 'date')), 5);
                AsyncStorage.setItem("favourites", JSON.stringify(store.model));
                store.loaded();
            })
        }
    },
    store = Object.assign({}, BaseStore, {
        id: 'favourites',
        getFavourites: function () {
            return store.model;
        },
    });

store.dispatcherIndex = Dispatcher.register(store, function (payload) {
    var action = payload.action; // this is our action from handleViewAction

    switch (action.actionType) {
        case Actions.SET_FAVOURITE:
            controller.setFavourite(action.code, action.name, action.link);
            break;
        case Actions.REMOVE_FAVOURITE:
            controller.removeFavourite(action.code, action.link);
            break;
        case Actions.GET_FAVOURITES:
            controller.getFavourites();
            break;
        case Actions.SET_SUBSCRIBED_FAVOURITES:
            controller.setSubscribedFavourites(action.favourites);
            break;
        case Actions.SET_DEVICE_FAVOURITES:
            controller.setDeviceFavourites();
            break;
        default:
            return;
    }
});

controller.store = store;
module.exports = controller.store;
