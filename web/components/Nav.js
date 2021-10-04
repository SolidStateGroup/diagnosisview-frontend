import React, {Component, PropTypes} from 'react';
import Popover from './base/Popover';


const NavLink = ({to, onClick, children}) => {
    return to? (
        <Link to={to} onClick={onClick} className="sidebar__link">
            {children}
        </Link>
    ): (
        <span onClick={onClick} className="sidebar__link">
            {
                children
            }
        </span>
    )
}

export default TheComponent
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
            <div className="col-md-3 col-lg-2 d-md-block sidebar collapse">
                <Flex>

                </Flex>
                <NavLink onClick={AppActions.logout}>
                    Logout
                </NavLink>
            </div>
        );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;
