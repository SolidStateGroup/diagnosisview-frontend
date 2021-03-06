/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, { Component, PropTypes } from 'react';
import FavouriteComplexity from '../components/FavouriteComplexity';
import PaywallLink from '../components/PaywallLink';
import Tag from '../components/Tag';

const MAX_RECENT = 3;

const DashboardPage = class extends Component {
	static navigatorStyle = Object.assign({}, global.navbarStyle, {
		navBarCustomView: 'logoheader'
	});

	constructor(props, context) {
		super(props, context);
		this.state = {
			appState: AppState.currentState
		};
		ES6Component(this);
		routeHelper.handleNavEvent(props.navigator, 'dashboard', this.onNavigatorEvent);
	}

	componentDidMount() {
		this.listenTo(AccountStore, 'change', () => this.forceUpdate());
		RNIap.prepare()
			.then(() => RNIap.getSubscriptions(iapItemSkus))
			.then(subscriptions => {
				console.log('subscriptions', subscriptions);
			})
			.then(() => RNIap.getAvailablePurchases())
			.then(purchases => {
				console.log('available purchases', purchases);
			});

		this.refreshApp();

		AppState.addEventListener('change', this.handleAppStateChange);
	}

	componentWillUnmount() {
		RNIap.endConnection();

		AppState.removeEventListener('change', this.handleAppStateChange);
	}

	refreshApp = () => {
		AppActions.getSettings();
		if (AccountStore.getUser()) {
			AppActions.getAccount(this.props.retrySubscription);
		} else {
			AppActions.getCodes();
			AppActions.getCodeCategories();
			AppActions.getLinkLogos();
		}
	}

	handleAppStateChange = (nextState) => {
		if (this.state.appState.match(/inactive|background/) && nextState === 'active') {
			this.refreshApp();
		}
		this.setState({appState: nextState});
	}

	onNavigatorEvent = (event) => {
		if (event.id == routeHelper.navEvents.SHOW) {
			API.trackPage('Dashboard Screen');
			AsyncStorage.getItem("welcomeShown", (err, res) => {
				if (!err && (!res || Constants.simulate.SHOW_WELCOME)) {
					routeHelper.showWelcome(this.props.navigator);
					AsyncStorage.setItem("welcomeShown", "true");
				}
			})
		} else if (event.type == 'NavBarButtonPress') {
			if (event.id == 'menu') {
				this.props.navigator.toggleDrawer({ side: 'left' });
			} else if (event.id == 'search') {
				routeHelper.goSearch(this.props.navigator);
			}
		} else if (event.type == 'DeepLink') {
			switch (event.link) {
				case 'search':
					this.props.navigator.popToRoot();
					this.props.navigator.push({
						screen: '/search',
						title: 'Search',
						navigatorStyle: global.navbarStyle,
						passProps: {}
					});
					break;
				case 'dashboard':
					this.props.navigator.popToRoot();
					break;
				default:
					break;
			}

		}
	};

	onRecentSearch = (code, name) => {
		API.trackEvent(Constants.events.RECENT_SEARCH_PRESSED);
		routeHelper.goDiagnosisDetail(this.props.navigator, code, name);
	}

	onFavourite = (link, name) => {
		API.trackEvent(Constants.events.RECENT_FAV_PRESSED);
		routeHelper.openWebModal(link, name);
	}

	subscribe = () => {
		API.trackEvent(Constants.events.DASHBOARD_SUBSCRIBE);
		if (AccountStore.getUser()) {
			API.subscribe();
		} else {
			routeHelper.goRegister(this.props.navigator);
		}
	}

	onSearch = () => {
		routeHelper.goSearch(this.props.navigator)
	}

	onLoggedIn = () => {
		routeHelper.goAccount(this.props.navigator)
	}

	goHistory = () => {
		routeHelper.goHistory(this.props.navigator)
	}

	goFavourites = () => {
		routeHelper.goFavourites(this.props.navigator)
	}

	goToDiagnosis = (code, name) => {
		routeHelper.goDiagnosisDetail(this.props.navigator, code, name);
	}

	renderSubscribeParagraph = () => (
		<Text style={[Styles.textCenter,Styles.textMedium, Styles.paragraph]}>{`Subscribe to see additional professional resources on all topics (demos here to `}
			<Text onPress={() => this.goToDiagnosis('acne', 'Acne')} style={[Styles.textMedium, Styles.hyperlink]}>Acne, </Text>
			<Text onPress={() => this.goToDiagnosis('cystic-fibrosis', 'Cystic fibrosis')} style={[Styles.textMedium, Styles.hyperlink]}>Cystic fibrosis, </Text>
			<Text onPress={() => this.goToDiagnosis('heart-failure', 'Heart failure')} style={[Styles.textMedium, Styles.hyperlink]}>Heart failure</Text>
			{`). A subscription also gives unlimited history/favourites synchronised between devices.`}
		</Text>
	)

	render() {
		return (
			<AccountProvider onLogin={this.onLogin}>
				{({ user, isLoading }) => {
					const paymentData = user && user.paymentData && user.paymentData.length && JSON.parse(_.last(user.paymentData).response);
					const neverSubscribed = !user || (!user.activeSubscription && (!user.paymentData || !user.paymentData.length));
					return (
						<SettingsProvider>
						{({settings, isLoading: settingsIsLoading, error: settingsError}) => {
							let institution = settings && user && user.institution && _.find(settings.institutions, i => i.id === user.institution);
							if (institution && (institution.id === 'OTHER' || institution.id === 'NONE')) {
								institution = null;
							}
							return (
								<Flex>
									<NetworkBar />
									<ScrollView>
										<View style={Styles.hero}></View>
										<View style={Styles.padded}>
											<View style={[Styles.whitePanel, Styles.stacked, Styles.padded]}>
												<Row>
													{institution && institution.logoUrl && <Image source={{uri: institution.logoUrl.indexOf('/api/') !== -1 ? Project.api + institution.logoUrl.substr(5) : institution.logoUrl}} style={Styles.dashboardInstitutionLogo} />}
													<Flex><Text style={[Styles.textMedium, neverSubscribed ? Styles.paragraph : {}, (institution && institution.logoUrl) ? {} : Styles.textCenter]}>Trusted and graded information links on 1,000+ diagnoses. <Text onPress={this.onSearch} style={[Styles.textMedium, Styles.hyperlink]}>Search Now</Text> or go to your History or Favourites. {user ? (<Text onPress={this.onLoggedIn} style={[Styles.textMedium,Styles.hyperlink, {padding:0, margin:0}]}>You are {user.activeSubscription ? 'subscribed' : 'logged in'}{institution ? ` and affiliated to the ${institution.name}` : ''}</Text>) : null}</Text></Flex>
												</Row>
												{neverSubscribed ? (
													<View>
														{this.renderSubscribeParagraph()}
														<Button onPress={this.subscribe}>Subscribe now</Button>
													</View>
												) : null}
												{/* <View style={[Styles.stackedFormInv]}>
													<Button onPress={this.onSearch}>Search now</Button>
												</View> */}
											</View>
											{user && user.expiryDate && !user.autoRenewing ? (() => {
												const expiryDate = moment(user.expiryDate);
												if (expiryDate.isBefore(moment().add(1, 'month')) && expiryDate.isAfter(moment())) {
													return (
														<View style={[Styles.whitePanel, Styles.stacked, Styles.padded]}>
															<Text style={[Styles.textCenter, Styles.paragraph]}>Your account will expire {moment().isSame(expiryDate, 'd') ? 'today at ' + expiryDate.format('HH:mm') : 'on ' + expiryDate.format('DD-MM-YYYY')}</Text>
															<Button onPress={this.subscribe}>Renew now</Button>
														</View>
													)
												} else if (expiryDate.isSameOrBefore(moment()) && !user.activeSubscription) {
													return (
														<View style={[Styles.whitePanel, Styles.stacked, Styles.padded]}>
															<Text style={[Styles.textCenter, Styles.textMedium, Styles.paragraph]}>Your account has expired. {this.renderSubscribeParagraph()}</Text>
															<Button onPress={this.subscribe}>Renew now</Button>
														</View>
													);
												} else {
													return null;
												}
											})() : null}
											<View style={[Styles.whitePanel, Styles.noPadding]}>
												<ListItem>
													<Text style={[Styles.listHeading, Styles.semiBold, {backgroundColor:'transparent', paddingTop:4}]}>RECENT SEARCHES</Text>
													<Text style={[Styles.textSmall, {backgroundColor:'transparent', paddingTop:4}]} onPress={this.goHistory}>More <ION name="ios-arrow-forward" /></Text>
												</ListItem>
												<HistoryProvider>
													{({ history, isLoading }) => (
														<View>
															{_.map(_.take(_.reverse(_.sortBy(history, 'date')), MAX_RECENT), (entry, i) => {
																const diagnosis = _.find(DiagnosisStore.getCodes(), {code: entry.item.code});
																const tags = diagnosis && diagnosis.tags;
																return (
																	<ListItem key={i} onPress={() => this.onRecentSearch(entry.item.code, entry.item.friendlyName)}>
																		<Row style={Styles.flex}>
																			<Text numberOfLines={1}>{entry.item.friendlyName}</Text>
																			{_.map(tags, tag => (
																				<Tag key={tag.id} navigator={this.props.navigator} tag={tag} />
																			))}
																		</Row>
																		<ION name="ios-search" style={[Styles.listIconNav, Styles.ml5]} />
																	</ListItem>
																)
															})}
														</View>
													)}
												</HistoryProvider>
												<ListItem>
													<Text style={[Styles.listHeading, Styles.semiBold, {backgroundColor:'transparent', paddingTop:4}]}>RECENT FAVOURITES</Text>
													<Text style={[Styles.textSmall, {backgroundColor:'transparent', paddingTop:4}]} onPress={this.goFavourites}>More <ION name="ios-arrow-forward" /></Text>
												</ListItem>
												<LinkLogoProvider>
													{({ linkLogos, isLoading }) => (
														<FavouritesProvider>
															{({ favourites, isLoading }) => (
																<View>
																	{_.map(_.take(_.reverse(_.sortBy(favourites, 'date')), MAX_RECENT), (entry, i) => {
																		const { link } = entry;
																		const logoImageUrl = Utils.getLinkLogo(linkLogos, link);
																		if (!AccountStore.isSubscribed() && link.difficultyLevel != "GREEN" && !link.freeLink) {
																			return null;
																		}
																		return (
																			<ListItem key={i} onPress={() => this.onFavourite(link.link, entry.name)}>
																				<FavouriteComplexity navigator={this.props.navigator} difficultyLevel={link.difficultyLevel} containerStyle={[Styles.listIconNavMarginRight]} />
																				<Column style={[Styles.noMargin, {flex: 1}]}>
																					<Text>{entry.name}</Text>
																					<Row>
																						{(logoImageUrl || Constants.linkIcons[link.linkType.value]) ? (
																								<>
																									<Image source={logoImageUrl ? {uri: logoImageUrl} : Constants.linkIcons[link.linkType.value]} style={Styles.listItemImage} />
																									{(!logoImageUrl && link.linkType.value === 'CUSTOM') ? <Flex><Text numberOfLines={1} ellipsisMode="tail" style={Styles.textSmall}>{link.name}</Text></Flex> : null}
																								</>
																							) : <Text style={Styles.textSmall}>{link.name}</Text>
																						}
																						{link.paywalled ? <PaywallLink navigator={this.props.navigator} paywalled={link.paywalled} /> : null}
																					</Row>
																				</Column>
																				<ION name="ios-arrow-forward" style={[Styles.listIconNav]} />
																			</ListItem>
																		)
																	})}
																</View>
															)}
														</FavouritesProvider>
													)}
												</LinkLogoProvider>
											</View>
										</View>
									</ScrollView>
								</Flex>
							)
						}}
						</SettingsProvider>
					);
				}}
			</AccountProvider>
		)
	}
}

DashboardPage.propTypes = {};


module.exports = DashboardPage;
