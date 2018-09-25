export default (props) => {
  var colorStyle, borderStyle, text;
  switch (props.difficultyLevel) {
    case 'GREEN':
    default:
      colorStyle = Styles.iconLow;
      borderStyle = Styles.borderLow;
      text = 'i';
      break;
    case 'AMBER':
      colorStyle = Styles.iconMedium;
      borderStyle = Styles.borderMedium;
      text = 'i+';
      break;
    case 'RED':
      colorStyle = Styles.iconHigh;
      borderStyle = Styles.borderHigh;
      text = 'i++';
      break;
  }
  return (
    <TouchableOpacity onPress={() => routeHelper.showFavouriteComplexity(props.navigator, props.difficultyLevel)}>
      {/* <ION name="ios-information-circle-outline" style={style}/> */}
      <View style={[styles.circle, borderStyle, props.containerStyle]}>
        <Text style={[Styles.textCenter, styles.text, colorStyle, props.style]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 18,
    fontFamily: 'Times New Roman',
    // backgroundColor: 'green',
    lineHeight: 40,
  }
});
