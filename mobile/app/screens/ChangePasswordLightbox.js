import React, { Component, PropTypes } from 'react';
import data from '../../common-mobile/stores/base/_data';

const Welcome = class extends Component {
	displayName: 'Welcome'

	state = {}

	invalid = () => {
		const { oldPassword, password, repeatPassword } = this.state;
		if (!oldPassword || !password || !repeatPassword) {
			return true;
		}

		return false;
	}

	updatePassword = () => {
		const { oldPassword, password, repeatPassword } = this.state;

		if (password.length < 7) {
			this.setState({ error: 'Password must be at least 7 characters', password: '', repeatPassword: '' });
			this.passwordInput.focus();
			return;

		}

		if (password !== repeatPassword) {
			this.setState({ error: 'Passwords do not match', password: '', repeatPassword: '' });
			this.passwordInput.focus();
			return;
		}

		data.put(Project.api + 'user/', { username: AccountStore.getUser().username, oldPassword, password })
			.then(res => {
				AppActions.setToken(res.token);
				this.animation.play();
				setTimeout(() => {
					this.props.navigator.dismissLightBox();
				}, 800);
			})
			.catch(e => {
				AjaxHandler.error(null, e);
				Alert.alert('', 'Sorry there was a problem changing your password')
			});
	}

	render() {
		return (
			<View style={[Styles.lightboxOuter, {marginTop: 40}]}>
				<ViewOverflow style={[Styles.lightbox]}>
					<ViewOverflow style={{alignSelf: 'center', width: 80, height: 80}}>
						<View style={Styles.roundedAnimationContainer}>
							<View style={Styles.roundedAnimationInner}>
								<Animation
									ref={animation => {
										this.animation = animation;
									}}
									loop={false}
									style={{ width: 70, height: 70 }} source={require('../animations/success.json')} />
							</View>
						</View>
					</ViewOverflow>
					<View style={[Styles.padded, { marginTop: -40 }]}>
						<View style={Styles.stackedForm}>
							<TextInput
								onChangeText={(oldPassword) => this.setState({ oldPassword })}
								value={this.state.oldPassword}
								placeholder="Current password"
								secureTextEntry={true}
								ref={c => this.oldPasswordInput = c}
							/>
						</View>
						<View style={Styles.stackedForm}>
							<TextInput
								onChangeText={(password) => this.setState({ password })}
								value={this.state.password}
								placeholder="New password"
								secureTextEntry={true}
								ref={c => this.passwordInput = c}
							/>
						</View>
						<View style={Styles.stackedForm}>
							<TextInput
								onChangeText={(repeatPassword) => this.setState({ repeatPassword })}
								value={this.state.repeatPassword}
								placeholder="Repeat new password"
								secureTextEntry={true}
								ref={c => this.repeatPasswordInput = c}
							/>
						</View>
						{this.state.error ?
							<Text style={[Styles.textCenter, { color: pallette.brandDanger }]}>{this.state.error ? this.state.error : ''}</Text> :
							null
						}

						<Row style={{ marginTop: 10, alignSelf: 'center' }}>
							<Button style={[Styles.buttonCancel, Styles.buttonLeftModal]}
								onPress={() => this.props.navigator.dismissLightBox()}>
								Cancel
							</Button>
								<Button style={[Styles.buttonRightModal]}
									disabled={this.invalid()} onPress={this.updatePassword}>
									OK
							</Button>
						</Row>
					</View>
				</ViewOverflow>
			</View>
		);
	}
};

Welcome.propTypes = {};

module.exports = Welcome;
