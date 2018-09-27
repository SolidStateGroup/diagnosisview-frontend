import React, { Component, PropTypes } from 'react';
const data = require('../../common-mobile/stores/base/_data');

const About = class extends Component {
	displayName: 'About'

	state = {};

	sendFeedback = () => {
		this.setState({ sending: true, error: '' });
		data.post(Project.api + 'user/feedback', {
			body: this.state.feedback
		}).then(() => {
			this.animation.play();
			setTimeout(() => {
				this.props.navigator.dismissLightBox();
			}, 800);
		}).catch(e => {
			AjaxHandler.error(null, e);
			this.setState({ sending: false, error: 'Sorry there was a problem sending your feedback. Check you\'re connected to the internet' });
		})
	}

	render() {
		return (
			<View style={Styles.lightboxOuter}>
				<View style={Styles.lightbox}>
					<KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid={true}>
						<View style={[Styles.horizontallyPadded, { alignSelf: 'center' }]}>
							<AutoHeightImage width={150} style={[Styles.alignCenter, Styles.stacked]} source={require('../images/brand-medium.png')} />
							<Text style={[Styles.paragraph, Styles.textSmall]}>About DiagnosisView</Text>
							<Text style={[Styles.paragraph, Styles.textSmall]}>Diagnosis View gives healthcare students and practitioners immediate access to selected reliable information on over 1,000 common diagnoses</Text>
							<Text style={[Styles.paragraph, Styles.textSmall]}>• Info on your own mobile or tablet</Text>
							<Text style={[Styles.paragraph, Styles.textSmall]}>• Advanced patient info is the starting point (free)</Text>
							<Text style={[Styles.paragraph, Styles.textSmall]}>• Moving on to practitioner-level and expert-level professional resources</Text>
							<Text style={[Styles.paragraph, Styles.textSmall]}>With an optional account you can access professional resources, as well as sync favourites and history across devices.</Text>
							<Hyperlink
								linkStyle={{ color: '#2980b9', textDecorationLine: 'underline' }}
								linkText={url => url === 'https://www.patientview.org' ? 'PatientView' : url}
								linkDefault={true}
							>
								<Text style={[Styles.paragraph, Styles.textSmall]}>DiagnosisView was developed by the University of Edinburgh with the support of the https://www.patientview.org electronic health records system.</Text>
							</Hyperlink>
							<Text style={[Styles.paragraph, Styles.textSmall]}>Please send us your suggestions and feedback here:</Text>

							<TextInput
								onChangeText={(feedback) => this.setState({ feedback })}
								value={this.state.feedback}
								multiline={true}
								placeholder="Enter feedback here"
							/>

							<FormGroup>
								{!this.state.sending ? (
									<Row style={Styles.verticalCenter}>
										<Button disabled={!this.state.feedback} style={{ alignSelf: 'stretch', marginHorizontal: 5 }} onPress={this.sendFeedback}>Send</Button>
										<Button style={{ alignSelf: 'stretch', marginHorizontal: 5 }} onPress={() => this.props.navigator.dismissLightBox()}>Not right now</Button>
									</Row>
								) : null}
								{this.state.error &&
									<Text style={[Styles.textCenter, { color: pallette.brandDanger, marginTop: 10 }]}>{this.state.error ? this.state.error : ''}</Text>}
								<View style={[Styles.roundedAnimationInner, { opacity: this.state.sending ? 1 : 0 }]}>
									<Animation
										ref={animation => {
											this.animation = animation;
										}}
										loop={false}
										style={{ width: 70, height: 70 }} source={require('../animations/success.json')} />
								</View>
							</FormGroup>
						</View>
					</KeyboardAwareScrollView>
				</View>
			</View>
		);
	}
};

About.propTypes = {};

var styles = StyleSheet.create({

})
module.exports = About;
