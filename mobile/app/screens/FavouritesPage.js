/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import FavouriteComplexity from '../components/FavouriteComplexity';
import PaywallLink from '../components/PaywallLink';

const DIAGNOSIS_CELL_FLEX = 4;
const DATE_ADDED_FLEX = 2;

const FavouritesPage = class extends Component {
	static navigatorStyle = global.navbarStyle;

	constructor(props, context) {
		super(props, context);
		this.state = {};
		ES6Component(this);
		routeHelper.handleNavEvent(props.navigator, 'favourites', this.onNavigatorEvent);
	}

	componentDidMount() {
		this.listenTo(AccountStore, 'change', () => this.forceUpdate());
	}

	onNavigatorEvent = (event) => {
		if (event.id == routeHelper.navEvents.SHOW) {
			API.trackPage('Favourites Screen');
		} else if (event.type == 'NavBarButtonPress') {
			if (event.id == 'menu') {
				this.props.navigator.toggleDrawer({ side: 'left' });
			} else if (event.id == 'search') {
				routeHelper.goSearch(this.props.navigator);
			}
		}
	};

	removeFavourite = (code, link) => {
		Alert.alert('Confirm', 'Are you sure you want to remove this link from your favourites?', [
			{text: 'No', style: 'cancel'},
			{text: 'Yes', onPress: () => AppActions.removeFavourite(code, link)}
		]);
	}

	subscribe = () => {
		API.trackEvent(Constants.events.FAVOURITES_SUBSCRIBE);
		if (AccountStore.getUser()) {
			AppActions.buySubscription();
		} else {
			routeHelper.goRegister(this.props.navigator);
		}
	}

	brokenLink = () => {
		routeHelper.showBrokenLink(this.props.navigator);
	}

	onFavourite = (link, name) => {
		routeHelper.openWebModal(link, name);
	}

	render() {
		return (
			<AccountProvider>
				{({user, isLoading})=>(
					<SubscriptionProvider>
						{({subscription, isLoading: subscriptionLoading}) => (
							<Flex>
								<NetworkBar />
								<ScrollView>
									<View style={Styles.hero}></View>
									<View style={Styles.padded}>
										{!AccountStore.hasActiveSubscription() ? (
											<View style={[Styles.whitePanel, Styles.stacked, Styles.padded]}>
												{subscriptionLoading ? <Flex style={Styles.centeredContainer}><Loader /></Flex> : (
													<>
														<Text style={[Styles.textCenter, Styles.paragraph]}>Saves up to 5 favourite links on this device only.</Text>
														<Text style={[Styles.textCenter, Styles.paragraph]}>To activate access to unlimited favourites across all your devices, please {(!user && !subscription) ? 'subscribe' : !subscription ? 'subscribe' : 'register'}.</Text>
														<Button onPress={this.subscribe}>{(!user ? 'Subscribe' : 'Subscribe') + ' now'}</Button>
													</>
												)}
											</View>
										) : null}
										{AccountStore.hasActiveSubscription() ? (
											<View style={[Styles.whitePanel, Styles.stacked, Styles.padded]}>
												<Text style={[Styles.textCenter]}>Your full favourites list across all your signed-in devices.</Text>
											</View>
										) : null}
										<View style={[Styles.whitePanel,Styles.noPadding]}>
											<ListItem>
												<ION name="ios-star" style={[Styles.listIconNav, Styles.listIconNavMarginRight, {opacity: 0}]} />
												<View style={{width: 30, height: 30}} />
												<Column style={{flex: DIAGNOSIS_CELL_FLEX}}>
													<Text style={[Styles.listHeading,Styles.semiBold]}>Diagnosis</Text>
												</Column>
												<Column style={{flex: DATE_ADDED_FLEX}}>
													<Text style={[Styles.listHeading,Styles.semiBold]}>Date Added</Text>
												</Column>
												<ION name="ios-arrow-forward" style={[Styles.listIconNav, {opacity: 0}]}/>
											</ListItem>
											<LinkLogoProvider>
												{({ linkLogos, isLoading }) => (
													<FavouritesProvider>
														{({favourites, isLoading})=>{
															return _.map(_.reverse(_.sortBy(favourites, 'date')), (entry, i) => {
																const { link } = entry;
																const logoImageUrl = Utils.getLinkLogo(linkLogos, link);
																if (!SubscriptionStore.isSubscribed() && link.difficultyLevel != "GREEN" && !link.freeLink) {
																	return null;
																}
																if (Constants.simulate.ALL_FAVES_REMOVED_EXTERNALLY) {
																	link.removedExternally = true;
																}
																const removedExternally = link.removedExternally;
																return (
																	<ListItem key={i} onPress={() => this.onFavourite(link.link, entry.name)}>
																		<ION onPress={() => this.removeFavourite(entry.code, link)} name="ios-star" style={[Styles.listIconNav, Styles.listIconNavMarginRight, {color: '#ffd700'}]} />
																		<FavouriteComplexity navigator={this.props.navigator} difficultyLevel={link.difficultyLevel} />
																		<Column style={{flex: DIAGNOSIS_CELL_FLEX}}>
																			<Text style={[Styles.textSmall]}>{entry.name}</Text>
																			<Row>
																				{(logoImageUrl || Constants.linkIcons[link.linkType.value]) ? (
																					<Column style={[Styles.noMargin, {flex: 1}]}>
																						<Image source={logoImageUrl ? {uri: logoImageUrl} : Constants.linkIcons[link.linkType.value]} style={Styles.listItemImage} />
																						{(!logoImageUrl && link.linkType.value === 'CUSTOM') ? <Flex><Text style={Styles.textSmall} numberOfLines={1} ellipsisMode="tail">{link.name}</Text></Flex> : null}
																					</Column>
																				) : <Text style={[Styles.textSmall]}>{link.name}</Text>
																				}
																				{link.paywalled ? <PaywallLink navigator={this.props.navigator} paywalled={link.paywalled} /> : null}
																			</Row>
																		</Column>
																		<Column style={{flex: DATE_ADDED_FLEX}}>
																			<Text style={[Styles.textSmall]}>{moment(entry.date).format('DD MMM YYYY')}</Text>
																			<Text style={[Styles.textSmall]}>{moment(entry.date).format('HH:mm')}</Text>
																		</Column>
																		{removedExternally ? <ION onPress={this.brokenLink} name="ios-alert" style={[Styles.listIconNav,Styles.listIconNavError]}/> : <ION name="ios-arrow-forward" style={[Styles.listIconNav]}/>}
																	</ListItem>
																)
															});
														}}
													</FavouritesProvider>
												)}
											</LinkLogoProvider>
										</View>
									</View>
								</ScrollView>
							</Flex>
						)}
					</SubscriptionProvider>
				)}
			</AccountProvider>
		)
	}
}

FavouritesPage.propTypes = {};

module.exports = FavouritesPage;
