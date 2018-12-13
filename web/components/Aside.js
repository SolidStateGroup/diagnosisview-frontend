import React, { Component, PropTypes } from 'react';
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
      <Flex className={"aside " + (this.props.className || "")}>
        <div className="brand-container text-center">
          <Row style={{color: '#fff', marginTop: 15}}>
            <img height={34} src={"/images/brand-medium.png"} />
          </Row>
        </div>

        <Flex className="links">
          <Link
            id="manage-codes-link"
            className="aside__link d-flex align-items-center"
            to={`/admin/codes`
            }><span className="d-flex flex-1">Manage Codes</span> <i className="fas fa-chevron-right float-right"> </i>
          </Link>
          <Link
            id="manage-users-link"
            className="aside__link d-flex align-items-center"
            to={
              `/admin/users`
            }><span className="d-flex flex-1">Manage Users</span> <i className="fas fa-chevron-right float-right"> </i></Link>
            <Link
            id="manage-link-transforms-link"
            className="aside__link d-flex align-items-center"
            to={
              `/admin/link-transforms`
            }><span className="d-flex flex-1">URL Transformation</span> <i className="fas fa-chevron-right float-right"> </i></Link>
            <Link
            id="manage-link-logos-link"
            className="aside__link d-flex align-items-center"
            to={
              `/admin/link-logos`
            }><span className="d-flex flex-1">Manage Link Logos</span> <i className="fas fa-chevron-right float-right"> </i></Link>
            <a
            id="logout-link"
            className="aside__link d-flex align-items-center"
            onClick={this.logout}><span className="d-flex flex-1">Logout</span> <i className="fas fa-chevron-right float-right"> </i></a>

        </Flex>
      </Flex>
    );
  }
};

TheComponent.propTypes = {};

module.exports = TheComponent;
