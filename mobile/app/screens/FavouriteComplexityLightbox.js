import React, {Component, PropTypes} from 'react';

const FavouriteComplexity = (props) => {
	const {difficultyLevel} = props;
	var {colour, text} = Constants.difficultyLevels(difficultyLevel);

	return (
		<View style={Styles.lightboxOuter}>
			<View style={Styles.lightbox}>
				<View style={[Styles.padded, {alignSelf: 'center'}]}>
					<AutoHeightImage width={150} style={[Styles.alignCenter, Styles.stacked]} source={require('../images/brand-medium.png')}/>
					<Text style={Styles.paragraph}>
						{`Level = '${colour}', ${text}`}
					</Text>
					<Button style={{alignSelf: 'center', width: 200}} onPress={() => props.navigator.dismissLightBox()}>
						Ok
					</Button>
				</View>
			</View>
		</View>
	);
}

FavouriteComplexity.propTypes = {};

var styles = StyleSheet.create({

})
module.exports = FavouriteComplexity;
