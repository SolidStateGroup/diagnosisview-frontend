/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';

const SearchHeader = (props) => (
	<ListItem style={Styles.listShort}>
		<View>
			<Row><Text style={[Styles.listHeading,Styles.semiBold]}>SEARCH RESULTS FOR: </Text><Text style={[Styles.searchResult, Styles.bold]}>{props.search}</Text></Row>
		</View>
	</ListItem>
)

const SearchPage = class extends Component {
	static navigatorStyle = global.navbarStyle;

	constructor(props, context) {
		super(props, context);
		this.state = {
			search: ''
		};
		ES6Component(this);
		routeHelper.handleNavEvent(props.navigator, 'search', this.onNavigatorEvent);
	}

	componentDidMount() {
		this.listenTo(AccountStore, 'change', () => this.forceUpdate());
	}

	onNavigatorEvent = (event) => {
		if (event.id == routeHelper.navEvents.SHOW) {
			API.trackPage('Search Screen');
		} else if (event.id === 'bottomTabReselected') {
			this.props.navigator.popToRoot();
		}
	};

	onSearchResult = (diagnosis) => {
		AppActions.addToHistory(diagnosis);
		routeHelper.goDiagnosisDetail(this.props.navigator, diagnosis.code, diagnosis.friendlyName);
	}

	renderRow = ({item}) => {
			return (
					<ListItem
						onPress={() => this.onSearchResult(item)}>
							<Text style={Styles.listSubText}>{item.friendlyName}</Text>
							<ION name="ios-arrow-forward" style={[Styles.listIconNav]}/>
					</ListItem>
			)
	};

	render() {
		return (
			<Flex>
				<NetworkBar />
				<ScrollView style={{flex: 1, backgroundColor:pallette.backgroundBase}}>
					<View style={[Styles.padded]}>
						<View>
							<ION style={Styles.inputIcon} name="ios-search"/>
							<TextInput placeholder={"Search diagnosis by name"}
													onChangeText={(search)=>this.setState({search})} style={{textIndent:20}} height={40} textStyle={[Styles.inputIndent]}
													autoCorrect={false}/>
							{this.state.search.length >= 3 ? (
								<Row style={{margin:10}}>
									<Text style={Styles.textSmall}>Select a diagnosis to read more.</Text>
								</Row>
							) : null}
						</View>


							<View style={[Styles.whitePanel, Styles.stacked]}>
								{this.state.search.length >= 3 && <FlatList
										keyExtractor={(i)=>i.code}
										data={DiagnosisStore.search(this.state.search)}
										renderItem={this.renderRow}
										ListHeaderComponent={<SearchHeader search={this.state.search} />}
										ListEmptyComponent={<ListItem><Text>No results found</Text></ListItem>}
								/>}
							</View>

					</View>
				</ScrollView>
			</Flex>
		)
	}
}

SearchPage.propTypes = {};

module.exports = SearchPage;
