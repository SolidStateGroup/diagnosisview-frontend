import React from 'react';
import { Component } from 'react';
import FeedbackModal from "./FeedbackModal";

class TheComponent extends Component {
    state = {}

    render() {
        const {withoutImage} = this.props;
        return (
            <div>
                {!withoutImage &&(
                    <div>
                        <img className="margin-bottom" src={require('../images/brand.png')} height="44" />
                    </div>
                )}

                <h4>About</h4>
                <p>
                    DiagnosisView gives healthcare students and practitioners immediate access to selected reliable information on over 1,000 common diagnoses
                </p>
                <ul className="mt-2 list-unstyled">
                    <li className="mb-2"><span className="text-success mr-2 fa fa-check-circle"/>Info on all of your devices</li>
                    <li className="mb-2"><span className="text-success mr-2 fa fa-check-circle"/>Advanced patient info is the starting point (free)</li>
                    <li className="mb-2"><span className="text-success mr-2 fa fa-check-circle"/>Moving on to practitioner-level and expert-level professional resources</li>
                    <li className="mb-2"><span className="text-success mr-2 fa fa-check-circle"/>With an optional account you can access professional resources, as well as sync favourites and history across devices</li>
                    <li className="mb-2"><span className="text-success mr-2 fa fa-check-circle"/>See <a href="https://blogs.ed.ac.uk/diagnosisview">blogs.ed.ac.uk/diagnosisview</a> for latest news and a more detailed guide for users, and about joining as an institution</li>
                </ul>
                <div className="section row p-md-5 flex align-items-center">
                    <div className="col-md-5 col-sm-8 col-xs-12">
                        <div className="panel--white mx-md-4">
                            <div className="justify-content-center text-center">
                                <div>
                                    <img src="../../images/uoe-icon.jpeg" width="100px" />
                                </div>
                                <div className="mt-2 text-center">
                                    DiagnosisView was developed by <a className="font-weight-bold link-dark" href="https://www.ed.ac.uk" target="_blank">The University of Edinburgh</a> <a className="font-weight-bold link-dark" href="https://www.ed.ac.uk/medicine-vet-medicine/edinburgh-medical-school" target="_blank">Medical School</a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default TheComponent
