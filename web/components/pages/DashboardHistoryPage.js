import React from 'react';
import { Component } from 'react';
import SubscriptionStatus from "../SubscriptionStatus";
import SearchInput from "../SearchInput";
import ResultFavouriteLink from "../ResultFavouriteLink";
import PagedList from "../PagedList";
import AccountStore from "../../../common/stores/account-store";
import ResultListItem from "../ResultListItem";

const MAX_RECENT = 9999;
const MAX_RECENT_UNSUBSCRIBED = 20;

class TheComponent extends Component {

    constructor() {
        super();

        this.state ={
            favourites: null
        }
    }

    componentDidMount() {
        AppActions.getCodes()
        AppActions.getHistory()
    }

    filter =(link)=>{
        if(!this.state.search) return !!link

        if (!link) return  false;

        return link.diagnosis.friendlyName.toLowerCase().startsWith(this.state.search.toLowerCase())
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
                                        <h4 className="mb-4">History</h4>
                                        <div className="row">
                                            <div className="col-xl-8 mb-lg-4 col-lg-12">
                                                <div className="row mb-4">
                                                    <div className="col-lg-6 col-md-12">
                                                        <SearchInput
                                                            value={this.state.search}
                                                            className="input-container--search--dark"
                                                            placeholder={"Search History"}
                                                            onChange={(e)=>this.setState({page:0, search: Utils.safeParseEventValue(e)})}
                                                        />
                                                    </div>
                                                </div>
                                                <CodesProvider>
                                                    {({ isLoading, categories }) => (
                                                        <HistoryProvider>
                                                            {({ history, isLoading }) => {

                                                                if (!history && isLoading) {
                                                                    return <div className="text-center"><Loader/></div>
                                                                }
                                                                const results = _.map(_.take(_.reverse(_.sortBy(history, 'date')), AccountStore.hasActiveSubscription()? MAX_RECENT: MAX_RECENT_UNSUBSCRIBED), (entry, i) => {
                                                                    const diagnosis = _.find(DiagnosisStore.getCodes(), { code: entry.item.code });
                                                                    if (!diagnosis) return  null
                                                                    return { diagnosis, date:entry.date };
                                                                }).filter(this.filter)

                                                                return !!history && (
                                                                    <div>
                                                                        <PagedList
                                                                            page={this.state.page}
                                                                            onPageChange={(page) => this.setState({ page })}
                                                                            data={results}
                                                                            containerClassName="panel--white panel--no-pad-bottom panel--outline mt-2 mb-4"
                                                                            header={(
                                                                                <div className="panel--outline__header">
                                                                                    <Row>
                                                                                        <Flex>
                                                                                            <Row className="ml-1">
                                                                                                <span
                                                                                                    className="fa fa-search"
                                                                                                />
                                                                                                <strong
                                                                                                    className="ml-3"
                                                                                                >
                                                                                                    Diagnosis
                                                                                                </strong>
                                                                                            </Row>
                                                                                        </Flex>
                                                                                        <Row>
                                                                                            <span
                                                                                                className="fa fa-calendar"
                                                                                            />
                                                                                            <strong className="ml-3">
                                                                                                Date Searched
                                                                                            </strong>
                                                                                        </Row>
                                                                                        <div style={{ width: 160 }}/>
                                                                                    </Row>
                                                                                </div>
                                                                            )}
                                                                            renderItem={({ diagnosis,date }, i) => {
                                                                                if (!diagnosis) return null
                                                                                return  (
                                                                                    <ResultListItem
                                                                                        date={date}
                                                                                        result={diagnosis}
                                                                                        key={`${i}`}
                                                                                    />
                                                                                )

                                                                            }}
                                                                        >

                                                                        </PagedList>
                                                                        {!!results && results.length === 0 &&
                                                                        <div className="text-center mb-3">No
                                                                            results{!!this.state.search &&
                                                                            <span> found for
                                                                                "<strong>{this.state.search}</strong>"</span>}</div>}
                                                                    </div>
                                                                )
                                                            }}
                                                        </HistoryProvider>
                                                    )}
                                                </CodesProvider>
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
