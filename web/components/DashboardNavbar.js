import React, {Component}  from 'react';
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import InputGroup from '../components/base/forms/InputGroup'
import { toJSON } from "lodash/seq";

class TheComponent extends Component {
    state = {}

    render() {
        return (
            <AccountProvider onSave={this.props.onRegister}>
                {({error, isLoading}, {clearError}) => (
                    <div className="nav">

                        <Flex/>
                        <Row className="mt-1">
                                <Link to="/dashboard/search" className={'nav__link mr-3'}>
                                    <span className="fa fa-search mr-2"></span>
                                    <strong>
                                        Search Now
                                    </strong>
                                </Link>
                                <Link to="/dashboard/account" className={'mr-3'}>
                                    <span className="fa fa-cog mr-2"></span>
                                    <strong>
                                        Account
                                    </strong>
                                </Link>
                                <a onClick={()=>this.setState({modalOpen:true})} href="#" className={'nav__link mr-3'}>
                                    <strong>
                                        About
                                    </strong>
                                </a>
                            {!AccountStore.hasActiveSubscription() && Constants.webPayments && (
                                <Link to="/dashboard/account">
                                    <Button onClick={()=>this.setState({modalOpen:true})} className={'btn btn--primary nav__button'}>
                                        <span className="nav__button__text">{'Subscribe now'}</span>
                                    </Button>
                                </Link>
                            )}

                        </Row>
                        <Modal
                            isOpen={this.state.modalOpen}
                            toggle={()=>{
                              this.setState({modalOpen:!this.state.modalOpen })
                            }}
                            >
                            <ModalHeader>
                                About DiagnosisView
                            </ModalHeader>
                            <ModalBody>
                                <strong>
                                    DiagnosisView gives healthcare students and practitioners immediate access to selected reliable information on over 1,000 common diagnoses
                                </strong>
                                <ul className="feature-list list-unstyled mt-2">
                                    <li className="mb-2"><img className="icon--list" src="/images/icon-medical--blue.png" alt="Medical circle" /> Info on your own mobile or tablet</li>
                                    <li className="mb-2"><img className="icon--list" src="/images/icon-medical--blue.png" alt="Medical circle" /> Advanced patient info is the starting point (free)</li>
                                    <li className="mb-2"><img className="icon--list" src="/images/icon-medical--blue.png" alt="Medical circle" /> Moving on to practitioner-level and expert-level professional resources</li>
                                    <li className="mb-2"><img className="icon--list" src="/images/icon-medical--blue.png" alt="Medical circle" /> With an optional account you can access professional resources, as well as sync favourites and history across devices.</li>
                                    <li className="mb-2"><img className="icon--list" src="/images/icon-medical--blue.png" alt="Medical circle" /> DiagnosisView help pages and news updates are available <a className="text-light" target="_blank" href="https://blogs.ed.ac.uk/diagnosisview/">here</a></li>
                                </ul>
                            </ModalBody>
                        </Modal>
                    </div>
                )}
            </AccountProvider>
        )
    }
}
import { Link, withRouter } from 'react-router-dom';
import AccountStore from "../../common/stores/account-store";

export default withRouter(TheComponent)
