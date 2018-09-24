/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, { Component, PropTypes } from 'react';
import FavouriteComplexity from '../components/FavouriteComplexity';

const MAX_RECENT = 3;

const DashboardPage = class extends Component {
	static navigatorStyle = Object.assign({}, global.navbarStyle, {
		navBarCustomView: 'logoheader'
	});

	constructor(props, context) {
		super(props, context);
		this.state = {};
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

		AppActions.getAccount(this.props.retrySubscription);
		AppActions.getCodes();
	}

	componentWillUnmount() {
		RNIap.endConnection();
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
		} else if (event.type == 'DeepLink' && event.link == 'search') {
			this.props.navigator.popToRoot();
			this.props.navigator.push({
				screen: '/search',
				title: 'Search',
				navigatorStyle: global.navbarStyle,
				passProps: {}
			})
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

	render() {
		return (
			<AccountProvider onLogin={this.onLogin}>
				{({ user, isLoading }) => {
					const paymentData = user && user.paymentData && user.paymentData.length && JSON.parse(_.last(user.paymentData).response);
					return (
						<Flex>
							<NetworkBar />
							<ScrollView>
								<View style={Styles.hero}></View>
								<View style={Styles.padded}>
									{!user || (!user.activeSubscription && (!user.paymentData || !user.paymentData.length)) ? (
										<View style={[Styles.whitePanel, Styles.stacked, Styles.padded]}>
											<Text style={[Styles.textCenter, Styles.paragraph]}>Support DiagnosisView and subscribe for unlimited history/favourites on all devices</Text>
											<Button onPress={this.subscribe}>Subscribe now</Button>
										</View>
									) : null}
									{user && user.expiryDate && !user.autoRenewing ? (() => {
										const expiryDate = moment(user.expiryDate);
										if (expiryDate.isBefore(moment().add(1, 'month')) && expiryDate.isAfter(moment())) {
											return (
												<View style={[Styles.whitePanel, Styles.stacked, Styles.padded]}>
													<Text style={[Styles.textCenter, Styles.paragraph]}>Your account will expire {moment().isSame(expiryDate, 'd') ? 'today at ' + expiryDate.format('HH:mm') : 'on ' + expiryDate.format('DD-MM-YYYY')}</Text>
													<Button onPress={this.subscribe}>Renew now</Button>
												</View>
											)
										} else if (expiryDate.isSameOrBefore(moment())) {
											return (
												<View style={[Styles.whitePanel, Styles.stacked, Styles.padded]}>
													<Text style={[Styles.textCenter, Styles.paragraph]}>Your account has expired</Text>
													<Button onPress={this.subscribe}>Renew now</Button>
												</View>
											);
										} else {
											return null;
										}
									})() : null}
									<View style={[Styles.whitePanel, Styles.noPadding]}>
										<ListItem>
											<Text style={[Styles.listHeading, Styles.semiBold]}>RECENT SEARCHES</Text>
										</ListItem>
										<HistoryProvider>
											{({ history, isLoading }) => (
												<View>
													{_.map(_.take(_.reverse(_.sortBy(history, 'date')), MAX_RECENT), (entry, i) => (
														<ListItem key={i} onPress={() => this.onRecentSearch(entry.item.code, entry.item.friendlyName)}>
															<Text>{entry.item.friendlyName}</Text>
															<ION name="ios-search" style={[Styles.listIconNav]} />
														</ListItem>
													))}
												</View>
											)}
										</HistoryProvider>
										<ListItem>
											<Text style={[Styles.listHeading, Styles.semiBold]}>RECENT FAVOURITES</Text>
										</ListItem>
										<FavouritesProvider>
											{({ favourites, isLoading }) => (
												<View>
													{_.map(_.take(_.reverse(_.sortBy(favourites, 'date')), MAX_RECENT), (entry, i) => (
														<ListItem key={i} onPress={() => this.onFavourite(entry.link.link, entry.name)}>
															<FavouriteComplexity navigator={this.props.navigator} difficultyLevel={entry.link.difficultyLevel} style={[Styles.listIconNavMarginRight]} />
															<Column style={[Styles.noMargin, {flex: 1}]}>
																<Text>{entry.name}</Text>
																{Constants.linkIcons[entry.link.linkType.value] ?
																	<Image source={Constants.linkIcons[entry.link.linkType.value]} style={Styles.listItemImage} /> :
																	<Text style={[Styles.textSmall]}>{entry.link.name}</Text>
																}
															</Column>
															<ION name="ios-arrow-forward" style={[Styles.listIconNav]} />
														</ListItem>
													))}
												</View>
											)}
										</FavouritesProvider>
									</View>
								</View>
							</ScrollView>
						</Flex>
					);
				}}
			</AccountProvider>
		)
	}
}

DashboardPage.propTypes = {};


module.exports = DashboardPage;
