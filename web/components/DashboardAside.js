import React, {Component, PropTypes} from 'react';
import Popover from './base/Popover';
import { NavLink } from "react-router-dom";

const links = [
    {name:"User Dashboard", icon:"fa fa-home", to:"/dashboard"},
    {name:"Search", icon:"fa fa-search", to:"/dashboard/search"},
    {name:"History", icon:"fa fa-history", to:"/dashboard/history"},
    {name:"Favourites", icon:"far fa-star", to:"/dashboard/favourites"},
    {name:"Account", icon:"fa fa-cog", to:"/dashboard/account"},
    {name:"Feedback", icon:"far fa-comment", to:"/dashboard/feedback"},
]
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
            <div className="col-md-2 dashboard-aside px-2">
                <Flex>
                    {links.map((l)=>(
                        <NavLink exact activeClassName="active" className="dashboard-aside__link px-2" to={l.to} key={l.to}>
                            <Row>
                                <span className={l.icon + " " + "mr-2"}/>
                                <span className="dashboard-aside__link-text">
                                    {l.name}
                                </span>
                            </Row>
                        </NavLink>
                    ))}
                </Flex>
                <NavLink activeClassName="active" className="dashboard-aside__link px-2" to={"/admin"}>
                    <Row>
                        <span className={"fa fa-user-shield " + "mr-2"}/>
                        <span className="dashboard-aside__link-text">
                            Admin
                        </span>
                    </Row>
                </NavLink>
                <span className="dashboard-aside__link cursor-pointer px-2" onClick={AppActions.logout}>
                    <Row>
                        <span className={"fa fa-sign-out-alt " + "mr-2"}/>
                        <span className="dashboard-aside__link-text">
                            Logout
                        </span>
                    </Row>
                </span>
            </div>
        );
    }
};

TheComponent.propTypes = {};

module.exports = TheComponent;
