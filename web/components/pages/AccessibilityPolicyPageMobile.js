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
                            </div><div>
                            <h1>Accessibility Statement for the <a href="https://blogs.ed.ac.uk/diagnosisview/" target="_blank">Diagnosis View application - mobile app</a></h1>    <p>

                            Application accessibility statement in line with Public Sector Body (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018</p>

                            <p>
                                This accessibility statement applies to the DiagnosisView app described at
                                <a href="https://blogs.ed.ac.uk/diagnosisview/">https://blogs.ed.ac.uk/diagnosisview/</a> and available from the Apple App Store, and the Google Play Store.
                            </p>

                            <p>
                                The application has been created by the Medical School at the University of Edinburgh. We want as many people as possible to be able to use it. For example, that means you should be able to:
                            </p>

                            <li>magnify contents using appropriate device settings;</li>
                            <li>using your device settings, invert colours and contrast levels;</li>
                            <li>utilise tooltips throughout the application</li>
                            <li>use the application without encountering any time limits.</li>
                            <p>
                                We’ve also made the application text as simple as possible to understand.
                            </p>
                            <h4>
                                Customising the application
                            </h4>
                            <p>
                                AbilityNet has advice on making your device easier to use if you have a disability. This is an external site with suggestions to make your computer more accessible:    </p>

                            <a href="https://mcmw.abilitynet.org.uk/" target="_blank">
                                AbilityNet - My Computer My Way
                            </a>
                            <h4>
                                How accessible this application is
                            </h4>
                            <p>We know some parts of this application do not fully comply with all elements of recommendations:</p><li>mobile device screen reader technology is not always fully compatible with the application;</li>
                            <li>alternative text is not present on all non-text content;</li>
                            <li>portrait orientation is mandatory;</li>
                            <li>colour contrasts do not necessarily meet the recommended Web Content Accessibility Guidelines 2.1 AA standard;</li>
                            <li>certain headings use continuous capitals and italicisation;</li>
                            <p></p>
                            <h4>Feedback and contact information</h4>
                            <p>
                                If you need information on this application in a different format, including accessible PDF, large print, audio recording or braille:
                            </p><li>email <a href="mailto:diagnosisview@ed.ac.uk">diagnosisview@ed.ac.uk</a></li>
                            <li>British Sign Language (BSL) users can contact us via <a href="https://contactscotland-bsl.org/" target="_blank">contactSCOTLAND-BSL</a>, the on-line BSL interpreting service.</li><p></p><p>
                            We will consider your request and get back to you in 5 working days.
                        </p>
                            <h4>
                                Reporting accessibility problems with this application
                            </h4>
                            <p>
                                We are always looking to improve the accessibility of this application. If you find any problems not listed on this page, or think we’re not meeting accessibility requirements, please contact:
                            </p><li>email <a href="mailto:diagnosisview@ed.ac.uk">diagnosisview@ed.ac.uk</a></li>
                            <li>British Sign Language (BSL) users can contact us via <a href="https://contactscotland-bsl.org/" target="_blank">contactSCOTLAND-BSL</a>, the on-line BSL interpreting service.</li>
                            <p></p><p>
                            We will consider your request and get back to you in 5 working days.
                        </p>

                            <h4>
                                Enforcement procedure
                            </h4>
                            <p>
                                The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the ‘accessibility regulations’). If you’re not happy with how we respond to your complaint please contact the Equality Advisory and Support Service (EASS) directly:</p><p>
                            <a href="https://www.equalityadvisoryservice.com/" target="_blank">Contact details for the Equality Advisory and Support Service (EASS)</a></p>
                            The government has produced information on how to report accessibility issues: <p>
                            <a href="https://www.gov.uk/reporting-accessibility-problem-public-sector-website" target="_blank">Reporting an accessibility problem on a public sector website</a></p>
                            <p></p>

                            <p>
                                Contacting us by phone using British Sign Language
                            </p>
                            <p>
                                contactSCOTLAND-BSL runs a service for British Sign Language users and all of Scotland’s public bodies using video relay. This enables sign language users to contact public bodies and vice versa. The service operates 24 hours a day, 7 days a week:
                            </p>
                            <p>
                                <a href="https://contactscotland-bsl.org/" target="_blank">contactSCOTLAND-BSL service details</a>
                            </p>
                            <h4>
                                Technical information about this application’s accessibility
                            </h4>
                            <p>

                            </p><p>
                            The University of Edinburgh is committed to making its websites and applications accessible, in accordance with the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018.</p><p>
                            This application is partially compliant with the Web Content Accessibility Guidelines (WCAG) 2.1 AA standard, due to the non-compliances listed below. </p><p>
                            The full guidelines are available at: </p><p>
                            <a href="https://www.w3.org/TR/WCAG21/" target="_blank">Web Content Accessibility Guidelines (WCAG) 2.1 AA standard</a></p>
                            <h4>
                                Non accessible content
                            </h4>
                            <p>
                                The content listed below is non-accessible for the following reasons.
                            </p>

                            <p>
                                Noncompliance with the accessibility regulations
                            </p>
                            <p>
                                The following items to not comply with the WCAG 2.1 AA success criteria:
                            </p><li>Not all non-text content presented to users has alternative text</li>
                            <li>
                                <a href="https://www.w3.org/TR/WCAG21/#non-text-content" target="_blank">1.1.1 - Non-text Content</a>
                            </li>
                            <li>The way the content is presented affects its meaning, and a correct reading sequence is not programmatically determined</li>
                            <li>
                                <a href="https://www.w3.org/TR/WCAG21/#meaningful-sequence" target="_blank">1.3.2 - Meaningful Sequence</a>
                            </li>
                            <li>Not all user interface components, including icons and regions, can be correctly identified or labelled</li>
                            <li>
                                <a href="https://www.w3.org/TR/WCAG21/#orientation" target="_blank">1.3.4 - Orientation</a>
                            </li>
                            <li>Not all user interface components, including icons and regions, can be correctly identified or labelled</li>

                            <li>
                                <a href="https://www.w3.org/TR/WCAG21/#identify-input-purpose" target="_blank">1.3.6 - Identify Input Purpose</a>
                            </li>
                            <li>There may not be sufficient colour contrast between font and background colours, especially where the text size is small</li>
                            <li>
                                <a href="https://www.w3.org/TR/WCAG21/#contrast-minimum" target="_blank">1.4.3 - Contrast (Minimum)</a>
                            </li>
                            <li>Text can not always be resized without use of assistive technology</li>
                            <li>
                                <a href="https://www.w3.org/TR/WCAG21/#resize-text" target="_blank">1.4.4 - Resize text</a>
                            </li>
                            <li>Information is conveyed as an image of text rather than as text itself, making it not compatible with screen readers and other assistive technology</li>
                            <li>
                                <a href="https://www.w3.org/TR/WCAG21/#images-of-text" target="_blank">1.4.5 - Images of text</a>
                            </li>
                            <li>Not all headings and labels necessarily describe the page topic or purpose</li>
                            <li>
                                <a href="https://www.w3.org/TR/WCAG21/#headings-and-labels" target="_blank">2.4.6 - Headings and Labels</a>
                            </li>
                            <li>Screen reader assistive technology can not help users to interact with the application</li>
                            <li>
                                <a href="https://www.w3.org/TR/WCAG21/#parsing" target="_blank">4.1.1 - Parsing</a>
                            </li>
                            Unless specified otherwise, a complete solution, or significant improvement, will be in place for those items within our control by May 2022.
                            <p></p>
                            <h4>
                                Disproportionate burden
                            </h4>
                            <p>
                                We are not currently claiming that any accessibility problems would be a disproportionate burden to fix.
                            </p>
                            <h4>
                                Content that’s not within the scope of the accessibility regulations
                            </h4>
                            <p>
                                At this time, we do not believe that any content is outside the scope of the accessibility regulations.
                            </p>
                            <h4>
                                What we’re doing to improve accessibility
                            </h4>
                            <p>
                                We will continue to address the accessibility issues highlighted to deliver a solution or suitable workaround. Unless specified otherwise, a complete solution or significant improvement will be in place for those items within our control by May 2022. </p><p>
                            While we are in the process of resolving these accessibility issues, or where we are unable, we will ensure reasonable adjustments are in place to make sure no user is disadvantaged. As changes are made, we will continue to review accessibility and retest the accessibility of this application.    </p>
                            <h4>
                                Preparation of this accessibility statement
                            </h4>
                            <p>
                                This statement was prepared on 4th November 2021. It was last reviewed on 4th November 2021.</p><p>This application was last tested on November 11th 2021 by the developers, Solid State, and the DiagnosisView team within the Edinburgh Medical School at the University of Edinburgh, using iOS and Android mobile devices. Further testing is required to be undertaken by the Edinburgh Medical School in due course.
                        </p>
                            <p>
                                We tested:
                            </p>
                            <li>
                                Spellcheck functionality;
                            </li>
                            <li>
                                Scaling using different resolutions and reflow;
                            </li>
                            <li>
                                Options to customise the interface (magnification, font, background colour et. cetera);
                            </li>
                            <li>
                                Keyboard navigation and keyboard traps;
                            </li>
                            <li>
                                Data validation;
                            </li>
                            <li>
                                Warning of links opening in a new tab or window;
                            </li>
                            <li>
                                Information conveyed in colour or sound only;
                            </li>
                            <li>
                                Flashing, moving or scrolling text;
                            </li>
                            <li>
                                Use with screen reading software (TalkBack and VoiceOver);
                            </li>
                            <li>
                                Accessibility features of the Android and iOS devices;
                            </li>
                            <li>
                                Tooltips and text alternatives for any non-text content;
                            </li>
                            <li>
                                Time limits.
                            </li>
                        </div>
                        </Flex>
                    )}
                </AccountProvider>
            </div>
        );
    }
};
