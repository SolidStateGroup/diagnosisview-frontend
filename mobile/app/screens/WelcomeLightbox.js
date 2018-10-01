import React, { Component, PropTypes } from 'react';

const Welcome = class extends Component {
	displayName: 'Welcome'

	state = {}

	render() {
		return (
			<View style={Styles.lightboxOuter}>
				<View style={Styles.lightbox}>
					<ScrollView>
						<View style={[Styles.padded, { alignSelf: 'center', alignItems:'flex-start'}]}>
							<AutoHeightImage width={150} style={[Styles.alignCenter, Styles.stacked]} source={require('../images/brand-medium.png')}/>
							<Text style={[Styles.paragraph, Styles.textMedium]}>DiagnosisView aims to give healthcare students and practitioners immediate access to selected reliable information on 1,000+ common diagnoses.</Text>
							<Text style={[Styles.paragraph, Styles.textMedium]}>3 simple steps to get started:</Text>
							<Text style={[Styles.textMedium,{marginBottom:10}]}><Text style={Styles.bold}>1.</Text> Tap the search icon in the top right: <ION name="ios-search" size={styleVariables.fontSizeBase} color={styleVariables.navColor} /></Text>
							<Text style={[{marginBottom:10}, Styles.textMedium]}><Text style={Styles.bold}>2.</Text> Enter at least 3 letters of the diagnosis you are looking for:</Text>
							<AutoHeightImage width={DeviceWidth - 120} source={require('../images/welcome-search.png')} style={{marginBottom:10}}/>
							<Text style={[Styles.textMedium,{marginBottom:10}]}><Text style={Styles.bold}>3.</Text> Scroll down the result list and select the matching diagnosis:</Text>
							<AutoHeightImage width={DeviceWidth - 120} source={require('../images/welcome-search-result.png')}  style={{marginBottom:10}}/>
							<Text style={[Styles.paragraph, Styles.textMedium]}>You can then tap on the displayed links to trusted information sources.</Text>
						</View>
					</ScrollView>

					<FormGroup style={{backgroundColor:'rgba(255,255,255,0.25'}}>
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
