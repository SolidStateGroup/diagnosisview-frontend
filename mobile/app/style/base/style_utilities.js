module.exports = {
    // Utility classes
    // -------------------------

    padded: {
        padding: styleVariables.paddingBase,
    },
    horizontallyPadded: {
        paddingLeft: styleVariables.paddingBase,
        paddingRight: styleVariables.paddingBase,
        paddingTop: 0,
        paddingBottom: 0
    },
    noPadding: {
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0
    },

    noMargin: {
        marginBottom: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0
    },

    textCenter: {
        textAlign: 'center'
    },

    shortText: {
        width: DeviceWidth / 1.5,
        alignSelf:'center',
        textAlign:'center'
    },

    centerChildren: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    fullScreen: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: Dimensions.get("window").height,
    },

    backdrop: {
        flex: 1,
        backgroundColor: styleVariables.backdropBackground
    },

    iconMiddle: {
        paddingLeft: 10,
        paddingRight: 10,
    },

    flex: {
        flex: 1,
    },
};
