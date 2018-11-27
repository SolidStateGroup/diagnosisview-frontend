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
            activeClassName={"aside__link--active"}
            className="aside__link d-flex align-items-center"
            to={`/admin/codes`
            }><span className="d-flex flex-1">Manage Codes</span> <i className="fas fa-chevron-right float-right"> </i>
          </Link>
          <Link
            id="manage-users-link"
            activeClassName={"aside__link--active"}
            className="aside__link d-flex align-items-center"
            to={
              `/admin/users`
            }><span className="d-flex flex-1">Manage Users</span> <i className="fas fa-chevron-right float-right"> </i></Link>
            <Link
            id="manage-users-link"
            activeClassName={"aside__link--active"}
            className="aside__link d-flex align-items-center"
            to={
              `/admin/links`
            }><span className="d-flex flex-1">URL Transformation</span> <i className="fas fa-chevron-right float-right"> </i></Link>

        </Flex>
      </Flex>
    );
  }
};

TheComponent.propTypes = {};

module.exports = TheComponent;
