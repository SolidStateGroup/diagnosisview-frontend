import React from 'react';
import { Component } from 'react';
import data from "../../../common/stores/base/_data";
import Tag from "../Tag";
import ListItem from "../ListItem";
import SearchInput from "../SearchInput";
import SearchEmpty from "../SearchEmpty";
import WhoFor from "../WhoFor";
import ResultListItem from "../ResultListItem";
import PanelHeader from "../PanelHeader";
import CategoryListItem from "../CategoryListItem";

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

        return <div className="container-fluid">
            <h3 className="mb-4">Find a Diagnosis</h3>
            <div className="row">
                <div className="col-xl-8 col-lg-12">
                    <div className="row mb-4">
                        <div className="col-lg-6 col-md-12">
                            <SearchInput
                                className="input-container--search--dark"
                                placeholder={"Search diagnosis by name"}
                                onChange={(e)=>this.search(Utils.safeParseEventValue(e))}
                            />
                        </div>
                    </div>

                    <div className="panel--white mb-4">
                        {this.state.search.length >= 3 ? (
                            <div>
                                {searchResults && !!searchResults.length ? (
                                    <div>
                                        <PanelHeader className="mb-2" icon="fa fa-diagnoses">Select a diagnosis to read more</PanelHeader>
                                        {
                                            searchResults.map((item)=>(
                                                <ResultListItem result={item} key={item.code}/>
                                            ))
                                        }
                                    </div>
                                ): <div>No Results</div>}
                                {fuzzySearchResults && !!fuzzySearchResults.length ? (
                                    <div>
                                        <PanelHeader className="my-2" icon="fa fa-question-circle">Did you mean?</PanelHeader>
                                        {
                                            fuzzySearchResults.map((item)=>(
                                                <ResultListItem result={item} key={item.code}/>
                                            ))
                                        }
                                    </div>
                                ) : fuzzySearchLoading && (
                                    <div className="my-2 text-center">
                                        <Loader/>
                                    </div>
                                )}
                            </div>
                        ): (
                            <SearchEmpty/>
                        )}
                    </div>
                </div>
                <div className="col-xl-4 col-lg-12">
                    <PanelHeader className="mb-2" icon="fa fa-search">
                        Search by category
                    </PanelHeader>
                    <div className="panel--white">
                        <CodesProvider>
                            {({ isLoading, categories }) => isLoading ? <Loader /> : (
<div> {
    categories && categories.map((v)=>(
        <CategoryListItem result={v} />
    ))
}</div>

) }</CodesProvider>
                    </div>
                </div>
            </div>


        </div>;
    }
}

export default TheComponent
