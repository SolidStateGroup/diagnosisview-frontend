import React, {Component, PropTypes} from 'react';
import Popover from './base/Popover';

const TheComponent = class extends Component {
    displayName: 'TheComponent'

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    logout = () => {
        openConfirm(<h3>Confirm</h3>, <p>Are you sure you wish to logout?</p>, AppActions.logout);
    }

    render() {
        return (
            <Flex className={"header full-width" + (this.props.className || "")}>
                <Row className="nav__links">
                    <div className="brand-container text-center">
                        <Row style={{color: '#fff', paddingLeft:30,paddingRight:30}}>
                            <img height={34} src={"/images/brand-medium.png"}/>
                        </Row>
                    </div>
                    <Link id="manage-codes-link" className="nav__links__link nav__links__link--separator d-flex align-items-center" to={`/dashboard`}>
                        <span className="d-flex flex-1">Regular Dashboard</span>
                    </Link>
                    <Link id="manage-codes-link" className="nav__links__link nav__links__link--separator d-flex align-items-center" to={`/admin/codes`}>
                        <span className="d-flex flex-1">Codes</span>
                    </Link>
                    <Link id="manage-users-link" className="nav__links__link nav__links__link--separator d-flex align-items-center" to={`/admin/users`}>
                        <span className="d-flex flex-1">Users</span></Link>
                    <Link id="manage-users-link" className="nav__links__link nav__links__link--separator d-flex align-items-center" to={`/admin/institutions`}>
                        <span className="d-flex flex-1">Institutions</span></Link>
                    <Link id="manage-link-transforms-link" className="nav__links__link nav__links__link--separator d-flex align-items-center" to={`/admin/link-transforms`}>
                        <span className="d-flex flex-1">Paywall Management</span></Link>
                    <Link id="manage-link-logos-link" className="nav__links__link d-flex align-items-center" to={`/admin/link-logos`}>
                        <span className="d-flex flex-1">Link Logos</span></Link>
                    <div className="ml-auto mr-3">
                        <a id="logout-link" className="nav__links__link nav__links__link--logout d-flex align-items-center" onClick={this.logout}>
                            <span className="d-flex flex-1">Logout <i class="fas fa-sign-out-alt nav__links__link--icon"></i></span>
                        </a>
                    </div>
                </Row>
            </Flex>
        );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;
