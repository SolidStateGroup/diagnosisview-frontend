import React, {Component}  from 'react';
import { Modal, ModalBody } from "reactstrap";
import InputGroup from '../components/base/forms/InputGroup'
import _data from '../../common/stores/base/_data'
import ReactCodeInput from "react-code-input";
class TheComponent extends Component {
    state = {}
    login = () =>{
        AppActions.adminLogin({
            username: this.state.username,
            password: this.state.password
        });
    }

    componentDidMount() {
        const isSignup = this.props.location.pathname === "/signup"
        if(isSignup) {
            setTimeout(()=>{
                document.getElementById("firstName").focus()
            },1000)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const isSignup = this.props.location.pathname === "/signup" && prevProps.location.pathname !== "/signup"
        const isForgotPassword = this.props.location.pathname === "/forgot-password" && prevProps.location.pathname !== "/forgot-password"
        const isLogin = !isSignup && this.state.modalOpen && !prevState.modalOpen
        if(isSignup) {
            setTimeout(()=>{
                document.getElementById("firstName").focus()
            },1000)
        } else if (isLogin) {
            setTimeout(()=>{
                document.getElementById("email").focus()
            },1000)
        }
    }

    invalid = () => {
        const {firstName, lastName, username, password, repeatPassword, occupation, institution} = this.state;

        if (!firstName || !lastName || !username || !password || !repeatPassword || !occupation || !institution) {
            return true;
        }

        return false;
    }

    forgotPassword = (e) => {
        Utils.preventDefault(e)
        this.setState({ isLoading: true, error: '' });
        _data.post(Project.api + 'user/forgotten-password', {
            username: this.state.resetUsername
        })
            .then(() => {
                this.setState({isLoading: false})
                this.props.history.replace("/forgot-password?confirm=1&username="+encodeURIComponent(this.state.resetUsername))
            })
            .catch(e => {
                this.props.history.replace("/forgot-password?confirm=1&username="+encodeURIComponent(this.state.resetUsername))

            });
    }

    register= () =>{
        const {firstName, lastName, username, password, repeatPassword, occupation, institution} = this.state;

        if (password.length < 7) {
            this.setState({error: {message:'Password must be at least 7 characters'}});
            document.getElementById("password").focus();
            return;

        }

        if (password !== repeatPassword) {
            this.setState({error: {message:'Passwords do not match. Please correct and try again.'}});
            document.getElementById("password").focus();
            return;
        }

        if (!Utils.isValidEmail(username)) {
            this.setState({error: {message:'Email address is invalid'}});
            document.getElementById("email").focus();
            return;
        }

        this.setState({error:null})
        AppActions.register({firstName:this.state.firstName, lastName:this.state.lastName, username: this.state.username, password:this.state.password, occupation:this.state.occupation, institution:this.state.institution});
    }

    changePassword = () => {
        const { code, password, repeatPassword } = this.state;

        if (!code || code.length < 6) {
            this.setState({ error: {message:'Enter the reset code' }});
            return;
        }

        if (password.length < 7) {
            this.setState({ error: {message:'Password must be at least 7 characters' }});
            document.getElementById("password").focus();
            return;

        }

        if (password !== repeatPassword) {
            this.setState({ error: {message:'Passwords do not match' }});
            document.getElementById("password").focus();
            return;
        }

        this.setState({ isLoading: true, error: '' });
        _data.post(Project.api + 'user/reset-password', {
            newPassword: password,
            resetCode: code,
            username: this.state.resetUsername
        })
            .then(() => {
                AppActions.login({username: this.state.resetUsername.toLowerCase(), password});
             })
            .catch(e => {
                e.json().then(error => {
                    this.setState({ isLoading: false, step: 2, error: error });
                }).catch(() => {
                    this.setState({ isLoading: false, step: 2, error: {message:'Sorry there was a problem resetting your password, try again later' }});
                })
            });
    }

    toggle = ()=> {
        const isSignup = this.props.location.pathname === "/signup"
        const isForgotPassword = this.props.location.pathname === "/forgot-password"

        this.setState({forceClose:true, modalOpen:false})
        AccountStore.error = null;
        this.setState({
            success: null,
            error: null,
            firstName: null,
            lastName: null,
            username: null,
            code: "",
            resetUsername: null,
            password: null,
            occupation: null,
            institution: null
        });
        AccountStore.trigger("change")
        setTimeout(()=>{
            this.setState({forceClose:false})
            if(isSignup || isForgotPassword) {
                this.props.history.replace("/")
            }
        },350)

        this.setState({modalOpen:false})
    }

    render() {
        const isSignup = this.props.location.pathname === "/signup"
        const isForgotPassword = this.props.location.pathname === "/forgot-password"
        const isConfirm = this.props.location.search && this.props.location.search.includes("confirm")
        if(isConfirm && !this.state.resetUsername) {
            this.state.resetUsername = Utils.fromParam().username;
            if(!this.state.resetUsername) {
                this.props.history.replace("/forgot-password")
            }
        }
        return (
            <AccountProvider onSave={this.props.onRegister}>
                {({error, isLoading, user, isSaving}, {clearError}) => {
                    const theError = this.state.error || error
                    return (
                        <div className="nav">
                            <Link to={AccountStore.model? "/dashboard":"/"} className="brand">
                                <img className="brand-image" src={require('../images/brand.png')}/>
                            </Link>
                            <Flex/>
                            {user? (
                                <Button onClick={AppActions.logout} className={'btn button--outline-dark nav__button mr-3'}>
                                    <span className="nav__button__text">Logout</span>
                                </Button>
                            ): (
                                <Row>
                                    <Link to={Constants.webPayments?"/#pricing":"/signup"}>
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
                            )}



                            <Modal
                                unmountOnClose
                                onClosed={()=>AccountStore.error = null}
                                isOpen={this.state.modalOpen||(isSignup && !this.state.forceClose) || (isForgotPassword && !this.state.forceClose)}
                                toggle={()=>{
                                   this.toggle()
                                }}
                            >
                                <ModalBody test="">
                                    <div className="ml-0 ml-md-auto">
                                        {isSignup ? (
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                if (this.state.username && this.state.password) {
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
                                                            id={"firstName"}
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
                                                            id="email"
                                                            title="Email"
                                                            type="email"
                                                            placeholder="Enter email"
                                                            onChange={(e) => this.setState({ username: Utils.safeParseEventValue(e) })}
                                                            inputClassName="input--default" />
                                                    </div>
                                                    <div className="col-md-6 mb-4">
                                                        <InputGroup
                                                            id="password"
                                                            type="password"
                                                            title="Password"
                                                            value={this.state.password}
                                                            placeholder="Minimum 7 characters"
                                                            onChange={(e) => this.setState({ password: Utils.safeParseEventValue(e) })}
                                                            inputClassName="input--default"/>
                                                    </div>
                                                    <div className="col-md-6 mb-4">
                                                        <InputGroup
                                                            type="password"
                                                            title="Confirm Password"
                                                            value={this.state.repeatPassword}
                                                            placeholder="Minimum 7 characters"
                                                            onChange={(e) => this.setState({ repeatPassword: Utils.safeParseEventValue(e) })}
                                                            inputClassName="input--default"/>
                                                    </div>
                                                    <div className="col-md-6 mb-4">
                                                        <InputGroup
                                                            title="Occupation"
                                                            placeholder="Enter password"
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
                                                || isSaving || this.invalid()} onClick={this.register} className={'btn btn-lg btn--primary nav__button'}>
                                                    <span className="nav__button__text">{isLoading ? 'Signing up..' : 'Sign up'}</span>
                                                    <img src="/images/icon-login.png" alt="login" className="nav__button__icon image--icon"/>
                                                </Button>
                                                <p style={{width:"80%"}} className="text-small text-lighter mt-4">
                                                    By clicking the 'Sign Up' button, you confirm that you accept our <a target="_blank" href="/terms-of-use">Terms of Use</a> and <a target="_blank" href="/privacy-policy">Privacy Policy</a>.
                                                </p>
                                                {theError && theError.message && <div className="text-danger">{theError.message}</div>}
                                                <hr/>
                                                Have an Account? <Link onClick={()=>this.setState({modalOpen:true})} to="/">Log in</Link>
                                            </form>
                                        ): isForgotPassword? (
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                if(isConfirm) {
                                                    this.changePassword();
                                                    return
                                                }
                                                if (this.state.resetUsername) {
                                                    clearError();
                                                    this.forgotPassword(this.state.resetUsername);
                                                }
                                            }}>
                                                <h3 className="mb-4 mt-2">
                                                    {isConfirm? "Reset Password": "Forgot Password"}
                                                </h3>
                                                {isConfirm? (
                                                   <div>
                                                       <div className="mb-3">
                                                           <InputGroup
                                                               id="password"
                                                               type="password"
                                                               title="A reset code has been sent to the registered email. Please enter it below:"
                                                               component={(
                                                                   <ReactCodeInput
                                                                       className="mt-2"
                                                                       autoComplete="one-time-code"
                                                                       value={this.state.code}
                                                                       onChange={(code)=>this.setState({code})}
                                                                       inputStyle={{
                                                                           marginRight:25,
                                                                           fontSize:20,
                                                                           textAlign:'center',
                                                                           backgroundColor: "#F0F1FF",
                                                                           border: "1px solid rgba(7, 27, 57, 0.4)",
                                                                           borderRadius: "6px",
                                                                           width: "50px",
                                                                           height: "48px",
                                                                       }}
                                                                       type='text' fields={6} />
                                                               )}
                                                           />
                                                       </div>

                                                           <InputGroup
                                                               id="password"
                                                               type="password"
                                                               className="mb-4"
                                                               title="New Password"
                                                               value={this.state.password}
                                                               placeholder="Minimum 7 characters"
                                                               onChange={(e) => this.setState({ password: Utils.safeParseEventValue(e) })}
                                                               inputClassName="input--default"/>
                                                           <InputGroup
                                                               className="mb-4"
                                                               type="password"
                                                               title="Confirm New Password"
                                                               value={this.state.repeatPassword}
                                                               placeholder="Minimum 7 characters"
                                                               onChange={(e) => this.setState({ repeatPassword: Utils.safeParseEventValue(e) })}
                                                               inputClassName="input--default"/>

                                                       <Button disabled={ this.state.isLoading || !this.state.code || this.state.code.length !== 6 || !this.state.password || !this.state.repeatPassword
                                                       } onClick={this.changePassword} className={'btn btn-lg btn--primary nav__button'}>
                                                           <span className="nav__button__text">{this.state.isLoading ? 'Confirming..' : 'Confirm'}</span>
                                                           <img src="/images/icon-login.png" alt="login" className="nav__button__icon image--icon"/>
                                                       </Button>
                                                       {theError && theError.message && <div className="text-danger mt-2">{theError.message}</div>}
                                                   </div>
                                                ): (
                                                    <div>
                                                            <InputGroup
                                                                id="email"
                                                                title="Please enter the e-mail address that you used when registering for DiagnosisView. Following this, you will be taken to the next step in the reset procedure."
                                                                type="email"
                                                                placeholder="Enter email"
                                                                className="mb-4"

                                                                onChange={(e) => this.setState({ resetUsername: Utils.safeParseEventValue(e) })}
                                                                inputClassName="input--default" />
                                                            <Button disabled={ this.state.isLoading || !this.state.resetUsername
                                                            } onClick={this.forgotPassword} className={'btn btn-lg btn--primary nav__button'}>
                                                                <span className="nav__button__text">{this.state.isLoading ? 'Resetting Password..' : 'Reset Password'}</span>
                                                                <img src="/images/icon-login.png" alt="login" className="nav__button__icon image--icon"/>
                                                            </Button>
                                                        {theError && theError.message && <div className="text-danger mt-2">{theError.message}</div>}
                                                    </div>
                                                )}

                                            </form>
                                        ) : (
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                if (this.state.username && this.state.password) {
                                                    clearError();
                                                    this.login(this.props.id, this.state.name);
                                                }
                                            }}>
                                                <h3 className="mb-4 mt-2">
                                                    Log in
                                                </h3>
                                                <InputGroup
                                                    id="email"
                                                    title="Email"
                                                    placeholder="Enter email"
                                                    type="email"
                                                    className="mb-4"
                                                    value={this.state.username}
                                                    onChange={(e) => this.setState({ username: Utils.safeParseEventValue(e) })}
                                                    inputClassName="input--default" />
                                                <InputGroup
                                                    id="password"
                                                    type="password"
                                                    title="Password"
                                                    value={this.state.password}
                                                    placeholder="Enter password"
                                                    onChange={(e) => this.setState({ password: Utils.safeParseEventValue(e) })}
                                                    className="mb-4"
                                                    inputClassName="input--default"/>

                                                <Button disabled={isLoading
                                                || !this.state.username
                                                || !this.state.password
                                                } onClick={this.login} className={'btn btn-lg btn--primary nav__button'}>
                                                    <span className="nav__button__text">{isLoading ? 'Logging in..' : 'Log in'}</span>
                                                    <img src="/images/icon-login.png" alt="login" className="nav__button__icon image--icon"/>
                                                </Button>

                                                {error && error.message && <div className="text-danger mt-3">{error.message}</div>}
                                                <hr/>
                                                <Row>
                                                    <Flex>
                                                        <Row>
                                                            Not a member? <Link className="ml-1" onClick={()=>{
                                                            if(Constants.webPayments) {
                                                                this.setState({modalOpen:false})
                                                            }
                                                        }} to={Constants.webPayments?"/#pricing":"/signup"}>Sign up</Link>
                                                        </Row>

                                                    </Flex>
                                                    <Link onClick={()=>{
                                                        if(Constants.webPayments) {
                                                            this.setState({modalOpen:false})
                                                        }
                                                    }} to={"/forgot-password"}>Forgot Password?</Link>
                                                </Row>

                                            </form>
                                        )}

                                    </div>
                                </ModalBody>
                            </Modal>
                        </div>
                    )
                }}
            </AccountProvider>
        )
    }
}
import { withRouter } from 'react-router-dom';

export default withRouter(TheComponent)
