/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';

const DIAGNOSIS_CELL_FLEX = 4;
const DATE_SEARCHED_CELL_FLEX = 2;

const HistoryPage = class extends Component {
	static navigatorStyle = global.navbarStyle;

	constructor(props, context) {
		super(props, context);
		this.state = {};
		ES6Component(this);
		routeHelper.handleNavEvent(props.navigator, 'history', this.onNavigatorEvent);
	}

	componentDidMount() {
		this.listenTo(AccountStore, 'change', () => this.forceUpdate());
	}

	onNavigatorEvent = (event) => {
		if (event.id == routeHelper.navEvents.SHOW) {
			API.trackPage('History Screen');
		} else if (event.type == 'NavBarButtonPress') {
			if (event.id == 'menu') {
				this.props.navigator.toggleDrawer({ side: 'left' });
			} else if (event.id == 'search') {
				routeHelper.goSearch(this.props.navigator);
			}
		}
	};

	subscribe = () => {
		API.trackEvent(Constants.events.HISTORY_SUBSCRIBE);
		if (AccountStore.getUser()) {
			API.subscribe();
		} else {
			routeHelper.goRegister(this.props.navigator);
		}
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
								{!user || !user.activeSubscription ? (
									<View style={[Styles.whitePanel, Styles.stacked, Styles.padded]}>
										<Text style={[Styles.textCenter, Styles.paragraph]}>Displays search history on this device from the last 20 searches only.</Text>
										<Text style={[Styles.textCenter, Styles.paragraph]}>To activate access to unlimited search history across all your devices, please {user && user.paymentData && user.paymentData.length ? 'renew' : 'subscribe'}.</Text>
										<Button onPress={this.subscribe}>{(user && user.paymentData && user.paymentData.length ? 'Renew' : 'Subscribe') + ' now'}</Button>
									</View>
								) : null}
								{user && user.activeSubscription ? (
									<View style={[Styles.whitePanel, Styles.stacked, Styles.padded]}>
										<Text style={[Styles.textCenter]}>Your full history list across all your signed-in devices.</Text>
									</View>
								) : null}
								<View style={[Styles.whitePanel,Styles.noPadding]}>
									<ListItem>
										<Text style={[Styles.listHeading,Styles.semiBold, {flex: DIAGNOSIS_CELL_FLEX}]}>Diagnosis</Text>
										<Column style={{flex: DATE_SEARCHED_CELL_FLEX}}>
											<Text style={[Styles.listHeading,Styles.semiBold]}>Date Searched</Text>
										</Column>
										<ION name="ios-arrow-forward" style={[Styles.listIconNav, {opacity: 0}]}/>
									</ListItem>
									<HistoryProvider>
										{({history, isLoading})=> isLoading ? <Loader/> : (
											<FlatList
												data={_.reverse(_.sortBy(history, 'date'))}
												renderItem={({item: entry, index: i}) => {
													const diagnosis = _.find(DiagnosisStore.getCodes(), {code: entry.item.code});
													const tags = diagnosis && diagnosis.tags;
													return (
														<ListItem 
															key={i} noAnim onPress={() => routeHelper.goDiagnosisDetail(this.props.navigator, entry.item.code, entry.item.friendlyName)}>
																<Row style={{flex: DIAGNOSIS_CELL_FLEX}}>
																	<Text numberOfLines={1} style={Styles.textSmall}>{entry.item.friendlyName}</Text>
																	{_.map(tags, ({id, code, description}) => (
																		<View key={id} style={[Styles.tag, { backgroundColor: Constants.tagColours[code] || pallette.primary }]}>
																			<Text style={[Styles.tagText]}>{description}</Text>
																		</View>
																	))}
																</Row>
																<Column style={{flex: DATE_SEARCHED_CELL_FLEX}}>
																	<Text style={[Styles.textSmall]}>{moment(entry.date).format('DD MMMM YYYY')}</Text>
																	<Text style={[Styles.textSmall]}>{moment(entry.date).format('HH:mm')}</Text>
																</Column>
																<ION name="ios-arrow-forward" style={[Styles.listIconNav]}/>
														</ListItem>
													)
												}}
											/>
										) }
									</HistoryProvider>
								</View>
							</View>
						</ScrollView>
					</Flex>
				)}
			</AccountProvider>
		)
	}
}

HistoryPage.propTypes = {};


module.exports = HistoryPage;
