import React, { Component, PropTypes } from 'react';
const data = require('../../common-mobile/stores/base/_data');

const About = class extends Component {
	displayName: 'About'

	state = {};

	sendFeedback = () => {
		this.setState({ sending: true, error: '' });
		data.post(Project.api + 'user/feedback', {
			body: this.state.feedback.replace(/\n/g, '<br />')
		}).then(() => {
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
				<View style={[Styles.lightbox,{paddingTop:10}]}>
					<KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid={true}>
						{this.state.showForm ? this.renderForm() : this.renderAboutText()}
					</KeyboardAwareScrollView>
				</View>
			</View>
		);
	}

	renderForm = () => {
		return (
			<View style={[Styles.padded]}>
				<AutoHeightImage width={150} style={[Styles.alignCenter, Styles.stacked]} source={require('../images/brand-medium.png')} />
				<H3 style={[Styles.textCenter,{color:'#2e2e2e'}]}>Give us some feedback</H3>
				<FormGroup>
					<TextInput
						onChangeText={(feedback) => this.setState({ feedback })}
						value={this.state.feedback}
						multiline={true}
						placeholder="Enter feedback here"
						textStyle={{borderRadius:4}}
						height={100}
					/>
				</FormGroup>
				<View>
					{!this.state.sending ? (
						<Row style={[Styles.verticalCenter,{padding:0}]}>
							<Button style={{ alignSelf: 'stretch', marginHorizontal: 5, backgroundColor:'#f3f3f3'}} textStyle={{color:'#2e2e2e'}} onPress={() => this.props.navigator.dismissLightBox()}>Not right now</Button>
							<Button disabled={!this.state.feedback} style={{ alignSelf: 'stretch', marginHorizontal: 5 }} onPress={this.sendFeedback}>Send</Button>
						</Row>
					) : (
						<View style={Styles.roundedAnimationInner}>
							<Animation
								autoPlay={true}
								loop={false}
								style={{ width: 70, height: 70 }} source={require('../animations/success.json')} />
						</View>
					)}
					{this.state.error ?
					<Text style={[Styles.textCenter, { color: pallette.brandDanger, marginTop: 10 }]}>{this.state.error}</Text> : null}
				</View>
			</View>
		);
	}

	renderAboutText =  () => {
		return (
			<View style={[Styles.padded, { alignSelf: 'center' }]}>
				<AutoHeightImage width={150} style={[Styles.alignCenter, Styles.stacked]} source={require('../images/brand-medium.png')} />
				<Text style={[Styles.paragraph, Styles.textSmall]}>About DiagnosisView</Text>
				<Text style={[Styles.paragraph, Styles.textSmall]}>DiagnosisView gives healthcare students and practitioners immediate access to selected reliable information on over 1,000 common diagnoses</Text>
				<Text style={[Styles.paragraph, Styles.textSmall]}>• Info on your own mobile or tablet</Text>
				<Text style={[Styles.paragraph, Styles.textSmall]}>• Advanced patient info is the starting point (free)</Text>
				<Text style={[Styles.paragraph, Styles.textSmall]}>• Moving on to practitioner-level and expert-level professional resources</Text>
				<Text style={[Styles.paragraph, Styles.textSmall]}>With an optional account you can access professional resources, as well as sync favourites and history across devices.</Text>
				<Hyperlink
					linkStyle={{ color: '#2980b9', textDecorationLine: 'underline' }}
					linkText={url => url === 'https://www.patientview.org' ? 'PatientView' : url}
					linkDefault={true}>
					<Text style={[Styles.paragraph, Styles.textSmall]}>DiagnosisView was developed by the University of Edinburgh with the support of the https://www.patientview.org electronic health records system.</Text>
				</Hyperlink>
				<Text style={[Styles.paragraph, Styles.textSmall]}>Please send us your suggestions and feedback.</Text>
				<Hyperlink
					linkStyle={{ color: '#2980b9', textDecorationLine: 'underline' }}
					linkText={url => url === 'https://blogs.ed.ac.uk/diagnosisview' ? 'blogs.ed.ac.uk/diagnosisview' : url}
					linkDefault={true}>
					<Text style={[Styles.paragraph, Styles.textSmall]}>See https://blogs.ed.ac.uk/diagnosisview for latest news and a more detailed guide for users, and about joining as an institution.</Text>
				</Hyperlink>
				<Row style={[Styles.verticalCenter,{padding:0}]}>
					<Button style={{ alignSelf: 'stretch',marginHorizontal: 5, backgroundColor:'#f3f3f3'}} textStyle={{color:'#2e2e2e'}} onPress={() => this.props.navigator.dismissLightBox()}>Close</Button>
					<Button style={{ alignSelf: 'stretch',marginHorizontal: 5}} onPress={() => this.setState({showForm:true})}>Give feedback</Button>
				</Row>
			</View>
		);
	}
};

About.propTypes = {};

var styles = StyleSheet.create({

})
module.exports = About;
