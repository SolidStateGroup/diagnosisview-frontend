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
                                    <h1>DiagnosisView Privacy policy</h1>
                                    <p>
                                        ANT v1.0 03 Nov 2021
                                    </p>
                                    <h4>
                                        Why we collect your information
                                    </h4>
                                    <p>
                                        We use your personal details to provide you with information, products or
                                        services that you request. </p> <p>
                                    This could be as part of the registration process, or in response to you contacting
                                    us. </p> <p>
                                    The relevant legal basis is usually through legitimate interests but at times we may
                                    explicitly seek consent.

                                </p>
                                    <h4>
                                        What data we hold about you
                                    </h4>
                                    <p>
                                        DiagnosisView stores
                                    </p>
                                    <ul>
                                        <li>
                                            Your full name
                                        </li>
                                        <li>
                                            Your email address
                                        </li>
                                        <li>
                                            The institution you identify as belonging to, in order to offer tailored
                                            links and proxy servers to deliver paywalled resources via your
                                            institutional login
                                        </li>
                                        <li>
                                            Your broad role (e.g. student, professional), in order to understand who is
                                            using our services.
                                        </li>
                                    </ul>
                                    <p></p>
                                    <h4>
                                        Ways we contact you
                                    </h4>
                                    <p>
                                        We may contact you by the email address you have given us, or other method you
                                        offer in messaging, with important information about the functionality of the
                                        service. With additional consent we may offer non-essential updates and news.
                                    </p>

                                    <h4>
                                        Storing your information
                                    </h4>
                                    <p>
                                        Personal data is stored on Amazon Web Services servers.
                                    </p>
                                    <h4>
                                        How we use your information
                                    </h4>
                                    <p>
                                        Your personal details can be used to provide you with information, products or
                                        services as well as helping us tailor the website to your preferences. </p><p>We
                                    use your information to:</p>
                                    <ul>
                                        <li>
                                            ensure that content from the website is presented in the most effective
                                            manner for you and for your computer
                                        </li>
                                        <li>
                                            In order to administer, support, improve and develop the website we do
                                            analyse some information we collect during your visit to our website.
                                        </li>
                                        <li>
                                            notify you about changes to our service
                                        </li>
                                    </ul>
                                    For additional information on the University's approach to data protection, your
                                    rights and the legal basis for contract and consent see our legal information pages
                                    <p>
                                        <a href="https://www.ed.ac.uk/about/website/privacy/legal-information">
                                            Legal information
                                        </a></p>
                                    <p></p>

                                    <h4>
                                        Automated processing and profiling
                                    </h4>
                                    <p>
                                        We do not use profiling or automated decision-making processes.

                                    </p>

                                    <h4>
                                        Storage of your information
                                    </h4>
                                    <p>
                                        Your information is securely transmitted via our website. Once we have received
                                        your information, we will also use strict procedures and security features to
                                        prevent unauthorised access. </p>
                                    <p>

                                        How long we keep your data depends on the purpose for which the information was
                                        supplied and the active duration of the DiagnosisView system.
                                    </p>
                                    <h4>
                                        Passwords
                                    </h4>
                                    <p>
                                        Where we have given you (or where you have chosen) a password to access certain
                                        parts of the website, you are responsible for keeping this password safe and
                                        confidential. You must not share a password with anyone.
                                    </p>
                                    <h4>
                                        Online transactions
                                    </h4>
                                    <p>
                                        All payment transactions will be encrypted. </p><p>

                                    Areas of the website that process online transactions make use of - and transfer
                                    data to - third party software and service providers. All third-party software and
                                    service providers that we use are compliant with the relevant Payment Card Industry
                                    standards.
                                </p>
                                    <p>
                                        <a href="https://www.pcisecuritystandards.org/">
                                            Payment card data security standards
                                        </a>
                                    </p>
                                    <h4>
                                        Disclosure of your information
                                    </h4>
                                    <p>
                                        We will not share, sell or distribute any of the information you provide to us
                                        without your consent, except where disclosure is:
                                    </p>
                                    <ul>
                                        <li>
                                            necessary to enforce our rights, including under our website Terms and
                                            Conditions of use
                                        </li>
                                        <li>
                                            necessary to enforce our rights under any other Terms and Conditions of use
                                            or Terms and Conditions of sale of the University or any of its schools,
                                            colleges or departments
                                        </li>
                                        <li>
                                            required or permitted by law
                                        </li>
                                    </ul>
                                    <a href="https://www.ed.ac.uk/about/website/website-terms-conditions/">
                                        Read more about our website Terms and Conditions of use
                                    </a>
                                    <p></p>
                            </div>
                        </Flex>
                    )}
                </AccountProvider>
            </div>
        );
    }
};
