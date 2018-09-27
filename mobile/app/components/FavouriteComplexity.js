export default (props) => {
    var colorStyle, borderStyle, text, backgroundStyle;
    switch (props.difficultyLevel) {
        case 'GREEN':
        default:
            colorStyle = Styles.iconLow;
            borderStyle = Styles.borderLow;
            backgroundStyle = Styles.backgroundLow;
            text = 'i';
            break;
        case 'AMBER':
            colorStyle = Styles.iconMedium;
            backgroundStyle = Styles.backgroundMedium;
            borderStyle = Styles.borderMedium;
            text = 'i+';
            break;
        case 'RED':
            colorStyle = Styles.iconHigh;
            backgroundStyle = Styles.backgroundHigh;
            borderStyle = Styles.borderHigh;
            text = 'i++';
            break;
    }
    return (
        <TouchableOpacity onPress={() => routeHelper.showFavouriteComplexity(props.navigator, props.difficultyLevel)}>
            {/* <ION name="ios-information-circle-outline" style={style}/> */}
            <View style={[styles.circle, borderStyle, backgroundStyle, props.containerStyle]}>
                <Text style={[Styles.textCenter, styles.text, props.style]}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    circle: {
        width: 30,
        height: 30,
        borderRadius: 20,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        // backgroundColor: 'green',
        lineHeight: 28,
        color:'#fff'
    }
});
