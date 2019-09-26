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
        return (
            <div className="app-container full-height">
                <AccountProvider onError={() => this.setState({password: ''})}>
                    {({error, isLoading}, {clearError}) => (
                        <Flex className="hero">
                            <div className="full-width">
                                <div className="flex-row">
                                    <div className="col-md-6 align-items-center justify-content-center flex text-left full-height">
                                        <img src={require('../../images/brand.png')} width="35%" />
                                        <FormGroup className="text-center padded">
                                            <h5 className="text-dark my-4">DiagnosisView gives healthcare students and practitioners immediate access to selected reliable information on over 1,000 common diagnoses</h5>
                                            <ul className="list-unstyled text-dark">
                                                <li>Info on your own mobile or tablet</li>
                                                <li>Advanced patient info is the starting point (free)</li>
                                                <li>Moving on to practitioner-level and expert-level professional resources</li>
                                            </ul>
                                            <p>With an optional account you can access professional resources, as well as sync favourites and history across devices.</p>
                                            <p>DiagnosisView was developed by <a href="https://www.ed.ac.uk" target="_blank">The University of Edinburgh</a> with the support of the <a href="https://www.patientview.org" target="_blank">www.patientview.org</a> electronic health records system.</p>
                                        </FormGroup>
                                        <div>
                                            <Column className="centered-container" style={{alignItems: 'stretch', justifyContent: 'center'}}>
                                                <form onSubmit={(e) => {
                                                    e.preventDefault();
                                                    if (this.state.email && this.state.password) {
                                                        clearError();
                                                        this.login(this.props.id, this.state.name);
                                                    }
                                                }}>
                                                    <InputGroup
                                                        title="Email"
                                                        placeholder="email" type="email"
                                                        onChange={(e) => this.setState({ email: Utils.safeParseEventValue(e) })}
                                                        inputProps={{ className: "full-width text-center" }} />

                                                    <InputGroup title="Password"
                                                                placeholder="password" type="password"
                                                                onChange={(e) => this.setState({ password: Utils.safeParseEventValue(e) })}
                                                                inputProps={{ className: "full-width text-center" }} />

                                                    <Button disabled={isLoading || !this.state.email || !this.state.password} onClick={this.login} className={'btn btn--primary'}>{isLoading ? 'Logging in..' : 'Login'}</Button>
                                                    {error && error.message && <div className="text-danger">{error.message}</div>}
                                                </form>
                                            </Column>
                                        </div>
                                    </div>
                                    <div className="col-md-6 hero--blue flex align-items-center justify-content-center full-height">
                                        <div className="centered-container">
                                            <Column className="centered-container">
                                                <div className="iphoneandroid noshrink">
                                                    <div className="iphoneandroid-android">
                                                        <div className="mask mask__noimage">
                                                            <img src="/images/search-android.jpg" alt="" className="mask-img img-fluid"/>
                                                        </div>
                                                    </div>
                                                    <div className="iphoneandroid-iphone">
                                                        <div className="mask mask__noimage">
                                                            <img src="/images/dashboard.jpg" alt="" className="mask-img img-fluid"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Row className="centered-container">
                                                    <a href="https://apps.apple.com/us/app/diagnosisview/id1421837293?ls=1" target="_blank" className="button mobile-text-center mt10 mr10 mobile-text-center fill-white" style={{backgroundColor: '#297AFB', color: '#fff'}}>
                                                        <svg width="15" height="18" viewBox="0 0 15 18" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12.55 9.543c-.02-2.232 1.827-3.317 1.912-3.368-1.046-1.525-2.668-1.733-3.238-1.75-1.361-.143-2.682.815-3.376.815-.708 0-1.776-.8-2.927-.777-1.482.022-2.868.88-3.628 2.212-1.569 2.716-.399 6.707 1.104 8.903.752 1.075 1.63 2.275 2.78 2.233 1.126-.046 1.546-.717 2.904-.717 1.345 0 1.74.717 2.912.69 1.208-.02 1.968-1.08 2.693-2.165.87-1.232 1.218-2.446 1.232-2.508-.029-.01-2.345-.894-2.368-3.568zM10.335 2.98c.605-.757 1.019-1.786.904-2.83-.876.038-1.971.605-2.602 1.345-.558.652-1.056 1.721-.927 2.726.983.074 1.993-.496 2.625-1.24z" fillRule="nonzero"></path>
                                                        </svg>
                                                        <span> Get on App Store </span>
                                                    </a>
                                                    <a href="https://play.google.com/store/apps/details?id=com.solidstategroup.dvmobile" target="_blank" className="button mobile-text-center mt10">
                                                        <svg width="76" height="80" viewBox="0 0 76 80" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6.175 79.25c1.879.334 4.098-.077 6.471-1.355l41.613-22.406-12.106-12.05L6.175 79.25zM2.083 3.555C1.044 5.034.446 7.069.446 9.576v61.031c0 2.442.566 4.436 1.553 5.902L38.69 39.991 2.083 3.555zM54.181 24.572L12.653 2.275C10.346 1.037 8.184.612 6.341.896l35.812 35.646 12.028-11.97zM58.757 53.068l12.016-6.471c6.711-3.612 6.707-9.517-.008-13.122l-12.082-6.487-13.065 13.003 13.139 13.077z"></path>
                                                        </svg>
                                                        <span> Get on Play Store </span>
                                                    </a>
                                                </Row>
                                            </Column>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Link className="privacy-policy-link" to='/privacy-policy'>Privacy Policy</Link>
                        </Flex>
                    )}
                </AccountProvider>
            </div>
        );
    }
};
