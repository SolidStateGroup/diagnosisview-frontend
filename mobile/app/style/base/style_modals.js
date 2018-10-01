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

    // DO NOT CHANGE THESE. EVER.
	lightboxOuter: {
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 40,
        paddingTop: 40,
        height: DeviceHeight - 40
	},

	lightbox: {
        width: DeviceWidth - 40,
		borderRadius: 5,
        backgroundColor: 'white'
	},

    webView: {},

};
