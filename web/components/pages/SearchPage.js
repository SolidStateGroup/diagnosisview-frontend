import React from 'react';
import { Component } from 'react';
import data from "../../../common/stores/base/_data";
import Tag from "../Tag";
import ListItem from "../ListItem";
const whoIs = [
    "You are a medical student needing trusted information for an exam",
    "You are a practitioner and a patient with a rare diagnosis walks through the door",
    "You are anyone who seeks urgent medical guidance but reads conflicting information on the Internet"
]
class TheComponent extends Component {
    state = {
        search:""
    }
    componentDidMount() {
        AppActions.getCodes();
    }

    search = (terms) => {
        let searchResults = [];
        let fuzzySearchResults = this.state.fuzzySearchResults;
        let fuzzySearchLoading = false;
        if (terms.length >= 3) {
            searchResults = DiagnosisStore.search(terms);
            fuzzySearchLoading = true;
            this.fuzzySearch(terms, searchResults);
        } else {
            fuzzySearchResults = [];
        }
        this.setState({search: terms, searchResults, fuzzySearchResults, fuzzySearchLoading});
    }
    fuzzySearch = _.debounce((terms, searchResults) => {
        data.get(`${Project.api}code/synonyms/${terms}`)
            .then(res => {
                this.setState({fuzzySearchResults: _.differenceBy(res, searchResults, 'code'), fuzzySearchLoading: false});
            })
            .catch(() => {
                this.setState({fuzzySearchLoading: false, fuzzySearchResults: []});
            })
    }, 500);
    render() {
        const { searchResults, fuzzySearchResults, fuzzySearchLoading } = this.state;

        return <div className="container">
            <h3>Find a Diagnosis</h3>
            <div className="row">
                <div className="col-md-7">
                    <Input
                        placeholder={"Search diagnosis by name"}
                        onChange={(e)=>this.search(Utils.safeParseEventValue(e))}
                    />
                    {this.state.search.length >= 3 && (
                        <div className="panel--white">
                            {searchResults && searchResults.length ? (
                                <div>
                                    <div className="panel__header mb-2">
                                        <span className="fa fa-diagnoses mr-1"/> Select a diagnosis to read more
                                    </div>
                                    {
                                        searchResults.map((item)=>(
                                                <ListItem className="list-item--no-hover list-item--no-pad">
                                                    <Link to={"/codes/"+item.code}>
                                                        <Row>
                                                            <div className="mr-2">{item.friendlyName}</div>
                                                            {_.map(item.tags, tag => (
                                                                <Tag key={tag.id} tag={tag} />
                                                            ))}
                                                        </Row>
                                                    </Link>
                                                </ListItem>
                                        ))
                                    }
                                </div>
                            ): <div>No Results</div>}
                    </div>
                     )}
                </div>
                <div className="col-md-5">
                    <div className="panel--white">
                        <div className="panel__header mb-5">
                            <span className="fa fa-diagnoses mr-1"/> Who DiagnosisView is for:
                        </div>
                        <div>
                            {whoIs.map((v)=>(
                                <Row className="no-wrap mb-4 flex-align-start">
                                    <span className="fa mr-3 text-success fa-check-circle"/>
                                    {v}
                                </Row>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


        </div>;
    }
}

export default TheComponent
