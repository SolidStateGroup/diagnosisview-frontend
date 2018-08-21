import React, {Component, PropTypes} from 'react';

const About = class extends Component {
	displayName: 'About'

	state = {};

	render() {
		return (
			<View style={Styles.lightboxOuter}>
				<View style={Styles.lightbox}>
					<View style={[Styles.horizontallyPadded, {alignSelf: 'center'}]}>
						<AutoHeightImage width={150} style={[Styles.alignCenter, Styles.stacked]} source={require('../images/brand-medium.png')}/>
						<Text style={[Styles.paragraph, Styles.textSmall]}>DiagnosisView aims to give healthcare students and practitioners immediate access to selected reliable information on 1,000+ common diagnoses</Text>
						<Text style={[Styles.paragraph, Styles.textSmall]}>* Info on your own mobile or tablet</Text>
						<Text style={[Styles.paragraph, Styles.textSmall]}>* Advanced patient info is the starting point (free)</Text>
						<Text style={[Styles.paragraph, Styles.textSmall]}>* Moving on to practitioner-level and expert-level professional resources (most free)</Text>
						<Text style={[Styles.paragraph, Styles.textSmall]}>With an optional account you can save unlimited favourites and history across devices.</Text>
						<Hyperlink
							linkStyle={ { color: '#2980b9', textDecorationLine: 'underline' } }
							linkText={ url => url === 'https://www.ed.ac.uk' ? 'University of Edinburgh' : 'PatientView' }
							linkDefault={true}
						>
							<Text style={[Styles.paragraph, Styles.textSmall]}>DiagnosisView development was commissioned by the https://www.ed.ac.uk with the support of the https://www.patientview.org electronic health records system.</Text>
						</Hyperlink>
					</View>

					<FormGroup>
						<Button style={{alignSelf: 'center', width: 200}} onPress={() => this.props.navigator.dismissLightBox()}>
							Ok
						</Button>
					</FormGroup>
				</View>
			</View>
		);
	}
};

About.propTypes = {};

var styles = StyleSheet.create({

})
module.exports = About;
