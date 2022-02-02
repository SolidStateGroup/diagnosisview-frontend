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
                                <Link to="/dashboard/about" className={'nav__link mr-3'}>
                                    <strong>
                                        About
                                    </strong>
                                </Link>
                            {!AccountStore.hasActiveSubscription() && Constants.webPayments && (
                                <Link to="/dashboard/account?manage=1">
                                    <Button onClick={()=>this.setState({modalOpen:true})} className={'btn btn--primary nav__button'}>
                                        <span className="nav__button__text">{'Subscribe now'}</span>
                                    </Button>
                                </Link>
                            )}

                        </Row>
                    </div>
                )}
            </AccountProvider>
        )
    }
}
import { Link, withRouter } from 'react-router-dom';
import AccountStore from "../../common/stores/account-store";

export default withRouter(TheComponent)
