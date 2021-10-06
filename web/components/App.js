import React, { Component, PropTypes } from 'react';
import Aside from './Aside';
import DashboardAside from './DashboardAside';
import NavHeader from "./NavHeader";
import NavAdmin from './NavAdmin';
import Popover from './base/Popover';
import _data from '../../common/stores/base/_data';
import Navbar from "./Navbar";

export default class App extends Component {

    static propTypes = {
        children: PropTypes.element.isRequired
    };

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            search: '',
        }
    }

    logout = () => {
        openConfirm(<h3>Confirm</h3>, <p>Are you sure you wish to logout?</p>, AppActions.logout);
    }

    componentDidMount() {
        const { pathname } = this.context.router.history.location;
        const user = AccountStore.getUser();
        AppActions.getSettings();
        if (pathname.includes("/admin") && !AccountStore.isAdmin()) {
            this.context.router.history.replace('/');
        }
        if (pathname.includes("/dashboard") && !AccountStore.model) {
            this.context.router.history.replace('/');
        }
        if (user && (pathname == '/' || pathname == '/login' || pathname == '/demo' || pathname == '/signup')) {
            if (AccountStore.isAdmin()) {
                this.context.router.history.replace('/admin');
            } else {
                this.context.router.history.replace('/dashboard');
            }
        }
    }

    onLogin = () => {
        const user = AccountStore.getUser();
        const { location } = this.context.router.history;
        const redirect = location.query && location.query.redirect;

        //Redirect on login
        if (location.pathname == '/' || location.pathname == '/login' || location.pathname == '/demo' || location.pathname == '/signup') {
            if (AccountStore.isAdmin()) {
                this.context.router.history.replace(redirect ? redirect : '/admin');
            } else {
                this.context.router.history.replace(redirect ? redirect : '/dashboard');
            }
        }
    };

    onLogout = () => {
        AsyncStorage.removeItem("user");
        this.context.router.history.replace('/');
    };

    onSearchChanged = (e) => {
        const search = Utils.safeParseEventValue(e);
        this.setState({search});
        if (!search) return;
        this.performSearch(search);
    }

    performSearch = _.debounce((search) => {
        this.setState({searching: true});
        _data.get(`${Project.api}admin/codes/search/${search}`)
            .then(res => {
                if (res && res.length > 0) {
                    this.setState({searchResults: res, searching: false}, this.openPopover);
                } else {
                    this.setState({searchResults: [], searching: false}, this.closePopover);
                }
            })
            .catch(e => {
                // todo
                this.setState({searching: false});
            })
    }, 500);

    openPopover = () => {
        if (!this.searchResultsPopover.isOpen()) this.searchResultsPopover.toggle();
    }

    closePopover = () => {
        if (this.searchResultsPopover.isOpen()) this.searchResultsPopover.toggle();
    }

    editDiagnosis = (code) => {
        this.closePopover();
        this.setState({search: ''})
        this.context.router.history.push('/admin/diagnosis', {code, edit: true});
    }

    render() {
        const { searchResults, searching, search } = this.state;
        const { location } = this.context.router.history;
        const redirect = location.query && location.query.redirect ? `?redirect=${location.query.redirect}` : "";
        const pageHasAside = location.pathname.indexOf('dashboard') !== -1;
        const pageHasNav = location.pathname.indexOf('admin') === -1 && location.pathname.indexOf('dashboard') === -1 && location.pathname.indexOf('terms-of-use') === -1 && location.pathname.indexOf('privacy-policy') === -1;
        const pageHasAdminAside = location.pathname.indexOf('admin') !== -1 ;
        return (
            <div className={pageHasAdminAside ? 'admin-body' : ''}>
                <AccountProvider onNoUser={this.onNoUser} onLogout={this.onLogout} onLogin={this.onLogin}>
                    {({ isLoading, user }) => (
                        <div>
                            <div>
                                {pageHasAdminAside ? <NavAdmin /> : null}
                                {pageHasAdminAside && (
                                    <div className="full-width quick-search-input flex mb-3 mt-3">
                                        <Row className="quick-search-container">
                                            <label className="quick-search-label mr-3">Diagnosis Quick Search:</label>
                                            <div className="flex-1">
                                                <input
                                                    className="input input--outline input--quick-search"
                                                    placeholder="Search by name or synonym"
                                                    onChange={this.onSearchChanged}
                                                    value={search}
                                                />
                                                {searching && <div className="quick-search-loader"><Loader /></div>}
                                                <Popover ref={c => this.searchResultsPopover = c} renderTitle={() => null} className="quick-search-popover-container">
                                                    {(toggle) => searchResults && searchResults.length ? _.map(searchResults, ({code, friendlyName}) => (
                                                        <div key={code} className="list-item clickable" role="button" onClick={() => this.editDiagnosis(code)}>{friendlyName}</div>
                                                    )) : null}
                                                </Popover>
                                            </div>
                                        </Row>

                                    </div>
                                )}
                                {pageHasNav && <Navbar onRegister={()=>{
                                    this.context.router.history.replace(redirect ? redirect : '/dashboard');

                                }}/>}
                                    <div>
                                        {pageHasAside ? <DashboardAside /> : null}
                                        <div className={pageHasAside && "col-md-9 ml-sm-auto col-lg-10 px-md-4 mt-3"}>
                                            {this.props.children}
                                        </div>
                                    </div>

                            </div>
                        </div>
                    )}
                </AccountProvider>
            </div>
        );
    }
}
