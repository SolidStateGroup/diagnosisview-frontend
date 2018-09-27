module.exports = {
    buttonGroup: {
        borderRadius:4,
    },
    buttonText: {
        backgroundColor:'transparent',
        color: colour.btnText,
        fontWeight: 'bold',
        fontSize: styleVariables.fontSizeBase,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    buttonSup:{
        fontSize:styleVariables.fontSizeBase / 1.5,
    },

    buttonFacebook:{
        backgroundColor:pallette.facebook,
    },

    buttonGoogle:{
        backgroundColor:pallette.google,
    },

    buttonTwitter:{
        backgroundColor:pallette.twitter,
    },

    buttonCancel:{
        backgroundColor:'#B33321',
    },

    hollowButton:{
        borderWidth:PixelRatio.get()/2,
        borderColor:'#fff',
        backgroundColor:'transparent'
    },

    sideMenu:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        padding:5,
        height:40
    },

    buttonIcon:{
        marginTop:3,
        color:'#fff',
        fontSize:20,
        marginRight:5
    },

	dropButton: {
		height: em(3),
		width: em(3),
		borderRadius: em(3) / 2,
		shadowColor: "#000000",
		shadowOpacity: 0.3,
		shadowRadius: 3,
		shadowOffset: {
			height: 0,
			width: 0
		}
	},

    segmentedControl:{
	    backgroundColor:'#fff',
        height:35,
    },

    segmentedControlLeft:{
        borderTopLeftRadius:4,
        borderTopRightRadius:0,
        borderBottomLeftRadius:4,
        borderBottomRightRadius:0,
    },

    segmentedControlRight:{
        borderTopLeftRadius:0,
        borderTopRightRadius:4,
        borderBottomLeftRadius:0,
        borderBottomRightRadius:4,
    },

    segmentedControlActive:{
        backgroundColor:pallette.primary,
    },

    segmentedControlText:{
        color: colour.btnDefault,
        fontSize:14,
        fontWeight:'100'
    },

    segmentedControlTextActive:{
        color:'#fff',
    }
};
