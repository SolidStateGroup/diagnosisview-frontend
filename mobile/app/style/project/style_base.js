module.exports = {

    hero :{
        position:'absolute',
        top:0,
        left:0,
        right:0,
        width:DeviceWidth,
        height:DeviceHeight / 3,
        backgroundColor:pallette.primary,
    },
    bodyAlt: {
        backgroundColor: colour.bodyBackgroundAlt
    },

    shadow: {
        shadowColor: '#333',
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.4,
    },

    // APP
    navContent: {
        padding: styleVariables.gutterBase
    },

    //ICONS
    iconDefault: {
        height: 30,
        resizeMode: 'contain'
    },

    iconButton: {
        resizeMode: 'contain',
        paddingLeft:6,
        paddingRight:6,
        paddingTop:1,
        height:25,
        marginRight:10
    },

	roundedAnimationContainer:{
		backgroundColor: 'white',
		alignSelf: 'center',
		top: -40,
		zIndex: 2,
		position: 'absolute',
		borderRadius: 40,
		width: 80,
		height: 80,
        justifyContent: 'center'
	},

	roundedAnimationInner:{
		backgroundColor: pallette.secondary,
		alignSelf: 'center',
		borderRadius: 35,
		width: 70,
		height: 70,
		justifyContent: 'center',
		alignItems: 'center'
	},
};
