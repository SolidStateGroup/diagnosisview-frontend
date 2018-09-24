//https://github.com/wix/react-native-navigation/wiki/Styling-the-navigator
global.navbarStyle = {
    statusBarTextColorScheme: 'dark',
    topBarElevationShadowEnabled: false,
    navBarNoBorder: true,
    navBarBackgroundColor: styleVariables.navBar,
    navBarTextColor: colour.navBarText,
    navBarSubtitleFontSize: 10,
    navBarSubtitleColor: colour.navBarSubtitle,
    navBarButtonColor: colour.navBarIcon,
};


module.exports = {

    fakeNav: {
        paddingTop: styleVariables.statusHeight,
        paddingBottom: styleVariables.statusHeight,
        height: 64,
        justifyContent: 'center'
    },

    navBarText: {
        marginTop:10,
        fontWeight: '400',
        color: 'white',
        fontSize: 18,
    },

    navIcon: {
        fontSize: 28,
        color:'white',
        marginTop:10
    },

    navBar: {},

    barText: {
        color: 'black'
    },


    //OFF CANVAS

    navButtonRight: {
        alignItems: 'flex-end',
    },

    navButtonLeft: {
        alignItems: 'flex-start',
    },

    menuItem: {
        height: 34,
        justifyContent: 'flex-start',
    },

    menuItemText: {
        fontSize: em(1.25),
        color: '#fff',
        backgroundColor: 'transparent'
    },
    menuItemIcon: {
        width: 24,
        height: 24,
        fontSize: 24,
        justifyContent: 'center',
        textAlign: 'center',
        lineHeight: 34,
        color: pallette.white,
        backgroundColor: 'transparent'
    },
    menuItemImage: {
        width: 34,
        height: 34,
    }
};
