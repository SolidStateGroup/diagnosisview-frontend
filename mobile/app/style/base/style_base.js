module.exports = {

    //
    // Base styles
    // --------------------------------------------------

    body: {
        flex: 1,
        backgroundColor: colour.bodyBackground
    },

    avatar: {
        height: styleVariables.avatarHeight,
        width: styleVariables.avatarWidth,
        borderRadius: styleVariables.avatarRadius
    },

    divider: {
        height: (1 / PixelRatio.get()) * 2,
        alignSelf: 'stretch',
        borderColor: colour.divider,
        borderBottomWidth: 1 / PixelRatio.get(),
    },

};
