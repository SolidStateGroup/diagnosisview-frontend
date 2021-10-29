/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import data from '../../../common/stores/base/_data';
import FavouriteComplexity from '../components/FavouriteComplexity';
import PaywallLink from '../components/PaywallLink';

const DiagnosisDetailPage = class extends Component {
	static navigatorStyle = global.navbarStyle;

	constructor(props, context) {
		super(props, context);
		this.state = {
			isLoading: true,
			appState: AppState.currentState
		};
		ES6Component(this);
		routeHelper.handleNavEvent(props.navigator, 'diagnosis-detail', this.onNavigatorEvent);
	}

	componentDidMount() {
		this.listenTo(AccountStore, 'change', () => this.forceUpdate());

		this.setState({isLoading: true});
		this.get();

		AppState.addEventListener('change', this.handleAppStateChange);
	}

	componentWillUnmount() {
		AppState.removeEventListener('change', this.handleAppStateChange);
	}

	handleAppStateChange = (nextState) => {
		if (this.state.appState.match(/inactive|background/) && nextState === 'active') {
			this.get();
		}
		this.setState({appState: nextState});
	}

	get = () => {
		data.get(Project.api + 'code/' + this.props.code)
			.then(res => {
				// console.log(res);
				const links = _.sortBy(res.links, 'displayOrder');
				this.setState({
					description: res.fullDescription,
					links,
					name: res.description,
					isLoading: false
				})
			});
	}

	onNavigatorEvent = (event) => {
		if (event.id == routeHelper.navEvents.SHOW) {
			API.trackPage('Diagnosis Detail Screen');
		} else if (event.type == 'NavBarButtonPress') {
			if (event.id == 'menu') {
				this.props.navigator.toggleDrawer({ side: 'left' });
			} else if (event.id == 'search') {
				routeHelper.goSearch(this.props.navigator);
			}
		} else if (event.id === 'bottomTabReselected') {
			this.props.navigator.popToRoot();
		}
	};

	onFavourite = (isFavourite, link) => {
		if (isFavourite) {
			Alert.alert('Confirm', 'This link will be removed from your favourites. Are you sure?', [
				{text: 'No', style: 'cancel'},
				{text: 'Yes', onPress: () => AppActions.removeFavourite(this.props.code, link)}
			]);
		} else {
			AppActions.setFavourite(this.props.code, this.props.name, link);
		}
	};

	render() {
		const { isLoading, description, links, name } = this.state;
		return (
			<Flex style={Styles.body}>
				<ScrollView>
					<NetworkBar />
					<View style={Styles.padded}>
						<View style={[Styles.stacked,{paddingLeft:10, paddingRight:10}]}>
							<H2>{this.props.name}</H2>
							{isLoading ? <Loader /> : <Text style={[Styles.paragraphStrong]}>{description}</Text>}
						</View>
						<Text style={[Styles.subHeading,{paddingLeft:10, paddingRight:10}]}>Learn More...</Text>
						<View style={Styles.whitePanel}>
							{isLoading ? <Loader /> : (
									<LinkLogoProvider>
										{({ linkLogos, isLoading }) => (
											<FavouritesProvider>
												{({favourites}) => _.map(links, link => {
													const logoImageUrl = Utils.getLinkLogo(linkLogos, link);
													if (!link.displayLink) {
														return null;
													} else if (!AccountStore.hasActiveSubscription() && link.difficultyLevel != "GREEN" && !link.freeLink) {
														return null;
													}
													const isFavourite = _.find(favourites, f => f.code === this.props.code && f.link.id === link.id);
													return (
														<ListItem onPress={() => routeHelper.openWebModal(link.link, name)} key={link.id}>
															<Row>
																<FavouriteComplexity navigator={this.props.navigator} difficultyLevel={link.difficultyLevel} />
																<Flex>
																	<Row>
																		{(logoImageUrl || Constants.linkIcons[link.linkType.value]) ? (
																			<Column>
																				<Image source={logoImageUrl ? {uri: logoImageUrl} : Constants.linkIcons[link.linkType.value]} style={Styles.listItemImage} />
																				{(!logoImageUrl && link.linkType.value === 'CUSTOM') ? <Text numberOfLines={1} ellipsisMode="tail">{link.name}</Text> : null}
																			</Column>
																		) : <Text>{link.name}</Text>
																		}
																		{link.paywalled ? <PaywallLink navigator={this.props.navigator} paywalled={link.paywalled} /> : null}
																	</Row>
																</Flex>
																<ION onPress={() => this.onFavourite(isFavourite, link)} name="ios-star" style={[Styles.listIconNav, isFavourite ? {color: '#ffd700'} : {}]}/>
															</Row>
														</ListItem>
													);
												})
											}
										</FavouritesProvider>
									)}
								</LinkLogoProvider>
							)}
						</View>
					</View>
			</ScrollView>
      </Flex>
		)
	}
}

DiagnosisDetailPage.propTypes = {};


module.exports = DiagnosisDetailPage;
