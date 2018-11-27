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
        if (AccountStore.getUser() && this.props.location.pathname == '/' || this.props.location.pathname == '/login' || this.props.location.pathname == '/demo' || this.props.location.pathname == '/signup') {
            this.context.router.replace('/admin');
        }
    }

    onLogin = () => {
        const user = AccountStore.getUser();
        const { redirect } = this.props.location.query;

        //Redirect on login
        if (this.props.location.pathname == '/' || this.props.location.pathname == '/login' || this.props.location.pathname == '/demo' || this.props.location.pathname == '/signup') {
            this.context.router.replace(redirect ? redirect : '/admin');
        }
    };

    onLogout = () => {
        AsyncStorage.removeItem("user");
        this.context.router.replace('/');
    };

    render() {
        const redirect = this.props.location.query.redirect ? `?redirect=${this.props.location.query.redirect}` : "";
        const pageHasAside = this.props.location.pathname.indexOf('admin') !== -1;
        return (
            <div>
                <AccountProvider onNoUser={this.onNoUser} onLogout={this.onLogout} onLogin={this.onLogin}>
                    {({ isLoading, user }) => (
                        <div className={pageHasAside && "aside-body"}>
                            <div className="header full-width">
                                <ul className="list-inline list-unstyled float-right mb-0">
                                    <li>
                                        <a id="logout-link" className="header__link" onClick={this.logout} href='#'>Logout</a>
                                    </li>
                                </ul>
                            </div>
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

App.propTypes = {
    location: RequiredObject,
    history: RequiredObject,
};
