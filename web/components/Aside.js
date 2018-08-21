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
          <Row style={{color: '#fff', marginTop: 10}}>
            <img height={34} src={"/images/brand-medium.png"} />
          </Row>
        </div>

        <Flex className="links">
          <Link
            id="manage-codes-link"
            activeClassName={"active"}
            to={`/admin/codes`
            }><span className={"dot green"} />Manage Codes</Link>
          <Link
            id="manage-users-link"
            activeClassName={"active"}
            to={
              `/admin/users`
            }><span className={"dot red"} />Manage Users</Link>
          <a
            id="logout-link"
            onClick={this.logout}
            href='#'
          ><span className={"dot purple"} />Logout</a>
        </Flex>
      </Flex>
    );
  }
};

TheComponent.propTypes = {};

module.exports = TheComponent;
