import React, { Component, PropTypes } from 'react';

const ForgotPasswordLightbox = class extends Component {
	displayName: 'ForgotPasswordLightbox'

	state = {
		step: 1
	}

	componentDidMount() {
		this.emailInput.focus();
	}

	sendEmail = () => {
		this.setState({isLoading: true, error: ''});
		setTimeout(() => {
			this.setState({isLoading: false, step: 2})
		}, 1000);
	}

	verifyCode = (code) => {
		this.setState({isLoading: true, error: ''});
		setTimeout(() => {
			this.setState({isLoading: false, step: 3});
		}, 1000);
	}

	changePassword = () => {
		const { password, repeatPassword } = this.state;

		if (password.length < 7) {
			this.setState({error: 'Password must be at least 7 characters', password: '', repeatPassword: ''});
			this.passwordInput.focus();
			return;

		}

		if (password !== repeatPassword) {
			this.setState({error: 'Passwords do not match', password: '', repeatPassword: ''});
			this.passwordInput.focus();
			return;
		}

		// TODO
		this.setState({isLoading: true, error: ''});
		setTimeout(() => {
			this.setState({isLoading: false, step: 4});
		}, 1000);
	}

	render() {
		return (
			<View style={Styles.lightboxOuter}>
				<View style={[Styles.lightbox, {height: '100%', paddingVertical: 20}]}>
					{this.state.isLoading ? <Flex style={Styles.centeredContainer}><Loader/></Flex> : (
						<View style={[Styles.horizontallyPadded]}>
						  {(() => {
								switch (this.state.step) {
									case 1:
									default:
										return (
											<View>
												<TextInput
													onChangeText={(email) => this.setState({email})}
													value={this.state.email}
													placeholder={"Enter your email address"}
													ref={c => this.emailInput = c}
												/>
												<FormGroup>
													<Row style={{alignItems: 'stretch', justifyContent: 'space-around'}}>
														<Button style={{ width: 150 }} onPress={() => this.props.navigator.dismissLightBox()}>
															Cancel
														</Button>
														<Button style={{ width: 150 }} disabled={!this.state.email || !Utils.isValidEmail(this.state.email)} onPress={this.sendEmail}>
															OK
														</Button>
													</Row>
												</FormGroup>
											</View>
										);
									case 2:
										return (
											<View>
												<Text style={Styles.textCenter}>Enter reset code:</Text>
												<CodeInput
													ref={c => this.codeInput = c}
													space={5}
													inputPosition='center'
													activeColor='rgba(49, 180, 4, 1)'
													inactiveColor='rgba(49, 180, 4, 1.3)'
													codeInputStyle={{ fontWeight: '800' }}
													onFulfill={this.verifyCode}
												/>
											</View>
										)
									case 3:
										return (
											<View>
												<View style={Styles.stackedForm}>
													<TextInput
														onChangeText={(password) => this.setState({password})}
														value={this.state.password}
														placeholder={"New password (min 7 characters)"}
														secureTextEntry={true}
														ref={c => this.passwordInput = c}
													/>
												</View>
												<View style={Styles.stackedForm}>
													<TextInput
														onChangeText={(repeatPassword) => this.setState({repeatPassword})}
														value={this.state.repeatPassword}
														placeholder="Repeat password"
														secureTextEntry={true}
														ref={c => this.repeatPasswordInput = c}
													/>
												</View>
												<Row style={{alignItems: 'stretch', justifyContent: 'space-around'}}>
													<Button style={{ width: 150 }} disabled={!this.state.password || !this.state.repeatPassword} onPress={this.changePassword}>
														OK
													</Button>
												</Row>
											</View>
										)
									case 4:
										return (
											<View>
												<Text style={Styles.textCenter}>Password was reset successfully</Text>
												<FormGroup>
													<Row style={{alignItems: 'stretch', justifyContent: 'space-around'}}>
														<Button style={{ width: 150 }} onPress={() => this.props.navigator.dismissLightBox()}>
															OK
														</Button>
													</Row>
												</FormGroup>
											</View>
										)
								}
							})()}
							{this.state.error && <Text>{this.state.error}</Text>}
						</View>
					)}
				</View>
			</View>
		);
	}
};

ForgotPasswordLightbox.propTypes = {};

module.exports = ForgotPasswordLightbox;
