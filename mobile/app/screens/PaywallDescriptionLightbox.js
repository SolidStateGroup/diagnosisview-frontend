import React, {Component, PropTypes} from 'react';

const PaywallDescription = (props) => {
	const {paywalled} = props;
	return (
		<View style={Styles.lightboxOuter}>
			<View style={Styles.lightbox}>
				<View style={[Styles.padded, {alignSelf: 'center'}]}>
					<AutoHeightImage width={150} style={[Styles.alignCenter, Styles.stacked]} source={require('../images/brand-medium.png')}/>
					<Text style={Styles.paragraph}>
						{paywalled === 'LOCKED' ?
							'Your user account or institution doesn\'t yet have a registered account for this resource, though a preview may be displayed when you tap the link. You may need to create a separate account on our partner\'s site in order to access the full article.' :
							'Your user account or institution has full access to this resource. Please tap the link to view the article (you may need to enter via an institutional login).'
						}
					</Text>
					<Button style={{alignSelf: 'center', width: 200}} onPress={() => props.navigator.dismissLightBox()}>
						Ok
					</Button>
				</View>
			</View>
		</View>
	);
}

PaywallDescription.propTypes = {};

module.exports = PaywallDescription;
