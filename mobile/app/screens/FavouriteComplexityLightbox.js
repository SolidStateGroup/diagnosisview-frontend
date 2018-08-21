import React, {Component, PropTypes} from 'react';

const FavouriteComplexity = (props) => {
	const {difficultyLevel} = props;
	var level, colour;
	switch (difficultyLevel && difficultyLevel.toLowerCase()) {
		case 'green':
		default:
			level = 'Patient/Learner';
			colour = 'Green';
			break;

		case 'amber':
			level = 'Patient/Learner';
			colour = 'Amber';
			break;

		case 'red':
			level = 'Patient/Learner';
			colour = 'Red';
			break;
	}
	return (
		<View style={Styles.lightboxOuter}>
			<View style={Styles.lightbox}>
				<View style={[Styles.horizontallyPadded, {alignSelf: 'center'}]}>
					<AutoHeightImage width={150} style={[Styles.alignCenter, Styles.stacked]} source={require('../images/brand-medium.png')}/>
					<Text style={Styles.paragraph}>
						{`DiagnosisView has classified this information source as '${colour}', representing a '${level}' level of difficulty`}
					</Text>
				</View>

				<FormGroup>
					<Button style={{alignSelf: 'center', width: 200}} onPress={() => props.navigator.dismissLightBox()}>
						Ok
					</Button>
				</FormGroup>
			</View>
		</View>
	);
}

FavouriteComplexity.propTypes = {};

var styles = StyleSheet.create({

})
module.exports = FavouriteComplexity;
