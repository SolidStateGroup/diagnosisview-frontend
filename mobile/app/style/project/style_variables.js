import {NativeModules,PixelRatio} from 'react-native';
var em = require('../base/style_pxToEm');
window.pallette = {
    backgroundBase: '#f3f3f3',

    facebook:'#3b5998',
    google:'#e83d38',
    twitter:'#00acee',

    primary: '#2b76db',
    primaryDark: '#3582dc',
    primaryLight: '#7e8592',
    primaryLightest: '#7e8592',
    secondary: '#03bd69',
    third: '#c84d38',

	navBarText: '#368de8',

    text: '#404040',
    textLight: '#cbcbcb',
    textLightest: '#fff',
    textLightestHighlight: '#e2e2e2',
    divider: '#d1d1d1',
    dividerLight: '#efefef',
	brandDanger: '#9C1033',

    error: '#b94d4d',

    fromGradient:'#fafafa',
    toGradient:'#fff',
    anchor: '#7e8592'
};

window.colour = {
    errorBackground: '#c84d38',
    bodyBackground: '#f3f3f3', //General app  background
    bodyBackgroundAlt: '#f1f1f1', //General app  background
    inputBackground:'#fff',
    inputBorder:pallette.blueGrey,
    textFaint:'rgba(255,255,255,.75)',
    textFaintLight:'rgba(0,0,0,.2)',

    //nav
    navBar: 'white',
    navBarIcon: pallette.navBarText,
    navBarSubtitle: pallette.secondary,
    navBarButtonText: pallette.navBarText,
    navBarBorder: 'transparent',
    navBarText: pallette.navBarText,

    //BUTTON / SELECT COLOURS
    btnText: "white",
    btnDefault: pallette.primary,
};

window.styleVariables =  Object.assign({
    //SCAFFOLD
    statusHeight: NativeModules.StatusBarManager.HEIGHT || 20,
    baseNavHeight: 54,
    marginBaseVertical: em(1.5),
    marginBaseHorizontal: em(1),
    paddingBase: em(1.5),
    paddingList: em(1.1),
    gutterBase: 10,
    borderRadiusDefault: 4,
    fontSizeH1: em(2.286),
    fontSizeH2: em(1.75),
    fontSizeH3: em(1.25),

    //BASE
    borderWidth: 2 / PixelRatio.get(),
    borderDefault: pallette.textLight,

    //TYPE
    fontSizeBase: em(1.2),
    fontSizeSmall: em(0.85),
    fontSizeMedium: em(1),
    fontSizeHeading: em(1.5),
    fontSizeSubHeading: em(1.2),
    fontSizeIcon: 30,
    fontSansSerif: 'helvetica neue',

    text: pallette.text, //General app text colour
    textLight: pallette.textLight, //Light app text colour

    //FORMS
    inputHeight: 34, //Need to change this value in both platform variables files at the moment
    inputText: pallette.text,
    inputBackground: colour.inputBackground,
    inputBorder: pallette.textLightest,
    placeholderTextColor: pallette.textLightest,

    //NAV
    navBar: '#fff',
    navBarIcon: pallette.text,
    navBarButtonText: pallette.text,
    navBarBorder: pallette.primary,
    navBarText: pallette.text,
    navColor:pallette.navBarText,

    //MODALS
    modalBackground: '#F0F0F0',

    //BUTTONS
    button: 50,
    buttonPrimary: pallette.primary,
    buttonTextLight: pallette.textLight
}, require('./style_platform_variables'));
