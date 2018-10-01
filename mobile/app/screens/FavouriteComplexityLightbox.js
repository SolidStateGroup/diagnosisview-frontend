import React, {Component, PropTypes} from 'react';

const FavouriteComplexity = (props) => {
	const {difficultyLevel} = props;
	var colour, text;
	switch (difficultyLevel && difficultyLevel.toLowerCase()) {
		case 'green':
		default:
			colour = 'Green';
			text = 'for students or professionals new to the topic.';
			break;

		case 'amber':
			colour = 'Amber';
			text = 'for practitioners and advanced students.';
			break;

		case 'red':
			colour = 'Red';
			text = 'advanced info.';
			break;
	}
	return (
		<View style={Styles.lightboxOuter}>
			<View style={Styles.lightbox}>
				<View style={[Styles.padded, {alignSelf: 'center'}]}>
					<AutoHeightImage width={150} style={[Styles.alignCenter, Styles.stacked]} source={require('../images/brand-medium.png')}/>
					<Text style={Styles.paragraph}>
						{`DiagnosisView has classified this information source as '${colour}', ${text}`}
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
