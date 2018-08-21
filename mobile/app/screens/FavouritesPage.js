/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import FavouriteComplexity from '../components/FavouriteComplexity';

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
			API.subscribe();
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
					<Flex>
						<NetworkBar />
						<ScrollView>
							<View style={Styles.hero}></View>
							<View style={Styles.padded}>
								{!user || !user.subscribed ? (
									<View style={[Styles.whitePanel, Styles.stacked, Styles.padded]}>
										<Text style={[Styles.textCenter, Styles.paragraph]}>Saves up to 5 favourite links on this device only.</Text>
										<Text style={[Styles.textCenter, Styles.paragraph]}>To activate access to unlimited favourites across all your devices, please {user && user.paymentData && user.paymentData.length ? 'renew' : 'subscribe'}.</Text>
										<Button onPress={this.subscribe}>{(user && user.paymentData && user.paymentData.length ? 'Renew' : 'Subscribe') + ' now'}</Button>
									</View>
								) : null}
								{user && user.subscribed ? (
									<View style={[Styles.whitePanel, Styles.stacked, Styles.padded]}>
										<Text style={[Styles.textCenter]}>Your full favourites list across all your signed-in devices.</Text>
									</View>
								) : null}
								<View style={[Styles.whitePanel,Styles.noPadding]}>
									<ListItem>
										<ION name="ios-star" style={[Styles.listIconNav, Styles.listIconNavMarginRight, {opacity: 0}]} />
										<ION name="ios-information-circle-outline" style={[Styles.listIconNav, Styles.iconLow, {opacity: 0}]}/>
										<Column style={{flex: DIAGNOSIS_CELL_FLEX}}>
											<Text style={[Styles.listHeading,Styles.semiBold]}>Diagnosis</Text>
										</Column>
										<Column style={{flex: DATE_ADDED_FLEX}}>
											<Text style={[Styles.listHeading,Styles.semiBold]}>Date Added</Text>
										</Column>
										<ION name="ios-arrow-forward" style={[Styles.listIconNav, {opacity: 0}]}/>
									</ListItem>
									<FavouritesProvider>
										{({favourites, isLoading})=>{
											return _.map(_.reverse(_.sortBy(favourites, 'date')), (entry, i) => {
												if (Constants.simulate.ALL_FAVES_REMOVED_EXTERNALLY) {
													entry.link.removedExternally = true;
												}
												const removedExternally = entry.link.removedExternally;
												return (
													<ListItem key={i} onPress={() => this.onFavourite(entry.link.link, entry.name)}>
														<ION onPress={() => this.removeFavourite(entry.code, entry.link)} name="ios-star" style={[Styles.listIconNav, Styles.listIconNavMarginRight, {color: '#ffd700'}]} />
														<FavouriteComplexity navigator={this.props.navigator} difficultyLevel={entry.link.difficultyLevel} />
														<Column style={{flex: DIAGNOSIS_CELL_FLEX}}>
															<Text style={[Styles.textSmall]}>{entry.name}</Text>
															{Constants.linkIcons[entry.link.linkType.value] ?
																<Image source={Constants.linkIcons[entry.link.linkType.value]} style={Styles.listItemImage} /> :
																<Text style={[Styles.textSmall]}>{entry.link.name}</Text>
															}
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
								</View>
							</View>
						</ScrollView>
					</Flex>
				)}
			</AccountProvider>
		)
	}
}

FavouritesPage.propTypes = {};

module.exports = FavouritesPage;
