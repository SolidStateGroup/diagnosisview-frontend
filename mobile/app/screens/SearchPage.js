/**
 * Created by kylejohnson on 28/01/2017.
 */
import React, { Component, PropTypes } from "react";
import data from '../../common-mobile/stores/base/_data';

const SearchHeader = props => (
  <ListItem style={Styles.listShort}>
    <View>
      <Row>
        <Text style={[Styles.listHeading, Styles.semiBold]}>
          SEARCH RESULTS FOR:{" "}
        </Text>
        <Text style={[Styles.searchResult, Styles.bold]}>{props.search}</Text>
      </Row>
    </View>
  </ListItem>
);

const DidYouMeanHeader = props => (
  <ListItem style={Styles.listShort}>
    <View>
      <Row>
        <Text style={[Styles.listHeading, Styles.semiBold]}>
          DID YOU MEAN:{" "}
        </Text>
        <Text style={[Styles.searchResult, Styles.bold]}>{props.search}</Text>
      </Row>
    </View>
  </ListItem>
);

const CategoriesHeader = props => (
  <ListItem style={Styles.listShort}>
    <View>
      <Row>
        <Text style={[Styles.listHeading, Styles.semiBold]}>
          SEARCH DIAGNOSIS BY CATEGORY:{" "}
        </Text>
      </Row>
    </View>
  </ListItem>
);

const SearchPage = class extends Component {
  static navigatorStyle = global.navbarStyle;

  constructor(props, context) {
    super(props, context);
    this.state = {
      search: "",
      categorySearch: "",
      fuzzySearchResults: [],
      searchResults: [],
    };
    ES6Component(this);
    routeHelper.handleNavEvent(
      props.navigator,
      "search",
      this.onNavigatorEvent
    );
  }

  componentDidMount() {
    this.listenTo(AccountStore, "change", () => this.forceUpdate());
  }

  onNavigatorEvent = event => {
    if (event.id == routeHelper.navEvents.SHOW) {
      API.trackPage("Search Screen");
    } else if (event.id === "bottomTabReselected") {
      this.props.navigator.popToRoot();
    }
  };

  onSearchResult = diagnosis => {
    AppActions.addToHistory(diagnosis);
    routeHelper.goDiagnosisDetail(
      this.props.navigator,
      diagnosis.code,
      diagnosis.friendlyName
    );
  };

  onCategorySearchResult = category => {
    this.props.navigator.push({
      screen: "/category",
      title: "Search",
      navigatorStyle: global.navbarStyle,
      passProps: { category }
    });
  };

  search = (terms) => {
    let searchResults = [];
    let fuzzySearchResults = this.state.fuzzySearchResults;
    if (terms.length >= 3) {
      searchResults = DiagnosisStore.search(terms);
      this.fuzzySearch(terms, searchResults);
    } else {
      fuzzySearchResults = [];
    }
    this.setState({search: terms, searchResults, fuzzySearchResults});
  }

  fuzzySearch = _.throttle((terms, searchResults) => {
    data.get(`${Project.api}code/synonyms/${terms}`)
      .then(res => {
        this.setState({fuzzySearchResults: _.differenceBy(res, searchResults, 'code')});
      })
      .catch(e => {
        // todo anything?
      })
  }, 500);

  renderCategoryRow = ({ item }) => {
    return (
      <ListItem onPress={() => this.onCategorySearchResult(item)}>
        <Text style={Styles.listSubText}>{item.friendlyDescription}</Text>
        <ION name="ios-arrow-forward" style={[Styles.listIconNav]} />
      </ListItem>
    );
  };

  renderRow = ({ item }) => {
    return (
      <ListItem onPress={() => this.onSearchResult(item)}>
        <Text style={Styles.listSubText}>{item.friendlyName}</Text>
        <ION name="ios-arrow-forward" style={[Styles.listIconNav]} />
      </ListItem>
    );
  };

  render() {
    const { searchResults, fuzzySearchResults } = this.state;
    return (
      <Flex>
        <NetworkBar />
        <ScrollView
          style={{ flex: 1, backgroundColor: pallette.backgroundBase }}
        >
          <View style={[Styles.padded]}>
            <View>
              <ION style={Styles.inputIcon} name="ios-search" />
              <View>
                <ION style={Styles.inputIcon} name="ios-search" />
                <TextInput
                  placeholder={"Search diagnosis by name"}
                  onChangeText={this.search}
                  style={{ textIndent: 20 }}
                  height={40}
                  textStyle={[Styles.inputIndent]}
                  autoCorrect={false}
                />
              </View>
              {this.state.search.length >= 3 ? (
                <Flex style={{ margin: 10 }}>
                  <Text>Select a diagnosis to read more.</Text>
                </Flex>
              ) : (
                <Flex style={{ margin: 10 }}>
                  <Text style={[Styles.textCenter]}>OR</Text>
                </Flex>
              )}
            </View>

            <View style={[Styles.whitePanel, Styles.stacked]}>
              {this.state.search.length >= 3 ? (
                <FlatList
                  keyExtractor={i => i.code}
                  data={searchResults}
                  renderItem={this.renderRow}
                  ListHeaderComponent={
                    <SearchHeader search={this.state.search} />
                  }
                  ListEmptyComponent={
                    <ListItem>
                      <Text>No results found</Text>
                    </ListItem>
                  }
                />
              ) : (
                <FlatList
                  keyExtractor={i => i.id}
                  data={DiagnosisStore.getCategories()}
                  renderItem={this.renderCategoryRow}
                  ListHeaderComponent={<CategoriesHeader />}
                  ListEmptyComponent={
                    <ListItem>
                      <Text>No results found</Text>
                    </ListItem>
                  }
                />
              )}
            </View>
            {this.state.search.length >= 3 && !!fuzzySearchResults.length && (
              <>
                <Flex style={{ margin: 10, marginTop: 0 }}>
                  <Text>Did you mean?</Text>
                </Flex>
                <View style={[Styles.whitePanel, Styles.stacked]}>
                  <FlatList
                    keyExtractor={i => i.code}
                    data={fuzzySearchResults}
                    renderItem={this.renderRow}
                  />
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </Flex>
    );
  }
};

SearchPage.propTypes = {};

module.exports = SearchPage;
