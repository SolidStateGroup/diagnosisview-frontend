import React, {Component, PropTypes} from 'react';

const TagDescription = (props) => {
	const { tag: {code}} = props;
	return (
		<View style={Styles.lightboxOuter}>
			<View style={Styles.lightbox}>
				<View style={[Styles.padded, {alignSelf: 'center'}]}>
					<AutoHeightImage width={150} style={[Styles.alignCenter, Styles.stacked]} source={require('../images/brand-medium.png')}/>
					{Constants.tagDescriptions[code]}
					<Button style={{alignSelf: 'center', width: 200}} onPress={() => props.navigator.dismissLightBox()}>
						Ok
					</Button>
				</View>
			</View>
		</View>
	);
}

TagDescription.propTypes = {};

module.exports = TagDescription;
