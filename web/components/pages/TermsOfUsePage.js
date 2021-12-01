import React from "react";

module.exports = class extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentWillMount() {

    }

    login = () => {
        AppActions.adminLogin({
            username: this.state.email,
            password: this.state.password
        });
    }

    render = () => {
        const showBackToHome =!document.location.href.includes("mobile")
        return (
            <div className="padded">
                <AccountProvider onError={() => this.setState({password: ''})}>
                    {({error, isLoading}, {clearError}) => (
                        <Flex>
                            <div>
                                <img className="margin-bottom" src={require('../../images/brand.png')} height="44" />
                                {showBackToHome && (
                                    <Link to='/' style={{float: 'right'}}>Back to Home</Link>
                                )}
                                <h1>Terms of Use</h1>
                            </div>
                        </Flex>
                    )}
                </AccountProvider>
            </div>
        );
    }
};
