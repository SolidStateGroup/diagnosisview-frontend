import {Navigation} from 'react-native-navigation';

require('./app/project/globals');
require('./app/routes');
import ION from 'react-native-vector-icons/Ionicons';
import styleVariables from './app/style/project/style_variables';

const replaceSuffixPattern = /--(active|big|small|very-big)/g;
const defaultIconProvider = ION;

const icons = {
    "ios-menu": [30, styleVariables.navColor],
    "ios-add": [30, styleVariables.navColor],
    "ios-chatbubbles": [34, styleVariables.navColor],
    "ios-home": [34, styleVariables.navColor],
    "md-close": [30, styleVariables.navColor],
    "md-more": [30, styleVariables.navColor],
    "md-search": [30, styleVariables.navColor],
    "md-menu": [30, styleVariables.navColor],
    "ios-arrow-back": [30, styleVariables.navColor],
    "ios-search": [30, styleVariables.navColor],
};

global.iconsMap = {};
let iconsLoaded = new Promise((resolve, reject) => { //cache all icons as images
    new Promise.all(
        Object.keys(icons).map(iconName => {
            const Provider = icons[iconName][2] || defaultIconProvider; // Ionicons
            return Provider.getImageSource(
                iconName.replace(replaceSuffixPattern, ''),
                icons[iconName][0],
                icons[iconName][1]
            )
        })
    ).then(sources => {
        Object.keys(icons)
            .forEach((iconName, idx) => iconsMap[iconName] = sources[idx])

        // Call resolve (and we are done)
        resolve(true);
    })
});

const getUser = new Promise(function (resolve) {
    if (Constants.simulate.NEW_USER) {
        resolve(null)
    } else {
        AsyncStorage.getItem('user', (err, res) => {
            if (!res && Constants.simulate.LOGGED_IN) {
                res = "{}";
            }
            if (res && res != 'null') {
                var user = JSON.parse(res);
                if (Constants.simulate.SUBSCRIBED) {
                    console.log("WARNING: SIMULATING SUBSCRIPTION")
                    user.activeSubscription = true;
                    if (Constants.simulate.EXPIRY) {
                        user.paymentData = user.paymentData || [];
                        res.expiryDate = moment().add(1, 'y').subtract(14, 'days').valueOf();
                        user.paymentData.unshift(JSON.stringify({expiryTimeMillis: res.expiryDate, autoRenewing: false}));
                        user.activeSubscription = res.expiryDate.isAfter(moment());
                    }
                }
                AccountStore.setUser(user)
            }
            resolve(res)
        });
    }
});

const getFavourites = new Promise(function (resolve) {
    if (Constants.simulate.NEW_USER) {
        resolve(null)
    } else {
        AsyncStorage.getItem('favourites', (err, res) => {
            FavouritesStore.model = res ? JSON.parse(res) : [];
            resolve(res);
        });
    }
})

const getHistory = new Promise(function (resolve) {
    if (Constants.simulate.NEW_USER) {
        resolve(null)
    } else {
        AsyncStorage.getItem('history', (err, res) => {
            HistoryStore.model = res ? JSON.parse(res) : [];
            resolve(res);
        });
    }
})

const getCodes = new Promise(function (resolve) {
    if (Constants.simulate.NEW_USER) {
        resolve(null)
    } else {
        AsyncStorage.getItem('codes', (err, res) => {
            DiagnosisStore.model = res ? JSON.parse(res) : [];
            resolve(res);
        });
    }
});

const getCodeCategories = new Promise(function (resolve) {
    if (Constants.simulate.NEW_USER) {
        resolve(null)
    } else {
        AsyncStorage.getItem('codeCategories', (err, res) => {
            DiagnosisStore.categories = res ? JSON.parse(res) : [];
            resolve(res);
        });
    }
});

const retrySubscription = new Promise(function (resolve) {
    AsyncStorage.getItem('retrySubscription', (err, res) => {
        if (err || !res) {
            return resolve(false);
        }
        return resolve(JSON.parse(res));
    })
})

Promise.all([getUser, retrySubscription, getFavourites, getHistory, getCodes, iconsLoaded]).then(([user, retrySubscription]) => {
    global.iconsMap = iconsMap;

    global.modalNavButtons = {
        leftButtons: [],
        rightButtons: [
            {
                icon: iconsMap['md-close'], // for icon button, provide the local image asset name
                id: 'close', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
            }
        ]
    };
    global.defaultNavButtons = {
        leftButtons: [
            {
                icon: iconsMap['md-menu'],
                id: 'menu'
            }
        ],
        rightButtons: [
            {
                icon: iconsMap['md-search'],
                id: 'search'
            }
        ]
    }
    Navigation.startTabBasedApp({
        tabs: [
            routeHelper.dashboardScreen({retrySubscription}),
            routeHelper.historyScreen(),
            routeHelper.favouritesScreen(),
            routeHelper.accountScreen(),
        ],
        tabsStyle: {
            tabBarBackgroundColor: 'white',
            tabBarTranslucent: false,
            tabBarButtonColor: styleVariables.navBarText,
        },
        appStyle: {
            orientation: 'portrait',
            forceTitlesDisplay: true,
            tabBarSelectedButtonColor: pallette.primary,
        },
        drawer: {
            left: {
                screen: 'side-menu',
                disableOpenGesture: false
            }
        }
    });
});

console.disableYellowBox = true;


import crashlytics from 'react-native-fabric-crashlytics';
crashlytics.init();
