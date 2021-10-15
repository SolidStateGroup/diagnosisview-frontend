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
            <div className="padded">
                <AccountProvider onError={() => this.setState({password: ''})}>
                    {({error, isLoading}, {clearError}) => (
                        <Flex>
                            <div>
                                <img className="margin-bottom" src={require('../../images/brand.png')} height="44" />
                                <Link to='/' style={{float: 'right'}}>Back to Home</Link>
                                <h1>Accessibility Statement for the Diagnosis View application</h1>

                                <p>
                                    Application accessibility statement inline with Public Sector Body (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018
                                    This accessibility statement applies to: <a href="https://blogs.ed.ac.uk/diagnosisview/">https://blogs.ed.ac.uk/diagnosisview</a>.
                                </p>

                                <p>
                                    This application is run by the Business School at the University of Edinburgh. We want as many people as possible to be able to use this application. For example, that means you should be able to:
                                    <li>magnify contents using appropriate mobile device settings;</li>
                                    <li>using your device settings, invert colours and contrast levels;</li>
                                    <li>utilise tooltips throughout the application</li>
                                    <li>use the application without encountering any time limits.</li>
                                </p>
                                <p>
                                    We’ve also made the application text as simple as possible to understand.
                                </p>
                                <h4>
                                    Customising the application
                                </h4>
                                <p>
                                    AbilityNet has advice on making your device easier to use if you have a disability. This is an external site with suggestions to make your computer more accessible:
                                    AbilityNet - My Computer My Way
                                    With a few simple steps you can customise the appearance of our website using your browser settings to make it easier to read and navigate:
                                    Additional information on how to customise our website appearance
                                    If you are a member of University staff or a student, you can use the free SensusAccess accessible document conversion service:
                                    Information on SensusAccess
                                </p>
                                <h4>
                                    How accessible this application is
                                </h4>
                                <p>
                                    We know some parts of this application are not fully accessible:
                                    <li>mobile device screen reader technology is not always compatible with the application;</li>
                                    <li>alternative text is not present on all non-text content;</li>
                                    <li>portrait orientation is mandatory;</li>
                                    <li>colour contrasts do not necessarily meet the recommended Web Content Accessibility Guidelines 2.1 AA standard;</li>
                                    <li>certain headings use continuous capitals and italicisation;</li>
                                    <li>there is no in-built spellchecker.</li>
                                </p>
                                <h4>Feedback and contact information</h4>
                                <p>
                                    If you need information on this application in a different format, including accessible PDF, large print, audio recording or braille:
                                    <li>email <a href="mailto:diagnosisview@ed.ac.uk">diagnosisview@ed.ac.uk</a></li>
                                    <li>telephone</li>
                                    <li>British Sign Language (BSL) users can contact us via contactSCOTLAND-BSL, the on-line BSL interpreting service.</li>
                                    We will consider your request and get back to you in 5 working days.
                                </p>
                                <h4>
                                    Reporting accessibility problems with this application
                                </h4>
                                <p>
                                    We are always looking to improve the accessibility of this application. If you find any problems not listed on this page, or think we’re not meeting accessibility requirements, please contact:
                                    <li>email <a href="mailto:diagnosisview@ed.ac.uk">diagnosisview@ed.ac.uk</a></li>
                                    <li>telephone</li>
                                    <li>British Sign Language (BSL) users can contact us via contactSCOTLAND-BSL, the on-line BSL interpreting service.</li>
                                    We will consider your request and get back to you in 5 working days.
                                </p>
                                <h4>
                                    Enforcement procedure
                                </h4>
                                <p>
                                    The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the ‘accessibility regulations’). If you’re not happy with how we respond to your complaint please contact the Equality Advisory and Support Service (EASS) directly:
                                    Contact details for the Equality Advisory and Support Service (EASS)
                                    The government has produced information on how to report accessibility issues:
                                    Reporting an accessibility problem on a public sector website
                                    Contacting us by phone using British Sign Language
                                </p>

                                <h4>
                                    British Sign Language service
                                </h4>
                                <p>
                                    contactSCOTLAND-BSL runs a service for British Sign Language users and all of Scotland’s public bodies using video relay. This enables sign language users to contact public bodies and vice versa. The service operates 24 hours a day, 7 days a week:
                                </p>
                                <p>
                                    contactSCOTLAND-BSL service details
                                </p>
                                <h4>
                                    Technical information about this application’s accessibility
                                </h4>
                                <p>

                                </p>
                                The University of Edinburgh is committed to making its websites and applications accessible, in accordance with the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018.
                                This application is partially compliant with the Web Content Accessibility Guidelines (WCAG) 2.1 AA standard, due to the non-compliances listed below.
                                The full guidelines are available at:
                                Web Content Accessibility Guidelines (WCAG) 2.1 AA standard
                                <h4>
                                    Non accessible content
                                </h4>
                                <p>
                                    The content listed below is non-accessible for the following reasons.
                                </p>

                                <h4>
                                    Noncompliance with the accessibility regulations
                                </h4>
                                <p>
                                    The following items to not comply with the WCAG 2.1 AA success criteria:
                                    <li>Not all non-text content presented to users has alternative text</li>
                                    <li>1.1.1 - Non-text Content</li>
                                    <li>The way the content is presented affects its meaning, and a correct reading sequence is not programmatically determined</li>
                                    <li>1.3.2 - Meaningful Sequence</li>
                                    <li>Content is restricted to view and operation in a single display orientation, namely portrait and not landscape</li>
                                    <li>1.3.4 - Orientation</li>
                                    <li>Not all user interface components, including icons and regions, can be correctly identified or labelled</li>
                                    <li>1.3.6 - Identify Input Purpose</li>
                                    <li>There may not be sufficient colour contrast between font and background colours, especially where the text size is small</li>
                                    <li>1.4.3 - Contrast (Minimum)</li>
                                    <li>Text can not always be resized without use of assistive technology</li>
                                    <li>1.4.4 - Resize text</li>
                                    <li>Information is conveyed as an image of text rather than as text itself, making it not compatible with screen readers and other assistive technology</li>
                                    <li>1.4.5 - Images of text</li>
                                    <li>Not all headings and labels necessarily describe the page topic or purpose</li>
                                    <li>2.4.6 - Headings and Labels</li>
                                    <li>Mobile screen reader assistive technology can not help users to interact with the application</li>
                                    <li>4.1.1 - Parsing</li>
                                    Unless specified otherwise, a complete solution, or significant improvement, will be in place for those items within our control by February 2022.
                                </p>
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
                                    We will continue to address the accessibility issues highlighted to deliver a solution or suitable workaround. Unless specified otherwise, a complete solution or significant improvement will be in place for those items within our control by February 2022.
                                    While we are in the process of resolving these accessibility issues, or where we are unable, we will ensure reasonable adjustments are in place to make sure no user is disadvantaged. As changes are made, we will continue to review accessibility and retest the accessibility of this application.
                                    Preparation of this accessibility statement
                                    This statement was prepared on 4th August 2021. It was last reviewed on 4th August 2021.

                                    This application was last tested on 20th July 2021 and carried out by the developers, Solid State, and Diagnosis View team within the Edinburgh Medical School at the University of Edinburgh, using iOS and Android mobile devices. Further testing is required to be undertaken by the Edinburgh Medical School in due course.
                                    The application could not be processed through an automated accessibility testing system, including WAVE WebAIM, as an initial step, due to it sitting behind a log-in screen. While it is important to recognise the limitations of solely using automated testing, this method provides a breadth and variety to manual testing.
                                    We tested:
                                    <li>Spellcheck functionality;</li>
                                    <li>Scaling using different resolutions and reflow;</li>
                                    <li>Options to customise the interface (magnification, font, background colour et. cetera);</li>
                                    <li>Keyboard navigation and keyboard traps;</li>
                                    <li>Data validation;</li>
                                    <li>Warning of links opening in a new tab or window;</li>
                                    <li>Information conveyed in colour or sound only;</li>
                                    <li>Flashing, moving or scrolling text;</li>
                                    <li>Use with screen reading software (TalkBack and VoiceOver);</li>
                                    <li>Accessibility features of the Android and iOS devices;</li>
                                    <li>Tooltips and text alternatives for any non-text content;</li>
                                    <li>Time limits.</li>
                                </p>

                            </div>
                        </Flex>
                    )}
                </AccountProvider>
            </div>
        );
    }
};
