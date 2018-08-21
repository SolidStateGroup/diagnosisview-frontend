module.exports = {
    //
    // Forms
    // --------------------------------------------------

    //Input

    formGroup: {
        paddingTop: styleVariables.paddingBase,
        paddingBottom: styleVariables.paddingBase
    },

    enterPinContainer:{
        backgroundColor:'#fff',
        borderRadius:4,
        borderColor:colour.inputBorder,
        borderWidth:PixelRatio.get() / 2,
        height:styleVariables.inputHeight
    },

    pin: {
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderBottomWidth: 2,
        borderColor: colour.inputBorder
    },

    input: {
        fontFamily: styleVariables.fontSansSerif,
        fontSize: styleVariables.fontSizeAlert,
        flex: 1,
        fontWeight: styleVariables.mediumFontWeight,
        color: colour.input,
    },

    inputContainer: {
        justifyContent: 'center',
    },

    inputLarge: {
        fontSize: styleVariables.fontSizeInputLarge,
    },

    disabled: {
        opacity: styleVariables.disabledOpacity
    },

    disabledText: {
        color: colour.disabledText,
    },

    // Checkboxes and radios

    radioText: {
        color: colour.radioText
    },

    radioTextActive: {
        color: colour.radioTextActive
    },

    radio: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        borderWidth: 1 / PixelRatio.get()
    }

};
