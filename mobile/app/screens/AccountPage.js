/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';

const AccountPage = class extends Component {
	static navigatorStyle = global.navbarStyle;

	constructor(props, context) {
		super(props, context);
		const prefill = Constants.simulate.PRE_FILLED_REGISTER;
		this.state = {
			firstName: prefill ? "SSG" : '',
			lastName: prefill ? "Test" : '',
			username: prefill ? "test@solidstategroup.com" : '',
			password: prefill ? "password" : '',
			repeatPassword: prefill ? "password" : '',
		};
		ES6Component(this);
		routeHelper.handleNavEvent(props.navigator, 'account', this.onNavigatorEvent);
	}

	componentDidMount() {
		this.listenTo(AccountStore, 'change', () => this.forceUpdate());
	}

	onNavigatorEvent = (event) => {
		if (event.id == routeHelper.navEvents.SHOW) {
			API.trackPage('Account Screen');
			if (AccountStore.getUser()) {
				this.onLogin();
			}
		} else if (event.type == 'NavBarButtonPress') {
			if (event.id == 'menu') {
				this.props.navigator.toggleDrawer({ side: 'left' });
			} else if (event.id == 'search') {
				routeHelper.goSearch(this.props.navigator);
			}
		} else if (event.type == 'DeepLink' && event.link == 'goLogin') {
			this.setState({login: true});
		} else if (event.type == 'DeepLink' && event.link == 'goRegister') {
			this.setState({login: false});
		}
	};

	register = () => {
		const {firstName, lastName, username, password, repeatPassword, occupation, institution} = this.state;

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

		if (!Utils.isValidEmail(username)) {
			this.setState({error: 'Email address is invalid'});
			this.emailInput.focus();
			return;
		}

		this.setState({error: ''});
		this.accountProvider.clearError();
		AppActions.register({firstName, lastName, username: username.toLowerCase(), password, occupation, institution});
	}

	invalid = () => {
		const {firstName, lastName, username, password, repeatPassword, occupation, institution} = this.state;

		if (!firstName || !lastName || !username || !password || !repeatPassword || !occupation || !institution) {
			return true;
		}

		return false;
	}

	subscribe = () => {
		API.subscribe();
	}

	showRegisterForm = () => {
		if (this.state.login) {
			this.accountProvider.clearError();
			this.setState({login: false, password: '', repeatPassword: '', error: ''});
		}
	}

	showLoginForm = () => {
		if (!this.state.login) {
			this.accountProvider.clearError();
			this.setState({login: true, password: '', error: ''});
		}
	}

	loginInvalid = () => {
		const {username, password} = this.state;

		if (!username || !password) {
			return true;
		}

		return false;
	}

	login = () => {
		const {username, password} = this.state;

		if (!Utils.isValidEmail(username)) {
			this.setState({error: 'Email address is invalid'});
			this.emailInput.focus();
			return;
		}

		this.setState({error: ''});
		this.accountProvider.clearError();
		AppActions.login({username: username.toLowerCase(), password});
	}

	logout = () => {
		Alert.alert('Confirm', 'Are you sure you want to log out?' + (AccountStore.isSubscribed() ? ' Your history and favourites will no longer be saved against your account' : ''), [
			{text: 'No', style: 'cancel'},
			{text: 'Yes', onPress: () => {
				this.accountProvider.clearError();
				AppActions.logout();
			}}
		]);
	}

	profileChanged = (user) => {
		if (this.state.firstName != user.firstName) {
			return true;
		}

		if (this.state.lastName != user.lastName) {
			return true;
		}

		if (this.state.occupation != user.occupation) {
			return true;
		}

		if (this.state.institution != user.institution) {
			return true;
		}

		return false;
	}

	profileInvalid = () => {
		const {firstName, lastName, occupation, institution} = this.state;

		if (!firstName || !lastName || !occupation || !institution) {
			return true;
		}

		return false;
	}

	onLogout = () => {
		this.setState({firstName: '', lastName: '', password: '', repeatPassword: '', username: '', occupation: '', institution: ''});
	}

	onLogin = () => {
		const user = AccountStore.getUser();
		this.setState({
			firstName: user.firstName,
			lastName: user.lastName,
			occupation: user.occupation || '',
			institution: user.institution || ''
		});
	}

	updateAccount = () => {
		this.accountProvider.clearError();
		this.setState({error: ''});
		AppActions.updateAccount({
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			occupation: this.state.occupation,
			institution: this.state.institution
		});
	}

	forgotPassword = () => {
		routeHelper.showForgotPassword(this.props.navigator);
	}

	renderDropdowns = () => (
		<View>
			<View style={Styles.stackedForm}>
				<Dropdown
					containerStyle={[Styles.dropdownInput]}
					label="Occupation"
					lineWidth={0}
					labelHeight={this.state.occupation ? 20 : 14}
					baseColor={styleVariables.textLight}
					inputContainerPadding={0}
					data={[{value: 'Healthcare Student'}, {value: 'Healthcare Practitioner'}, {value: 'Patient'}, {value: 'Other'}]}
					value={this.state.occupation}
					onChangeText={(occupation) => this.setState({occupation})}
				/>
			</View>
			<View style={Styles.stackedForm}>
				<Dropdown
					containerStyle={[Styles.dropdownInput]}
					label="Institution"
					lineWidth={0}
					labelHeight={this.state.institution ? 20 : 14}
					baseColor={styleVariables.textLight}
					inputContainerPadding={0}
					data={[{value: 'University of Edinburgh'}, {value: 'Other'}, {value: 'None'}]}
					value={this.state.institution}
					onChangeText={(institution) => this.setState({institution})}
				/>
			</View>
		</View>
	)

	renderLoginFields = (register) => (
		<View>
			<View style={Styles.stackedForm}>
				<TextInput
					onChangeText={(username) => this.setState({username})}
					value={this.state.username}
					placeholder="Email address"
					ref={c => this.emailInput = c}
					autoCapitalize='none'
					keyboardType='email-address'
					autoCorrect={false}
				/>
			</View>
			<View style={Styles.stackedForm}>
				<TextInput
					onChangeText={(password) => this.setState({password})}
					value={this.state.password}
					placeholder={register ? "Password (min 7 characters)" : "Password"}
					secureTextEntry={true}
					ref={c => this.passwordInput = c}
				/>
			</View>
		</View>
	)

	renderRegisterForm = () => (
		<View>
			<View style={Styles.stackedForm}>
				<TextInput
					onChangeText={(firstName) => this.setState({firstName})}
					value={this.state.firstName}
					placeholder="First name"
				/>
			</View>
			<View style={Styles.stackedForm}>
				<TextInput
					onChangeText={(lastName) => this.setState({lastName})}
					value={this.state.lastName}
					placeholder="Last name"
				/>
			</View>
			{this.renderLoginFields(true)}
			<View style={Styles.stackedForm}>
				<TextInput
					onChangeText={(repeatPassword) => this.setState({repeatPassword})}
					value={this.state.repeatPassword}
					placeholder="Repeat password"
					secureTextEntry={true}
					ref={c => this.repeatPasswordInput = c}
				/>
			</View>
			{this.renderDropdowns()}
			<View style={[Styles.actionsContainer, Styles.stacked]}>
				<Button onPress={this.register} disabled={this.invalid()}>Register</Button>
			</View>
		</View>
	);

	renderLoginForm = () => (
		<View>
			{this.renderLoginFields(false)}
			<View style={[Styles.actionsContainer, Styles.stacked]}>
				<Button onPress={this.login} disabled={this.loginInvalid()}>Login</Button>
				<Text style={[Styles.textCenter, Styles.anchor]} onPress={this.forgotPassword}>Forgot password?</Text>
			</View>
		</View>
	)

	renderAccountForm = (user, error) => (
		<View>
			<View style={Styles.stackedForm}>
				<TextInput
					onChangeText={(firstName) => this.setState({firstName})}
					value={this.state.firstName}
					placeholder="First name"
				/>
			</View>
			<View style={Styles.stackedForm}>
				<TextInput
					onChangeText={(lastName) => this.setState({lastName})}
					value={this.state.lastName}
					placeholder="Last name"
				/>
			</View>
			{this.renderDropdowns()}
			{this.state.error ?
				<Text style={[Styles.textCenter, {color: pallette.brandDanger}]}>{this.state.error ? this.state.error : ''}</Text> :
				<Text style={[Styles.textCenter, {color: pallette.brandDanger}]}>{error ? error.message : ''}</Text>
			}
			<View style={[Styles.actionsContainer, Styles.stacked]}>
				<Button style={Styles.stacked} onPress={this.updateAccount} disabled={!this.profileChanged(user) || this.profileInvalid()}>Save Changes</Button>
				<Button onPress={() => routeHelper.showChangePassword(this.props.navigator)}>Change Password</Button>
			</View>
		</View>
	);

	render() {
		const manageSubscriptionLink = Platform.OS === 'android' ?
			`https://play.google.com/store/account/subscriptions?sku=${iapItemSkus[0]}&package=${DeviceInfo.getBundleId()}` :
			`itms-apps://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions`;

		return (
			<AccountProvider ref={c => this.accountProvider = c} onLogin={this.onLogin} onLogout={this.onLogout} onSave={this.onLogin}>
				{({user, isLoading, isSaving, error})=>(
					<Flex>
						<NetworkBar />
						{isLoading || isSaving ? <Flex style={Styles.centeredContainer}><Loader /></Flex> : (
						<KeyboardAwareScrollView style={{backgroundColor:pallette.backgroundBase}} keyboardShouldPersistTaps="handled">

								<View style={[ Styles.stacked, Styles.padded]}>
								{user && user.activeSubscription ? (
									<View style={[Styles.whitePanel, Styles.padded]}>
										<Text style={[Styles.textCenter, Styles.stacked]}>Your account is active.</Text>
										<Text style={[Styles.textCenter, { color: '#2980b9', textDecorationLine: 'underline' }]} onPress={() => Linking.openURL(manageSubscriptionLink)}>Manage your subscription</Text>
									</View>
								) : null}
								{!user || !user.activeSubscription ? (
									<View style={[Styles.whitePanel, Styles.padded]}>
										<Text style={[Styles.textMedium]}>
										A user account costs only <Text style={[Styles.textSmall, Styles.semiBold]}>£3.99 / year</Text>, proceeds of which keep your info sources up and running, plus new trusted sources integrated where possible. An account will unlock access to unlimited search history and favourites across all of your devices, and provide access to paid resources in future.
										</Text>
										{user && !user.activeSubscription ? <Button style={{marginTop: 10}} onPress={this.subscribe}>{(user && user.paymentData && user.paymentData.length ? 'Renew' : 'Subscribe') + ' now'}</Button> : null}
									</View>
								) : null}
								{!user ? (
									<FormGroup>
										<Row style={{alignItems:'center', marginBottom:10, justifyContent:'center'}}>
											<Button
												onPress={this.showRegisterForm}
												style={!this.state.login ? [Styles.segmentedControl, Styles.segmentedControlActive, Styles.segmentedControlLeft] : Styles.segmentedControl}
												textStyle={!this.state.login ? [Styles.segmentedControlText,Styles.segmentedControlTextActive] : Styles.segmentedControlText}
											>
												Register
											</Button>
											<Button
												onPress={this.showLoginForm}
												style={this.state.login ? [Styles.segmentedControl, Styles.segmentedControlActive, Styles.segmentedControlRight, {alignSelf: 'auto'}] : [Styles.segmentedControl,{alignSelf: 'auto'}]}
												textStyle={this.state.login ? [Styles.segmentedControlText,Styles.segmentedControlTextActive] : Styles.segmentedControlText}
											>
												Login
											</Button>
										</Row>
										{!this.state.login ? this.renderRegisterForm() : this.renderLoginForm()}
										{this.state.error ?
											<Text style={[Styles.textCenter, {color: pallette.brandDanger}]}>{this.state.error}</Text> :
											error ? <Text style={[Styles.textCenter, {color: pallette.brandDanger}]}>{error.message === 'No message available' ? 'Sorry something went wrong' : error.message}</Text> : null
										}
									</FormGroup>

								) : (
									<FormGroup>
										{this.renderAccountForm(user, error)}
										<Button onPress={this.logout}>Logout</Button>
									</FormGroup>
								)}
							</View>
						</KeyboardAwareScrollView>
						)}
					</Flex>
				)}
			</AccountProvider>
		)
	}
}

AccountPage.propTypes = {};

module.exports = AccountPage;
