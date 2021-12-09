/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import { TouchableOpacity } from "react-native";
import Captcha from "../components/Captcha";

const AccountPage = class extends Component {
	static navigatorStyle = global.navbarStyle;

	constructor(props, context) {
		super(props, context);
		const prefill = Constants.simulate.PRE_FILLED_REGISTER;
		const user = AccountStore.getUser();
		if (user) {
			this.state = {
				firstName: user.firstName,
				lastName: user.lastName,
				occupation: user.occupation || '',
				institution: user.institution || ''
			}
		} else {
			this.state = {
				firstName: prefill ? "SSG" : '',
				lastName: prefill ? "Test" : '',
				username: prefill ? "test@solidstategroup.com" : '',
				password: prefill ? "password" : '',
				repeatPassword: prefill ? "password" : '',
			};
		}

		ES6Component(this);
		routeHelper.handleNavEvent(props.navigator, 'account', this.onNavigatorEvent);
	}

	componentDidMount() {
		this.listenTo(AccountStore, 'loaded', () => {
			const user = AccountStore.getUser();
			if (user) {
				this.setState({
					firstName: user.firstName,
					lastName: user.lastName,
					occupation: user.occupation || '',
					institution: user.institution || ''

				});

			}
		});
	}

	onNavigatorEvent = (event) => {
		if (event.id == routeHelper.navEvents.SHOW) {
			AppActions.getAccount()
			API.trackPage('Account Screen');
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

		this.setState({error: '', captcha: (captchaResponse)=>{
				this.setState({captcha: null})
				this.accountProvider.clearError();
				AppActions.register({firstName,captchaResponse, lastName, username: username.toLowerCase(), password, occupation, institution});
		}})


	}

	invalid = () => {
		const {firstName, lastName, username, password, repeatPassword, occupation, institution} = this.state;

		if (!firstName || !lastName || !username || !password || !repeatPassword || !occupation || !institution) {
			return true;
		}

		return false;
	}

	subscribe = () => {
		AppActions.buySubscription();
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
		Alert.alert('Confirm', 'Are you sure you want to log out?' + (AccountStore.hasActiveSubscription() ? ' Your history and favourites will no longer be saved against your account' : ''), [
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

	sortInstitutions = (a, b) => {
		if (a.id === 'OTHER') {
			if (b.id === 'NONE') return -1;
			return 1;
		}
		if (b.id === 'OTHER') {
			if (a.id === 'NONE') return 1;
			return -1;
		}
		if (a.id === 'NONE') {
			return 1;
		}
		if (b.id === 'NONE') {

			return -1;
		}
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	}

	renderDropdowns = (settings) => {
		const selectedInstitution = this.state.institution && _.find(settings.institutions, i => i.id === this.state.institution);
		return (
			<View>
				<View style={Styles.stackedForm}>
					<Dropdown
						containerStyle={[Styles.dropdownInput]}
						label="Occupation"
						lineWidth={0}
						labelHeight={this.state.occupation ? 20 : 14}
						baseColor={styleVariables.textLight}
						inputContainerPadding={0}
						data={Constants.occupations}
						value={this.state.occupation}
						onChangeText={(occupation) => this.setState({occupation})}
					/>
				</View>
				<Row style={Styles.stackedForm}>
					<Flex>
						<Dropdown
							containerStyle={[Styles.dropdownInput]}
							label="Institution"
							lineWidth={0}
							labelHeight={this.state.institution ? 20 : 14}
							baseColor={styleVariables.textLight}
							inputContainerPadding={0}
							data={_.map(_.filter(settings.institutions, i => i.id === this.state.institution || !i.hidden).sort(this.sortInstitutions), institution => ({value: institution.id, label: institution.name}))}
							value={this.state.institution}
							onChangeText={(institution) => this.setState({institution})}
							multiline
							style={{lineHeight: 25}}
						/>
					</Flex>
					{(selectedInstitution && selectedInstitution.logoUrl) ? <Image source={{uri: selectedInstitution.logoUrl.indexOf('/api/') !== -1 ? Project.api + selectedInstitution.logoUrl.substr(5) : selectedInstitution.logoUrl}} style={Styles.accountInstitutionLogo} /> : null}
				</Row>
			</View>
		)
	}

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

	renderRegisterForm = (error, settings) => (
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
			{this.renderDropdowns(settings)}
			<View style={[Styles.actionsContainer, Styles.stacked]}>
				<Button onPress={this.register} disabled={this.invalid()}>Register</Button>
			</View>
			{this.state.error ?
				<Text style={[Styles.textCenter, {color: pallette.brandDanger}]}>{this.state.error}</Text> :
				error ? <Text style={[Styles.textCenter, {color: pallette.brandDanger}]}>{error.message === 'No message available' ? 'Sorry something went wrong' : error.message}</Text> : null
			}
		</View>
	);

	renderLoginForm = (error) => (
		<View>
			{this.renderLoginFields(false)}
			<View style={[Styles.actionsContainer, Styles.stacked]}>
				<Button onPress={this.login} disabled={this.loginInvalid()}>Login</Button>
			</View>
			{this.state.error ?
				<Text style={[Styles.paragraph, Styles.textCenter, {color: pallette.brandDanger}]}>{this.state.error}</Text> :
				error ? <Text style={[Styles.paragraph, Styles.textCenter, {color: pallette.brandDanger}]}>{error.message === 'No message available' ? 'Sorry something went wrong' : error.message}</Text> : null
			}
			<Text style={[Styles.textCenter, Styles.anchor]} onPress={this.forgotPassword}>Forgot password?</Text>
		</View>
	)

	renderAccountForm = (user, error, settings) => (
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
			{this.renderDropdowns(settings)}
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

	openInfo = (text)=>{
		routeHelper.showInfo(this.props.navigator, text)
	}

	render() {
		const manageSubscriptionLink = Platform.OS === 'android' ?
			`https://play.google.com/store/account/subscriptions?sku=${iapItemSkus[0]}&package=${DeviceInfo.getBundleId()}` :
			`itms-apps://buy.itunes.apple.com/WebObjects/MZFinance.wo
			a/wa/manageSubscriptions`;

		return (
			<AccountProvider ref={c => this.accountProvider = c} onLogout={this.onLogout} onSave={this.onLogin}>
				{({user, isLoading, isSaving, error})=>(
					<SubscriptionProvider>
						{({ isLoading: subscriptionLoading}) => (
							<SettingsProvider>
								{({settings, isLoading: settingsIsLoading, error: settingsError}) => {
									const noAutoRenewal = SubscriptionStore.subscription && SubscriptionStore.subscription.autoRenewing === false;

									return (
										<Flex>
											<NetworkBar />
											{(isLoading || isSaving || settingsIsLoading || !settings) ? <Flex style={Styles.centeredContainer}><Loader /></Flex> : (
												<KeyboardAwareScrollView style={{backgroundColor:pallette.backgroundBase}} keyboardShouldPersistTaps="handled">
													<View style={Styles.hero}></View>
													<View style={[ Styles.stacked, Styles.padded]}>
														{(AccountStore.hasActiveSubscription() || user) ? (
															<View style={[Styles.whitePanel, Styles.padded, (!AccountStore.hasActiveSubscription() || !user) ? Styles.mb10 : {}]}>
																{user ? <Text style={[Styles.textCenter, Styles.semiBold]}>{user.emailAddress}</Text> : null}
																{AccountStore.hasActiveSubscription() && !noAutoRenewal ? (
																	<React.Fragment>
																		<Text style={[Styles.textCenter]}>{
																			!AccountStore.isMobileSubscription()? Constants.webSubscriptionMessage: "Your subscription is active."
																		}</Text>
																		{SubscriptionStore.isMobileSubscription() &&(
																			<Text style={[Styles.textCenter, { color: '#2980b9', textDecorationLine: 'underline' }]} onPress={() => Linking.openURL(manageSubscriptionLink)}>Manage your subscription</Text>
																		)}
																	</React.Fragment>
																) : null}
															</View>
														) : null}
														{Constants.simulate.MANAGE_SUBSCRIPTION && (
															<Text style={[Styles.textCenter, { color: '#fff', padding:20, textDecorationLine: 'underline' }]} onPress={() => Linking.openURL(manageSubscriptionLink)}>Manage your subscription</Text>
														)}
														{(!AccountStore.hasActiveSubscription() || !user || noAutoRenewal) ? (
															<View style={[Styles.whitePanel, Styles.padded, AccountStore.hasActiveSubscription() ? Styles.mt10 : {}]}>
																{(noAutoRenewal || (!AccountStore.hasActiveSubscription() && !subscriptionLoading)) ? (
																	<React.Fragment>
																		<Text style={[Styles.textMedium, Styles.paragraph]}>
																			Subscribe to access professional resources that are unavailable in the free version. The fee helps us to cover maintenance and improvement costs.
																		</Text>
																		<Button style={[Styles.mb10, Styles.mt5]} onPress={this.subscribe}>{((user && user.paymentData && user.paymentData.length) || noAutoRenewal ? 'Renew' : 'Subscribe')}</Button>
																	</React.Fragment>
																) : subscriptionLoading ? <Flex style={Styles.centeredContainer}><Loader /></Flex> : null}
																{!user ? (
																	<React.Fragment>

																		<Text style={[Styles.textMedium, Styles.paragraph]}>
																			Register your DiagnosisView account to access the features below, or tap Login if you have one already:
																		</Text>
																		<TouchableOpacity onPress={()=>this.openInfo("DiagnosisView account holders can have unlimited history and unlimited favourites, and these are synchronized between your devices")}>
																			<Row style={[{flexWrap:'nowrap'},Styles.mb5]}>
																				<Image source={require('../images/icon-medical.png')} style={{height:24, width:24, marginRight:10, resizeMode:"contain"}}/>
																				<Text style={[Styles.textAnchor, {width:DeviceWidth-80},Styles.textSmall,]}>
																					Unlimited history and favourites
																				</Text>
																			</Row>
																		</TouchableOpacity>
																		<TouchableOpacity onPress={()=>this.openInfo("Access the web version of DiagnosisView for free via your web browser at www.diagnosisview.org, giving you a large screen view of DiagnosisView along with our partners’ info pages. You may login using the same login email and password.")} >
																			<Row style={[{flexWrap:'nowrap'},Styles.mb5]}>
																				<Image source={require('../images/icon-medical.png')} style={{height:24, width:24, marginRight:10, resizeMode:"contain"}}/>
																				<Text style={[Styles.textAnchor, {width:DeviceWidth-80},Styles.textSmall,]}>
																					Immediate access to DiagnosisView Web
																				</Text>
																			</Row>
																		</TouchableOpacity>

																		<TouchableOpacity onPress={()=>this.openInfo("Some paywalled resources are mapped as amber or red links. If you belong to an affiliated institution, direct links may be provided so that you only have to login once.")} style={[Styles.textMedium, Styles.textAnchor, Styles.paragraph]}>
																			<Row style={[{flexWrap:'nowrap'},Styles.mb5]}>
																				<Image source={require('../images/icon-medical.png')} style={{height:24, width:24, marginRight:10, resizeMode:"contain"}}/>
																				<Text style={[Styles.textAnchor, {width:DeviceWidth-80},Styles.textSmall,]}>
																					Access paywalled links to your Institution
																				</Text>
																			</Row>
																		</TouchableOpacity>


																	</React.Fragment>
																) : null}
															</View>
														) : null}
														{!user ? (
															<FormGroup>
																<Row style={{alignItems:'center', marginBottom:10, justifyContent:'center'}}>
																	<Button
																		onPress={this.showRegisterForm}
																		style={this.state.login ? [Styles.segmentedControl, Styles.segmentedControlActive, Styles.segmentedControlLeft] : Styles.segmentedControl}
																		textStyle={this.state.login ? [Styles.segmentedControlText,Styles.segmentedControlTextActive] : Styles.segmentedControlText}
																	>
																		Register
																	</Button>
																	<Button
																		onPress={this.showLoginForm}
																		style={!this.state.login ? [Styles.segmentedControl, Styles.segmentedControlActive, Styles.segmentedControlRight, {alignSelf: 'auto'}] : [Styles.segmentedControl,{alignSelf: 'auto'}]}
																		textStyle={!this.state.login ? [Styles.segmentedControlText,Styles.segmentedControlTextActive] : Styles.segmentedControlText}
																	>
																		Login
																	</Button>
																</Row>
																{!this.state.login ? this.renderRegisterForm(error, settings) : this.renderLoginForm(error)}
															</FormGroup>

														) : (
															<FormGroup>
																{this.renderAccountForm(user, error, settings)}
																<Button onPress={this.logout}>Logout</Button>
															</FormGroup>
														)}
														{this.state.captcha && (
															<Captcha onClose={()=>this.setState({captcha:null})} onSuccess={this.state.captcha}/>
														)}
													</View>
												</KeyboardAwareScrollView>
											)}
										</Flex>
									)
								}}
							</SettingsProvider>
						)}
					</SubscriptionProvider>
				)}
			</AccountProvider>
		)
	}
}

AccountPage.propTypes = {};

module.exports = AccountPage;
