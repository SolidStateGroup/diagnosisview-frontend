import React, { Component, PropTypes } from 'react';
import Aside from './Aside';
import Nav from './Nav';
import Popover from './base/Popover';
import _data from '../../common/stores/base/_data';

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
        if (user && (pathname == '/' || pathname == '/login' || pathname == '/demo' || pathname == '/signup')) {
            this.context.router.history.replace('/admin');
        } else if (!user && pathname.indexOf('/admin') !== -1) {
            this.context.router.history.replace('/');
        }
    }

    onLogin = () => {
        const user = AccountStore.getUser();
        const { location } = this.context.router.history;
        const redirect = location.query && location.query.redirect;

        //Redirect on login
        if (location.pathname == '/' || location.pathname == '/login' || location.pathname == '/demo' || location.pathname == '/signup') {
            this.context.router.history.replace(redirect ? redirect : '/admin');
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
        const pageHasAside = location.pathname.indexOf('admin') !== -1;
        return (
            <div>
                <AccountProvider onNoUser={this.onNoUser} onLogout={this.onLogout} onLogin={this.onLogin}>
                    {({ isLoading, user }) => (
                        <div>
                            <div>
                                {pageHasAside ? <Nav /> : null}
                                {pageHasAside && (
                                    <div className="full-width quick-search-input flex mb-3">
                                        <Row>
                                            <input
                                                className="input input--outline flex-1 input--quick-search"
                                                placeholder="Diagnosis Quick Search"
                                                onChange={this.onSearchChanged}
                                                value={search}
                                            />
                                            {searching && <div style={{position: 'absolute', right: 30}}><Loader /></div>}
                                        </Row>
                                        <Popover ref={c => this.searchResultsPopover = c} renderTitle={() => null} className="ml-3">
                                            {(toggle) => searchResults && searchResults.length ? _.map(searchResults, ({code, friendlyName}) => (
                                                <div key={code} className="list-item clickable" role="button" onClick={() => this.editDiagnosis(code)}>{friendlyName}</div>
                                            )) : null}
                                        </Popover>
                                    </div>
                                )}
                                {this.props.children}
                            </div>
                        </div>
                    )}
                </AccountProvider>
            </div>
        );
    }
}
