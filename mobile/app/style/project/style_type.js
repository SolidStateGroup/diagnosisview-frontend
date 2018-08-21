module.exports = {

    text: {
    	backgroundColor:'transparent',
        color: colour.text,
        fontSize: styleVariables.fontSizeBase,
        fontFamily: 'Open Sans',
    },

    semiBold:{
        fontWeight:'bold',
    },

    h1: {
        marginBottom: styleVariables.marginBaseVertical * 2
    },

    h2: {
        fontWeight: "bold",
        marginBottom:5,
    },

    paragraph: {
        marginBottom: styleVariables.marginBaseVertical,
    },

    paragraphStrong: {
        fontWeight: "500",
        fontSize:styleVariables.fontSizeMedium,
    },

    subHeading:{
        fontSize:styleVariables.fontSizeSubHeading,
        fontWeight:'bold',
        marginBottom:5,
    },

    textSmall: {
        fontSize: styleVariables.fontSizeSmall,
    },

    textMedium: {
        fontSize: styleVariables.fontSizeMedium
    },

    textFaint: {
        color: colour.textFaint
    },

    textError: {
        color: colour.errorText
    },

    anchor: {
        color: colour.anchor,
        fontSize: styleVariables.fontSizeBase,
    },

    errorText: {
        color: pallette.error,
    },

    fontSizeHeading: {
        fontSize: styleVariables.fontSizeHeading,
        fontWeight: 'bold'
    },

    fontSizeSubHeading: {
        fontSize: styleVariables.fontSizesubheading,
        fontWeight: 'bold'
    },

    fontSizeSmall: {
        fontSize: styleVariables.fontSizeSmall,
    },

    sup: {
        fontSize: em(0.65)
    },

};
