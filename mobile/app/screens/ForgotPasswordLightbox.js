import React, { Component, PropTypes } from 'react';
const data = require('../../common-mobile/stores/base/_data');

const ForgotPasswordLightbox = class extends Component {
    displayName: 'ForgotPasswordLightbox'

    state = {
        step: 1
    }

    componentDidMount() {
        this.emailInput.focus();
    }

    sendEmail = () => {
        this.setState({ isLoading: true, error: '' });
        data.post(Project.api + 'user/forgotten-password', {
            username: this.state.email
        })
            .then(() => {
                this.setState({ isLoading: false, step: 2 });
            })
            .catch(e => {
                this.setState({ isLoading: false, error: 'Sorry there was a problem, check you entered the correct email address or try again later' });
            })
    }

    changePassword = () => {
        const { code, password, repeatPassword } = this.state;

        if (!code || code.length < 6) {
            this.setState({ error: 'Enter the reset code' });
            this.codeInput.focus();
            return;
        }

        if (password.length < 7) {
            this.setState({ error: 'Password must be at least 7 characters', password: '', repeatPassword: '' });
            this.passwordInput.focus();
            return;

        }

        if (password !== repeatPassword) {
            this.setState({ error: 'Passwords do not match', password: '', repeatPassword: '' });
            this.passwordInput.focus();
            return;
        }

        this.setState({ isLoading: true, error: '' });
        data.post(Project.api + 'user/reset-password', {
            newPassword: password,
            resetCode: this.state.code,
            username: this.state.email
        })
            .then(() => {
                this.setState({ isLoading: false, step: 3 });
            })
            .catch(e => {
                this.setState({ isLoading: false, step: 2, error: 'Sorry there was a problem resetting your password, try again later' });
            });
    }

    render() {
        return (
            <View style={Styles.lightboxOuter}>
                <View style={Styles.lightbox}>
                    {this.state.isLoading ? <Flex style={Styles.centeredContainer}><Loader /></Flex> : (
                        <View style={[Styles.padded]}>
                            <AutoHeightImage width={150} style={[Styles.alignCenter, Styles.stacked]}
                                source={require('../images/brand-medium.png')} />
                            {(() => {
                                switch (this.state.step) {
                                    case 1:
                                    default:
                                        return (
                                            <View>
                                                <Text style={{ marginBottom: 10, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Enter your account email</Text>
                                                <TextInput
                                                    onChangeText={(email) => this.setState({ email })}
                                                    value={this.state.email}
                                                    placeholder={"Enter your email address"}
                                                    ref={c => this.emailInput = c}
                                                    autoCapitalize='none'
                                                    keyboardType='email-address'
                                                    autoCorrect={false}
                                                />
                                                <Row style={{ marginTop: 10 }}>
                                                    <Button style={[Styles.buttonCancel, Styles.buttonLeftModal]}
                                                        onPress={() => this.props.navigator.dismissLightBox()}>
                                                        Cancel
                                                    </Button>
                                                    <Button style={[Styles.buttonRightModal]}
                                                        disabled={!this.state.email || !Utils.isValidEmail(this.state.email)}
                                                        onPress={this.sendEmail}>
                                                        OK
                                                    </Button>
                                                </Row>
                                            </View>
                                        );
                                    case 2:
                                        return (
                                            <View>
                                                <Text style={{ marginBottom: 10, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>A reset code has been sent to the registered email. Please enter it below:</Text>
                                                <View style={{height: 100}}>
                                                    <CodeInput
                                                        codeLength={6}
                                                        ref={c => this.codeInput = c}
                                                        space={5}
                                                        inputPosition='center'
                                                        activeColor={pallette.primary}
                                                        inactiveColor='rgba(49, 180, 4, 1.3)'
                                                        codeInputStyle={{ fontWeight: '800', borderRadius: 25, borderColor: pallette.primary, color: pallette.primary }}
                                                        onFulfill={code => this.setState({ code })}
                                                    />
                                                </View>
                                                <Text style={{ marginBottom: 10, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Enter new password</Text>
                                                <View style={Styles.stackedForm}>
                                                    <TextInput
                                                        onChangeText={(password) => this.setState({ password })}
                                                        value={this.state.password}
                                                        placeholder={"New password (min 7 characters)"}
                                                        secureTextEntry={true}
                                                        ref={c => this.passwordInput = c}
                                                    />
                                                </View>
                                                <View style={Styles.stackedForm}>
                                                    <TextInput
                                                        onChangeText={(repeatPassword) => this.setState({ repeatPassword })}
                                                        value={this.state.repeatPassword}
                                                        placeholder="Repeat password"
                                                        secureTextEntry={true}
                                                        ref={c => this.repeatPasswordInput = c}
                                                    />
                                                </View>
                                                <Row style={{ justifyContent: 'center' }}>
                                                    <Button style={{ width: 150 }}
                                                        disabled={!this.state.password || !this.state.repeatPassword}
                                                        onPress={this.changePassword}>
                                                        OK
                                                    </Button>
                                                </Row>
                                            </View>
                                        )
                                    case 3:
                                        return (
                                            <View>
                                                <Text style={{ marginBottom: 10, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Password was reset successfully</Text>
                                                <Row
                                                    style={{ justifyContent: 'center' }}>
                                                    <Button style={{ width: 150 }}
                                                        onPress={() => this.props.navigator.dismissLightBox()}>
                                                        OK
                                                    </Button>
                                                </Row>
                                            </View>
                                        )
                                }
                            })()}
                            {this.state.error ? <Text style={[Styles.textMedium, Styles.textCenter, { color: pallette.error, marginTop: 10 }]}>{this.state.error}</Text> : null}
                        </View>
                    )}
                </View>
            </View>
        );
    }
};

ForgotPasswordLightbox.propTypes = {};

module.exports = ForgotPasswordLightbox;
