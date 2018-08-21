module.exports = {

	inputContainer: {
		height: styleVariables.inputHeight
	},

	textInput: {
		flex: 1,
		backgroundColor: colour.inputBackground,
		paddingLeft: styleVariables.gutterBase,
		height:40,
		borderRadius:25,
		borderColor:'#EDEDED',
		borderWidth: PixelRatio.get() / 2,
		fontSize:em(1.15),
	},

	dropdownInput: {
		backgroundColor: colour.inputBackground,
		paddingLeft: styleVariables.gutterBase,
		borderRadius:25,
		borderColor:'#EDEDED',
		borderWidth: PixelRatio.get() / 2,
		height: styleVariables.inputHeight
	},

	inputIcon:{
		position:'absolute',
		fontSize:em(1.75),
		color:pallette.textLight,
		zIndex:1,
		top:8,
		left:15,
	},

	inputDefault: {
		backgroundColor: colour.inputBackground,
		borderRadius: 4,
		borderColor: colour.inputBorder,
		borderWidth: PixelRatio.get() / 2,
		height: styleVariables.inputHeight
	},

	label: {
		color: styleVariables.text,
		marginBottom: styleVariables.gutterBase / 2
	},

	inputAppendContainer: {
		position: 'relative',
	},

	inputAppend: {
		position: 'absolute',
		zIndex: 1,
		left: 0,
		top: 0,
		backgroundColor: 'transparent',
		height: 54,
		width: 54,
		alignItems: 'center',
		justifyContent: 'center',
	},

	inputIndent: {
		paddingLeft: 40,
	},

	searchResult:{
		fontSize:em(1),
		color:pallette.text,
	},

	actionsContainer:{
		marginTop:20,
	},
};
