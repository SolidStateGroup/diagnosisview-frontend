module.exports = {


    button: {
        height: styleVariables.buttonHeight
    },

    buttonFacebook: {
        backgroundColor: colour.facebook
    },

    buttonGoogle: {
        backgroundColor: colour.google
    },

    //Button
    circleButton: {
    	justifyContent:'center',
		alignItems:'center',
        backgroundColor: 'white',
        width: 34,
        height: 34,
        borderRadius: 34 / 2,
        padding: 0,
        paddingTop: 2,
        paddingLeft: 0,
        paddingRight: 0,
        shadowColor: '#333',
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.4,

    },


    //Button
    circleButtonText: {
       fontSize: em(2)
    },

    buttonWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    buttonText: {
        backgroundColor: 'transparent',
        color: colour.btnText,
        fontWeight: styleVariables.mediumFontWeight,
        fontSize: styleVariables.fontSizeBase
    },

    buttonIcon: {
        fontSize: styleVariables.fontSizeBase * 1.5,
        color: colour.btnText,
        marginRight: 10,
    },

    buttonIconLeft: {
        marginRight: styleVariables.paddingBase,
    },
    buttonIconRight: {
        marginLeft: styleVariables.paddingBase,
    },

    buttonSup: {
        fontSize: styleVariables.fontSizeBase / 2,
    },

    buttonGroup: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colour.btnDefault,
        paddingLeft: styleVariables.paddingBase,
        paddingRight: styleVariables.paddingBase,
        height: styleVariables.button
    },

    buttonGroupLeft: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    buttonGroupRight: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },

    buttonPrimary: {
        backgroundColor: styleVariables.buttonPrimary
    },

    buttonTextLight: {
        color: styleVariables.buttonTextLight,
        fontSize: styleVariables.fontSizeBase
    },

    buttonRounded: {
        borderRadius: styleVariables.borderRadiusDefault,
    },
    buttonLeft: {
        width: (DeviceWidth / 2) - 15,
    },
    buttonRight: {
        width: (DeviceWidth / 2) - 15,
        marginLeft: 10
    },
};
