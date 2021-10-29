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
                                <h1>Privacy Policy</h1>
<p>University of Edinburgh built the DiagnosisView app as a Freemium app. This SERVICE is intended for use as is.</p>

<p>This page is used to inform visitors regarding our policies with the collection, use, and disclosure of personal information if you decide to use our Service.</p>

<p>If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The personal information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.</p>

<h3>Information Collection and Use</h3>

<p>For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to Name, Email Address, Occupation, Educational Institution. The information that we request will be retained by us and used as described in this privacy policy.</p>

<p>The app does use third party services that may collect information used to identify you.</p>

<p>Links to privacy policy of third party service providers used by the app</p>

<ul>
<li><a href="https://www.apple.com/legal/privacy/en-ww/" target="_blank">Apple.com</a></li>
<li><a href="https://www.google.com/policies/privacy/" target="_blank">Google Play Services</a></li>
<li><a href="https://firebase.google.com/policies/analytics" target="_blank">Firebase Analytics</a></li>
</ul>

<h3>Log Data</h3>

<p>We want to inform you that whenever you use our Service, in case of an error in the app we collect data and information (through third party products) from your device called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.</p>

<h3>Cookies</h3>

<p>Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.</p>

<p>This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.</p>

<h3>Service Providers</h3>

<p>We may employ third-party companies and individuals for the following reasons:</p>

<ul>
<li>To facilitate our Service</li>
<li>To provide the Service on our behalf;</li>
<li>To perform Service-related services; or</li>
<li>To assist us in analyzing how our Service is used.</li>
</ul>

<p>These third parties have access to your personal information so that they can perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.</p>

<h3>Security</h3>

<p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p>

<h3>Links to Other Sites</h3>

<p>This Service contains multiple links to other websites. If you click on these links, you will be directed to that site. These external sites are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>

<h3>Children’s Privacy</h3>

<p>These Services do not address anyone under the age of 17. We do not knowingly collect personally identifiable information from children under 17. In the case we discover that a child under 17 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.</p>

<h3>Changes to This Privacy Policy</h3>

<p>We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify registered users of any changes by posting the new Privacy Policy on this page. Changes are effective immediately after they are posted on this page.</p>

<h3>Contact Us</h3>

<p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at Edinburgh Medical School, University of Edinburgh, Old College, South Bridge, Edinburgh, EH8 9YL. The University of Edinburgh is a charitable body, registered in Scotland, with registration number SC005336.</p>
                            </div>
                        </Flex>
                    )}
                </AccountProvider>
            </div>
        );
    }
};
