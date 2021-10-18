import React from 'react';
import { Component } from 'react';
import SubscriptionStatus from "../SubscriptionStatus";
import SearchInput from "../SearchInput";
import ResultFavouriteLink from "../ResultFavouriteLink";
import PagedList from "../PagedList";
import AccountStore from "../../../common/stores/account-store";

const MAX_RECENT = 9999;
const MAX_RECENT_UNSUBSCRIBED = 5;

class TheComponent extends Component {

    constructor() {
        super();

        this.state ={
            favourites: null
        }
    }

    componentDidMount() {
        AppActions.getCodes()
    }

    filter =(link)=>{
        if(!this.state.search) return true
        if (!AccountStore.hasActiveSubscription() && link.difficultyLevel != "GREEN" && !link.freeLink) {
            return false;
        }
        return link.name.toLowerCase().startsWith(this.state.search.toLowerCase())
    }

    render() {
        return (
            <AccountProvider ref={c => this.accountProvider = c} onLogin={this.onLogin} onLogout={this.onLogout} onSave={()=>{
                this.setState({updatedProfile:true})
            }}>
                {({user, isLoading, isSaving, error})=>(
                    <div className="container-fluid">

                        <CodesProvider>
                            {({ isLoading, categories }) => {
                                return (
                                    <div>
                                        <h4 className="mb-4">Favourites</h4>
                                        <div className="row">
                                            <div className="col-xl-8 mb-lg-4 col-lg-12">
                                                <div className="row mb-4">
                                                    <div className="col-lg-6 col-md-12">
                                                        <SearchInput
                                                            value={this.state.search}
                                                            className="input-container--search--dark"
                                                            placeholder={"Search Favourites"}
                                                            onChange={(e)=>this.setState({page:0, search: Utils.safeParseEventValue(e)})}
                                                        />
                                                    </div>
                                                </div>
                                                <FavouritesProvider>
                                                    {({ favourites:_favourites, isLoading }) => {
                                                        if (!this.state.favourites && _favourites) {
                                                            this.state.favourites = _.cloneDeep(_favourites);
                                                        }
                                                        const favourites = this.state.favourites;

                                                        const results = _.take(_.reverse(_.sortBy(favourites, 'date')), AccountStore.hasActiveSubscription()?MAX_RECENT:MAX_RECENT_UNSUBSCRIBED).filter(this.filter);
                                                        return !!favourites && (
                                                            <div>
                                                                <PagedList
                                                                    page={this.state.page}
                                                                    onPageChange={(page)=>this.setState({page})}
                                                                data={results}
                                                                containerClassName="panel--white panel--no-pad-bottom panel--outline mt-2 mb-4"
                                                                header={(
                                                                    <div className="panel--outline__header">
                                                                        <Row>
                                                                            <Flex>
                                                                                <Row className="ml-1">
                                                                                    <span className="fa fa-star"/>
                                                                                    <strong className="ml-3">
                                                                                        Favourites
                                                                                    </strong>
                                                                                </Row>
                                                                            </Flex>
                                                                            <Row>
                                                                                <span className="fa fa-calendar"/>
                                                                                <strong className="ml-3">
                                                                                    Date Added
                                                                                </strong>
                                                                            </Row>
                                                                            <div style={{width:160}}/>
                                                                        </Row>
                                                                    </div>
                                                                )}
                                                                renderItem={(res)=>{
                                                                    const { link, entry, name } = res;
                                                                    return <ResultFavouriteLink date={res.date} className={"mx-2 mb-3"} code={res.code} name={name} link={link}/>
                                                                }}
                                                                >

                                                                </PagedList>
                                                                {!!results && results.length === 0  && <div className="text-center mb-3">No results{!!this.state.search && <span> found for "<strong>{this.state.search}</strong>"</span>}</div>}
                                                            </div>
                                                        )
                                                    }}
                                                </FavouritesProvider>
                                            </div>
                                            <div className="col-xl-4 col-lg-12">
                                                <SubscriptionStatus/>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }}
                        </CodesProvider>


                    </div>
                )}
            </AccountProvider>
        )}
}

export default TheComponent
