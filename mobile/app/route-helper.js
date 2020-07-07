var currentScreen = '/';
import AccountStore from '../common-mobile/stores/account-store'
import {Navigation} from "react-native-navigation";


module.exports = {
    navEvents: {
        SHOW: 'didAppear',
        HIDE: 'didDisappear'
    },
    closeDrawer: (navigator) => {
        navigator.toggleDrawer({
            to: 'closed',
            side: 'left',
            animated: true
        });
    },

    openDrawer: (navigator) => {
        navigator.toggleDrawer({
            side: 'left',
            animated: true
        });
    },

    dashboardScreen: (props) => {
        return {
            label: 'Home',
            screen: '/dashboard',
            navigatorButtons: _.cloneDeep(global.defaultNavButtons),
            icon: require('./images/icons/home.png'),
            selectedIcon: require('./images/icons/home_active.png'),
            passProps: props
        }
    },

    historyScreen: () => {
        return {
            label: 'History',
            title: 'History',
            screen: '/history',
            navigatorButtons: _.cloneDeep(global.defaultNavButtons),
            icon: require('./images/icons/history.png'),
            selectedIcon: require('./images/icons/history_active.png'),
        }
    },

    favouritesScreen: () => {
        return {
            label: 'Favourites',
            title: 'Favourites',
            screen: '/favourites',
            navigatorButtons: _.cloneDeep(global.defaultNavButtons),
            icon: require('./images/icons/favourites.png'),
            selectedIcon: require('./images/icons/favourites_active.png'),
        }
    },

    accountScreen: () => {
        return {
            label: 'Account',
            title: 'Account',
            screen: '/account',
            navigatorButtons: _.cloneDeep(global.defaultNavButtons),
            icon: require('./images/icons/user.png'),
            selectedIcon: require('./images/icons/user_active.png'),
        }
    },

    //Global handling for pages - can plug into analytics / deep linmking
    handleNavEvent: (navigator, id, cb) => {
        navigator.setOnNavigatorEvent((event) => {
            switch (event.id) {
                case 'willAppear':
                    global.currentNavigator = navigator;
                    global.currentScreen = id;
                    break;
                case 'didAppear':
                    break;
                case 'willDisappear':
                    break;
                case 'didDisappear':
                    break;
            }

            if (event.type == 'DeepLink') {
                //Handle deep linking
                routeHelper[event.link] && routeHelper[event.link](navigator);
            } else if (event.id == 'side-menu') {
                //Handle open drawer
                routeHelper.openDrawer(navigator);
            }

            cb && cb(event);

        });
    },

    openWebModal: (uri, title) => {
        Navigation.showModal({
            screen: "/webmodal",
            title: title || '',
            navigatorButtons: _.cloneDeep(global.modalNavButtons),
            navigatorStyle: global.navbarStyle,
            passProps: {uri, title},
            overrideBackPress: true
        });
    },

    showAbout: (navigator) => {
        navigator.showLightBox({
            screen: "about", // unique ID registered with Navigation.registerScreen
            style: {
                width: DeviceWidth,
                height: DeviceHeight,
                justifyContent: 'center',
                tapBackgroundToDismiss: true, // dismisses LightBox on background taps (optional)
                backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
            },
            adjustSoftInput: "resize", // android only, adjust soft input, modes: 'nothing', 'pan', 'resize', 'unspecified' (optional, default 'unspecified')
        })
    },

    showBrokenLink: (navigator) => {
        navigator.showLightBox({
            screen: "brokenLink", // unique ID registered with Navigation.registerScreen
            style: {
                width: DeviceWidth,
                height: DeviceHeight,
                justifyContent: 'center',
                tapBackgroundToDismiss: true, // dismisses LightBox on background taps (optional)
                backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
            },
            adjustSoftInput: "resize", // android only, adjust soft input, modes: 'nothing', 'pan', 'resize', 'unspecified' (optional, default 'unspecified')
        })
    },

    showForgotPassword: (navigator) => {
        navigator.showLightBox({
            screen: "forgotPassword", // unique ID registered with Navigation.registerScreen
            style: {
                width: DeviceWidth,
                height: DeviceHeight,
                justifyContent: 'center',
                tapBackgroundToDismiss: true, // dismisses LightBox on background taps (optional)
                backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
            },
            adjustSoftInput: "resize", // android only, adjust soft input, modes: 'nothing', 'pan', 'resize', 'unspecified' (optional, default 'unspecified')
        })
    },

    openContactModal: (navigator, title, onChange, multiple) => {
        navigator.showModal({
            screen: "/select-contact",
            title: title || '',
            navigatorButtons: _.cloneDeep(global.modalNavButtons),
            navigatorStyle: global.navbarStyle,
            passProps: {onChange, multiple}
        });
    },

    openSelect: (navigator, title, {items, renderRow, onChange, multiple, filterItem}) => {
        navigator.showModal({
            screen: "/select",
            title: title || '',
            navigatorButtons: _.cloneDeep(global.modalNavButtons),
            navigatorStyle: global.navbarStyle,
            passProps: {items, renderRow, onChange, multiple, filterItem}
        });
    },

    goAccount: function (navigator) {
        navigator.switchToTab({tabIndex: 3});
    },

    goHistory: function (navigator) {
        navigator.switchToTab({tabIndex: 1});
    },

    goFavourites: function (navigator) {
        navigator.switchToTab({tabIndex: 2});
    },

    goDashboard: function (navigator) {
        navigator.handleDeepLink({link: 'dashboard'});
        navigator.switchToTab({tabIndex: 0});
    },

    goLogin: function (navigator) {
        navigator.switchToTab({tabIndex: 3});
    },

    goRegister: function (navigator) {
        navigator.switchToTab({tabIndex: 3});
    },

    goSearch: function (navigator) {
        navigator.handleDeepLink({link: 'search'});
        navigator.switchToTab({tabIndex: 0});
    },

    goDiagnosisDetail: function (navigator, code, name) {
        navigator.push({
            screen: '/diagnosis',
            title: name,
            navigatorStyle: global.navbarStyle,
            passProps: {code, name}
        });
    },

    showWelcome: (navigator) => {
        navigator.showLightBox({
            screen: "welcome", // unique ID registered with Navigation.registerScreen
            style: {
                width: DeviceWidth,
                height: DeviceHeight,
                justifyContent: 'center',
                tapBackgroundToDismiss: true, // dismisses LightBox on background taps (optional)
                backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
            },
            adjustSoftInput: "resize", // android only, adjust soft input, modes: 'nothing', 'pan', 'resize', 'unspecified' (optional, default 'unspecified')
        })
    },

    showChangePassword: (navigator) => {
        navigator.showLightBox({
            screen: "changePassword", // unique ID registered with Navigation.registerScreen
            style: {
                width: DeviceWidth,
                height: DeviceHeight,
                justifyContent: 'center',
                tapBackgroundToDismiss: true, // dismisses LightBox on background taps (optional)
                backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
            },
            adjustSoftInput: "resize", // android only, adjust soft input, modes: 'nothing', 'pan', 'resize', 'unspecified' (optional, default 'unspecified')
        })
    },

    showFavouriteComplexity: (navigator, difficultyLevel) => {
        navigator.showLightBox({
            screen: "favouriteComplexity", // unique ID registered with Navigation.registerScreen
            style: {
                width: DeviceWidth,
                height: DeviceHeight,
                justifyContent: 'center',
                tapBackgroundToDismiss: true, // dismisses LightBox on background taps (optional)
                backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
            },
            adjustSoftInput: "resize", // android only, adjust soft input, modes: 'nothing', 'pan', 'resize', 'unspecified' (optional, default 'unspecified')
            passProps: {difficultyLevel}
        })
    },

    showPaywallDescription: (navigator, paywalled) => {
        navigator.showLightBox({
            screen: "paywallDescription", // unique ID registered with Navigation.registerScreen
            style: {
                width: DeviceWidth,
                height: DeviceHeight,
                justifyContent: 'center',
                tapBackgroundToDismiss: true, // dismisses LightBox on background taps (optional)
                backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
            },
            adjustSoftInput: "resize", // android only, adjust soft input, modes: 'nothing', 'pan', 'resize', 'unspecified' (optional, default 'unspecified')
            passProps: {paywalled}
        })
    },

    showTagDescription: (navigator, tag) => {
        navigator.showLightBox({
            screen: "tagDescription", // unique ID registered with Navigation.registerScreen
            style: {
                width: DeviceWidth,
                height: DeviceHeight,
                justifyContent: 'center',
                tapBackgroundToDismiss: true, // dismisses LightBox on background taps (optional)
                backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
            },
            adjustSoftInput: "resize", // android only, adjust soft input, modes: 'nothing', 'pan', 'resize', 'unspecified' (optional, default 'unspecified')
            passProps: {tag}
        })
    }
};
