module.exports = {
    //
    // Modals
    // --------------------------------------------------

    modal: {
        position: 'absolute',
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
    },

    modalBackdrop: {
        height: DeviceHeight,
        width: DeviceWidth,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'black',
        opacity: 0.5,
    },

	lightboxOuter: {
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 40,
		paddingTop: 40,
	},

	lightbox: {
		paddingTop: 40,
		width: DeviceWidth - 40,
		height: DeviceHeight - 60,
		borderRadius: 5,
		backgroundColor: 'white'
	},

    webView: {},

};
