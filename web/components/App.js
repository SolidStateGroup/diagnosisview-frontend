import React, { Component, PropTypes } from 'react';
import Aside from './Aside';
import DashboardAside from './DashboardAside';
import NavAdmin from './NavAdmin';
import Popover from './base/Popover';
import _data from '../../common/stores/base/_data';
import Navbar from "./Navbar";
import DashboardNavbar from "./DashboardNavbar";
import ErrorAlert from "./ErrorAlert";
import Footer from "./Footer";

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
        AppActions.getCodeCategories();
        AppActions.getLinkLogos();

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

        const { pathname } = this.context.router.history.location;

        if (pathname.includes("admin")||pathname.includes("dashboard"))
            return

        //Redirect on login
            if (AccountStore.isAdmin()) {
                this.context.router.history.replace(redirect ? redirect : '/admin');
            } else {
                this.context.router.history.replace(redirect ? redirect : '/dashboard');
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
        const pageHasNav = location.pathname.indexOf('admin') === -1 && location.pathname.indexOf('dashboard') === -1 && location.pathname.indexOf('about') === -1 &&  location.pathname.indexOf('accessibility-policy') === -1 && location.pathname.indexOf('terms-of-use') === -1 && location.pathname.indexOf('privacy-policy') === -1;
        const pageHasAdminAside = location.pathname.indexOf('admin') !== -1 ;
        const pageHasFooter = location.pathname.startsWith("/search") || location.pathname === "/" || location.pathname.startsWith("/codes")
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
                                    const isPro = document.location.href.includes("plan");
                                    setTimeout(()=>{
                                        this.context.router.history.replace(redirect ? redirect : isPro? '/dashboard/account?manage=1':"/dashboard");
                                    }, 500)

                                }}/>}
                                    <div>
                                        {pageHasAside ? <DashboardAside /> : null}
                                        <div className={pageHasAside && "dashboard-aside__content"}>
                                                {pageHasAside && <DashboardNavbar/>}
                                                <div className={"dashboard-container"}>
                                                    {AccountStore.hasExpiredSubscription() && (
                                                        <div className="col-md-6 ml-4 mb-4">
                                                            <ErrorAlert>
                                                                Your annual Professional subscription expired on {moment(AccountStore.hasExpiredSubscription()).format("Do MMM HH:mm")}.
                                                                <br/>
                                                                <Link to="/account?manage=1">Click here to renew</Link>
                                                            </ErrorAlert>
                                                        </div>
                                                    )}
                                                    <div className="col-md-12">

                                                        {this.props.children}
                                                    </div>
                                                    {pageHasAside &&(
                                                        <Footer light/>
                                                    )}
                                                    {pageHasFooter && (
                                                        <Footer fixed/>
                                                    )}
                                                </div>
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
