export default (props) => {
  var style = [Styles.listIconNav, Styles.iconLow];
  if (props.style) {
    if (typeof props.style === 'array') {
      style.concat(props.style);
    } else {
      style.push(props.style);
    }
  }
  return (
    <TouchableOpacity onPress={() => routeHelper.showFavouriteComplexity(props.navigator, props.difficultyLevel)}>
      {!props.difficultyLevel || props.difficultyLevel === "GREEN" ? (<ION name="ios-information-circle-outline" style={style}/>) : null}
      {props.difficultyLevel === "AMBER" ? (<ION name="ios-information-circle-outline" style={style}/>) : null}
      {props.difficultyLevel === "RED" ? (<ION name="ios-information-circle-outline" style={style}/>) : null}
    </TouchableOpacity>
  );
};
