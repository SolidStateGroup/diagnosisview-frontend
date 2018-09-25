/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';
import data from '../../common-mobile/stores/base/_data';
import FavouriteComplexity from '../components/FavouriteComplexity';

const DiagnosisDetailPage = class extends Component {
	static navigatorStyle = global.navbarStyle;

	constructor(props, context) {
		super(props, context);
		this.state = {
			isLoading: true
		};
		ES6Component(this);
		routeHelper.handleNavEvent(props.navigator, 'diagnosis-detail', this.onNavigatorEvent);
	}

	componentDidMount() {
		this.listenTo(AccountStore, 'change', () => this.forceUpdate());

		this.setState({isLoading: true});
			data.get(Project.api + 'code/' + this.props.code)
				.then(res => {
					console.log(res);
					this.setState({
						description: res.fullDescription,
						links: res.links,
						name: res.description,
						isLoading: false
					})
				})
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
				<NetworkBar />
				<View style={Styles.padded}>
					<View style={[Styles.stacked,{paddingLeft:10, paddingRight:10}]}>
						<H2>{this.props.name}</H2>
						{isLoading ? <Loader /> : <Text style={[Styles.paragraphStrong]}>{description}</Text>}
					</View>
					<Text style={[Styles.subHeading,{paddingLeft:10, paddingRight:10}]}>Learn More...</Text>
					<View style={Styles.whitePanel}>
						{isLoading ? <Loader /> : (
							<FavouritesProvider>
								{({favourites}) => {
									return _.map(links, link => {
										if (!AccountStore.isSubscribed() && link.difficultyLevel != "GREEN" && !link.freeLink) {
											return null;
										}
										const isFavourite = _.find(favourites, f => f.code === this.props.code && f.link.id === link.id);
										return (
											<ListItem onPress={() => routeHelper.openWebModal(link.link, name)} key={link.id}>
												<Row>
												<FavouriteComplexity navigator={this.props.navigator} difficultyLevel={link.difficultyLevel} />
													<Column>
														{Constants.linkIcons[link.linkType.value] ?
															<Image source={Constants.linkIcons[link.linkType.value]} style={Styles.listItemImage} /> :
															<Text>{link.name}</Text>
														}
													</Column>
												</Row>
												<ION onPress={() => this.onFavourite(isFavourite, link)} name="ios-star" style={[Styles.listIconNav, isFavourite ? {color: '#ffd700'} : {}]}/>
											</ListItem>
										);
									})
								}}
							</FavouritesProvider>
						)}
					</View>
				</View>
      </Flex>
		)
	}
}

DiagnosisDetailPage.propTypes = {};


module.exports = DiagnosisDetailPage;
