module.exports = {
    rounded:{
        borderRadius:styleVariables.borderRadiusDefault,
    },
    noBackground:{
        backgroundColor:'transparent'
    },

    textRight:{
        textAlign:'right',
    },

    underline:{
        borderBottomWidth:PixelRatio.get() / 2,
        borderColor:pallette.dividerLight
    },

    verticalCenter:{
        justifyContent:'center'
    },

    horizontalCenter:{
        alignItems:'center',
    },

    paddingHorizontal:{
        paddingLeft:styleVariables.paddingBase,
        paddingRight:styleVariables.paddingBase,
    },
};
