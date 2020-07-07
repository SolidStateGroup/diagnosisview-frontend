module.exports = {

    // INFO ICONS ----------------

    iconHigh:{
        color:'#fb3823',
    },

    iconMedium:{
        color:'#ffc200',
    },

    iconLow:{
        color:'#5bc43b',
    },

    borderHigh:{
        borderColor:'#fb3823',
    },

    borderMedium:{
        borderColor:'#ffc200',
    },

    borderLow:{
        borderColor:'#5bc43b',
    },

    backgroundHigh:{
        backgroundColor:'#fb3823',
    },

    backgroundMedium:{
        backgroundColor:'#fbe423',
    },

    backgroundLow:{
        backgroundColor:'#5bc43b',
    },

    listContainer: {
        flex: 1,
        backgroundColor: colour.listBackground
    },

    insetList: {
        padding: styleVariables.paddingBase,
        backgroundColor: '#fff'
    },

    listItem: {
        minHeight: 44,
        // justifyContent: 'center',
        alignItems: 'stretch',
        alignSelf:'stretch',
        borderBottomWidth: 1 / PixelRatio.get(),
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomColor: colour.dividerLight,
        backgroundColor: 'transparent',
        paddingTop:10,
        paddingBottom:10,
    },

    listShort:{
        paddingTop:7,
        paddingBottom:7,
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: colour.dividerLight,
    },

    listItemAlt: {
        borderBottomColor: colour.divider,
        backgroundColor: colour.listBackgroundAlt,
    },

    listItemDisabled: {
        opacity: .5
    },

    listItemLast: {
        borderBottomWidth: 0,
    },
    liContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    listItemText: {
        color: pallette.textLight,
    },

    listIcon: {
        fontSize: styleVariables.fontSizeBase * 2.5,
        marginRight: styleVariables.paddingBase,
    },

    listIconNav: {
        fontSize: styleVariables.fontSizeBase * 1.5,
        color: colour.textFaintLight
    },

    listIconNavMarginRight: {
        marginRight: 5
    },

    listIconNavError:{
        color:'red',
    },

    listItemTitle: {
        fontWeight: 'bold'
    },

    listHeaderText: {
        color: '#fff',
    },

    indentListItem:{
        paddingLeft:30,
    },

    listHeading:{
        fontSize:styleVariables.fontSizeSmall,
        opacity:0.5,
    },

    listItemImage:{
        height:20,
        resizeMode:'contain',
        width:80,
    },

    listSubText: {
        flex: 1
    },

    tag: {
        padding: 5,
        borderRadius: 4,
    },

    tagText: {
        fontSize: styleVariables.fontSizeSmaller,
        fontWeight: 'bold',
        color: 'white',
    },
};
