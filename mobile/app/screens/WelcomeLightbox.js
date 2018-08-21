import React, { Component, PropTypes } from 'react';

const Welcome = class extends Component {
	displayName: 'Welcome'

	state = {}

	render() {
		return (
			<View style={Styles.lightboxOuter}>
				<View style={Styles.lightbox}>
					<View style={[Styles.horizontallyPadded, { alignSelf: 'center' }]}>
						<AutoHeightImage width={150} style={[Styles.alignCenter, Styles.stacked]} source={require('../images/brand-medium.png')}/>
						<Text style={[Styles.paragraph]}>DiagnosisView aims to give healthcare students and practitioners immediate access to selected reliable information on 1,000+ common diagnoses</Text>
						<Text style={[Styles.paragraph]}>3 simple steps to get started:</Text>
						<Text>1. Tap the search icon in the top right: <ION name="ios-search" size={styleVariables.fontSizeBase} color={styleVariables.navColor} /></Text>
						<Text>2. Enter at least 3 letters of the diagnosis you are looking for:</Text>
						<AutoHeightImage style={Styles.alignCenter} width={DeviceWidth - 120} source={require('../images/welcome-search.png')} />
						<Text style={[Styles.paragraph]}>3. Scroll down the result list and select the matching diagnosis:</Text>
						<AutoHeightImage style={Styles.alignCenter} width={DeviceWidth - 120} source={require('../images/welcome-search-result.png')} />
						<Text style={[Styles.paragraph]}>You can then tap on the displayed links to trusted information sources.</Text>
					</View>

					<FormGroup>
						<Button style={{ alignSelf: 'center', width: 200 }} onPress={() => this.props.navigator.dismissLightBox()}>
							Got it, thanks
						</Button>
					</FormGroup>
				</View>
			</View>
		);
	}
};

Welcome.propTypes = {};

module.exports = Welcome;
