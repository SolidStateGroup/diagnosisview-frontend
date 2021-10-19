import React from 'react';
import { Component } from 'react';
import SubscriptionStatus from "../SubscriptionStatus";
import PanelHeader from "../PanelHeader";
import ResultLink from "../ResultLink";
import ResultListItem from "../ResultListItem";
import ResultHistoryLink from "../ResultHistoryLink";

const MAX_RECENT = 5;

class TheComponent extends Component {

    constructor() {
        super();

        this.state ={

        }
    }

    componentDidMount() {
        AppActions.getCodes()
        AppActions.getHistory()
        AppActions.getFavourites()
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
                                        <h4 className="mb-4">User Dashboard</h4>
                                        <div className="row">
                                            <div className="col-xl-8 mb-lg-4 col-lg-12">
                                                <div>
                                                      <div>
                                                          <PanelHeader viewMoreLink={"/dashboard/history"} icon="fa fa-search">
                                                              Recent Searches
                                                          </PanelHeader>
                                                          <div className="panel--white mt-2 mb-4">
                                                              {DiagnosisStore.getCodes() && (
                                                                  <HistoryProvider>
                                                                      {({ history, isLoading }) => {

                                                                          return (
                                                                              <div>
                                                                                  {_.map(_.take(_.reverse(_.sortBy(history, 'date')), MAX_RECENT), (entry, i) => {
                                                                                      const diagnosis = _.find(DiagnosisStore.getCodes(), { code: entry.item.code });
                                                                                      if (!diagnosis) return  null
                                                                                      return (
                                                                                          <ResultListItem result={diagnosis} key={diagnosis.code}/>
                                                                                      )
                                                                                  })}
                                                                              </div>
                                                                          )
                                                                      }}
                                                                  </HistoryProvider>
                                                              )}

                                                          </div>
                                                      </div>
                                                </div>


                                                <FavouritesProvider>
                                                    {({ favourites, isLoading }) => {
                                                        const results = _.take(_.reverse(_.sortBy(favourites, 'date')), MAX_RECENT);
                                                        if (!favourites && isLoading) {
                                                            return <div className="text-center">
                                                                <Loader/>
                                                            </div>
                                                        }
                                                        return !!favourites && !!favourites.length && (
                                                        <div>
                                                            <PanelHeader viewMoreLink={"/dashboard/favourites"} icon="fa fa-search">
                                                                Recent Favourites
                                                            </PanelHeader>
                                                            <div className="panel--white mt-2 mb-4">
                                                                {_.map(results,(res, i) => {
                                                                    const { link, entry, name } = res;
                                                                    const isLast = results.length-1 === i
                                                                    return <ResultHistoryLink className={"mx-2 " + (!isLast && "mb-3")} code={entry} name={name} link={link}/>
                                                                })}
                                                            </div>
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
