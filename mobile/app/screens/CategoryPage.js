/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, {Component, PropTypes} from 'react';

import Tag from '../components/Tag';

const CategoryHeader = (props) => (
	<ListItem style={Styles.listShort}>
		<View>
			<Row><Text style={[Styles.listHeading,Styles.semiBold]}>DIAGNOSIS RESULTS FOR CATEGORY: </Text><Text style={[Styles.searchResult, Styles.bold]}>{props.category.friendlyDescription}</Text></Row>
		</View>
	</ListItem>
)

const CategoryPage = class extends Component {
	static navigatorStyle = global.navbarStyle;

	constructor(props, context) {
		super(props, context);
		this.state = {};
		ES6Component(this);
		routeHelper.handleNavEvent(props.navigator, 'category-search', this.onNavigatorEvent);
	}

	componentDidMount() {
		this.listenTo(AccountStore, 'change', () => this.forceUpdate());
	}

	onNavigatorEvent = (event) => {
		if (event.id == routeHelper.navEvents.SHOW) {
			API.trackPage('Category Screen');
		} else if (event.id === 'bottomTabReselected') {
			this.props.navigator.popToRoot();
		}
	};

	onDiagnosisSelected = (diagnosis) => {
		AppActions.addToHistory(diagnosis);
		routeHelper.goDiagnosisDetail(this.props.navigator, diagnosis.code, diagnosis.friendlyName);
	}

	renderRow = ({item}) => {
		return (
			<ListItem
				onPress={() => this.onDiagnosisSelected(item)}>
				<Row style={Styles.flex}>
					<Text numberOfLines={1}>{item.friendlyName}</Text>
					{_.map(item.tags, tag => (
						<Tag key={tag.id} navigator={this.props.navigator} tag={tag} />
					))}
				</Row>
				<ION name="ios-arrow-forward" style={[Styles.listIconNav]}/>
			</ListItem>
		)
	};

	render() {
		const {category} = this.props;
		return (
			<Flex>
				<NetworkBar />
				<ScrollView style={{flex: 1, backgroundColor:pallette.backgroundBase}}>
					<View style={[Styles.padded]}>
						<View>
							<Row style={{margin:10}}>
								<Text style={Styles.textSmall}>Select a diagnosis to read more.</Text>
							</Row>
						</View>

						<View style={[Styles.whitePanel, Styles.stacked]}>
							<FlatList
									keyExtractor={(i)=>i.code}
									data={DiagnosisStore.filterByCategory(category)}
									renderItem={this.renderRow}
									ListHeaderComponent={<CategoryHeader category={category} />}
									ListEmptyComponent={<ListItem><Text>No results found</Text></ListItem>}
							/>
						</View>

					</View>
				</ScrollView>
			</Flex>
		)
	}
}

CategoryPage.propTypes = {};

module.exports = CategoryPage;
