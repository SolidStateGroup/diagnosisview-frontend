import React, { Component, PropTypes } from 'react';
import Aside from './Aside';

export default class App extends Component {

    static propTypes = {
        children: PropTypes.element.isRequired
    };

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    logout = () => {
        openConfirm(<h3>Confirm</h3>, <p>Are you sure you wish to logout?</p>, AppActions.logout);
    }

    componentDidMount() {
        const { pathname } = this.context.router.history.location;
        if (AccountStore.getUser() && pathname == '/' || pathname == '/login' || pathname == '/demo' || pathname == '/signup') {
            this.context.router.history.replace('/admin');
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

    render() {
        const { location } = this.context.router.history;
        const redirect = location.query && location.query.redirect ? `?redirect=${location.query.redirect}` : "";
        const pageHasAside = location.pathname.indexOf('admin') !== -1;
        return (
            <div>
                <AccountProvider onNoUser={this.onNoUser} onLogout={this.onLogout} onLogin={this.onLogin}>
                    {({ isLoading, user }) => (
                        <div className={pageHasAside ? "aside-body" : null}>
                            {/*<div className="header full-width">*/}
                                {/*<ul className="list-inline list-unstyled float-right mb-0">*/}
                                    {/*<li>*/}
                                        {/*<a id="logout-link" className="header__link" onClick={this.logout} href='#'>Logout</a>*/}
                                    {/*</li>*/}
                                {/*</ul>*/}
                            {/*</div>*/}
                            <Row>
                                {pageHasAside ? <Aside /> : null}
                                {this.props.children}
                            </Row>
                        </div>
                    )}
                </AccountProvider>
            </div>
        );
    }
}
