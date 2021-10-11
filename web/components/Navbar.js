import React, {Component}  from 'react';
import { Modal, ModalBody } from "reactstrap";
import InputGroup from '../components/base/forms/InputGroup'
import { toJSON } from "lodash/seq";

class TheComponent extends Component {
    state = {}
    login = () =>{
        AppActions.adminLogin({
            username: this.state.email,
            password: this.state.password
        });
    }
    register= () =>{
        AppActions.register({firstName:this.state.firstName, lastName:this.state.lastName, username: this.state.email, password:this.state.password, occupation:this.state.occupation, institution:this.state.institution});
    }
    render() {
        const isSignup = this.props.location.pathname === "/signup"
        return (
            <AccountProvider onSave={this.props.onRegister}>
                {({error, isLoading}, {clearError}) => (
                    <div className="nav">
                        <Link to="/" className="brand mb-2 mb-md-0">
                            <img className="brand-image mt-1" src={require('../images/brand.png')}/>
                        </Link>
                        <Flex/>
                        <Row>
                            <Link to="/#pricing">
                                <Button className={'btn button--outline-dark nav__button mr-3'}>
                                    <span className="nav__button__text">{isLoading ? 'Signing up..' : 'Sign up'}</span>
                                    <img src="/images/icon-login.png" alt="login" className="nav__button__icon image--icon"/>
                                </Button>
                            </Link>
                            <Button onClick={()=>this.setState({modalOpen:true})} className={'btn btn--primary nav__button'}>
                                <span className="nav__button__text">{isLoading ? 'Logging in..' : 'Log in'}</span>
                                <img src="/images/icon-login.png" alt="login" className="nav__button__icon image--icon"/>
                            </Button>
                        </Row>


                        <Modal
                            unmountOnClose
                            isOpen={this.state.modalOpen||isSignup && !this.state.forceClose}
                            toggle={()=>{
                                this.setState({forceClose:true, modalOpen:false})
                                setTimeout(()=>{
                                    this.setState({forceClose:false})
                                    if(isSignup) {
                                        this.props.history.replace("/")
                                    }
                                },350)

                                this.setState({modalOpen:false})
                            }}
                        >
                            <ModalBody test="">
                                <div className="ml-0 ml-md-auto">
                                    {isSignup ? (
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            if (this.state.email && this.state.password) {
                                                clearError();
                                                this.register();
                                            }
                                        }}>
                                            <h3 className="mb-4 mt-2">
                                                Sign Up
                                            </h3>
                                            <div className="row">
                                                <div className="col-md-6 mb-4">
                                                    <InputGroup
                                                        title="First name"
                                                        placeholder="Enter first name"
                                                        onChange={(e) => this.setState({ firstName: Utils.safeParseEventValue(e) })}
                                                        inputClassName="input--default" />
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <InputGroup
                                                        title="Last name"
                                                        placeholder="Enter first name"
                                                        onChange={(e) => this.setState({ lastName: Utils.safeParseEventValue(e) })}
                                                        inputClassName="input--default" />
                                                </div>
                                                <div className="col-md-12 mb-4">
                                                    <InputGroup
                                                        title="Email"
                                                        type="email"
                                                        placeholder="Enter email"
                                                        onChange={(e) => this.setState({ email: Utils.safeParseEventValue(e) })}
                                                        inputClassName="input--default" />
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <InputGroup
                                                        type="password"
                                                        title="Password"
                                                        placeholder="Minimum 7 characters"
                                                        onChange={(e) => this.setState({ password: Utils.safeParseEventValue(e) })}
                                                        inputClassName="input--default"/>
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <InputGroup
                                                        type="password"
                                                        title="Confirm Password"
                                                        placeholder="Minimum 7 characters"
                                                        onChange={(e) => this.setState({ confirmPassword: Utils.safeParseEventValue(e) })}
                                                        inputClassName="input--default"/>
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <InputGroup
                                                        title="Occupation"
                                                        placeholder="Enter password"
                                                        onChange={(e) => this.setState({ confirmPassword: Utils.safeParseEventValue(e) })}
                                                        component={(
                                                            <select onChange={(e)=>this.setState({occupation:Utils.safeParseEventValue(e)})} className="custom-select">
                                                                <option value="">
                                                                    Please Select
                                                                </option>
                                                                {Constants.occupations.map((v)=>(
                                                                    <option value={v.value} key={v.value}>
                                                                        {v.value}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        )}
                                                        inputClassName="input--default"/>

                                                </div>
                                                <SettingsProvider>
                                                    {({settings, isLoading: settingsIsLoading, error: settingsError}) => (
                                                        <div className="col-md-6 mb-4">
                                                            <InputGroup
                                                                title="Institution"
                                                                onChange={(e) => this.setState({ confirmPassword: Utils.safeParseEventValue(e) })}
                                                                component={(
                                                                    <select onChange={(e)=>this.setState({institution:Utils.safeParseEventValue(e)})} className="custom-select">
                                                                        <option value="">
                                                                            Enter Occupation
                                                                        </option>
                                                                        {settings && _.map(_.filter(settings.institutions, i => !i.hidden), institution => (
                                                                            <option key={institution.id} value={institution.id}>{institution.name}</option>
                                                                        ))}
                                                                    </select>
                                                                )}
                                                                inputClassName="input--default"/>
                                                        </div>
                                                    )}

                                                </SettingsProvider>

                                            </div>

                                            <Button disabled={isLoading
                                            || !this.state.email
                                            || !this.state.password
                                            || (this.state.password !== this.state.confirmPassword)
                                            || (!this.state.occupation)
                                            || (!this.state.institution)
                                            || (!this.state.firstName)
                                            || (!this.state.lastName)
                                            } onClick={this.register} className={'btn btn--primary nav__button'}>
                                                <span className="nav__button__text">{isLoading ? 'Signing up..' : 'Sign up'}</span>
                                                <img src="/images/icon-login.png" alt="login" className="nav__button__icon image--icon"/>
                                            </Button>
                                            <p style={{width:"80%"}} className="text-small text-lighter mt-4">
                                                By clicking the 'Sign Up' button, you confirm that you accept our <a target="_blank" href="/terms-of-use">Terms of Use</a> and <a target="_blank" href="/privacy-policy">Privacy Policy</a>.
                                            </p>
                                            {error && error.message && <div className="text-danger">{error.message}</div>}
                                            <hr/>
                                            Have an Account? <Link onClick={()=>this.setState({modalOpen:true})} to="/">Log in</Link>
                                        </form>
                                    ): (
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            if (this.state.email && this.state.password) {
                                                clearError();
                                                this.login(this.props.id, this.state.name);
                                            }
                                        }}>
                                            <h3 className="mb-4 mt-2">
                                                Log in
                                            </h3>
                                            <InputGroup
                                                title="Email"
                                                placeholder="Enter email"
                                                type="email"
                                                className="mb-4"
                                                onChange={(e) => this.setState({ email: Utils.safeParseEventValue(e) })}
                                                inputClassName="input--default" />
                                            <InputGroup
                                                type="password"
                                                title="Password"
                                                placeholder="Enter password"
                                                onChange={(e) => this.setState({ password: Utils.safeParseEventValue(e) })}
                                                className="mb-4"
                                                inputClassName="input--default"/>

                                            <Button disabled={isLoading
                                            || !this.state.email
                                            || !this.state.password
                                            } onClick={this.login} className={'btn btn--primary nav__button'}>
                                                <span className="nav__button__text">{isLoading ? 'Logging in..' : 'Log in'}</span>
                                                <img src="/images/icon-login.png" alt="login" className="nav__button__icon image--icon"/>
                                            </Button>

                                            {error && error.message && <div className="text-danger">{error.message}</div>}
                                            <hr/>
                                            Not a member? <Link to="/signup">Sign up</Link>
                                        </form>
                                    )}

                                </div>
                            </ModalBody>
                        </Modal>
                    </div>
                )}
            </AccountProvider>
        )
    }
}
import { withRouter } from 'react-router-dom';

export default withRouter(TheComponent)
