import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';

import App from './components/App'; //App Wrapper
import HomePage from './components/pages/HomePage';
import ManageCodesPage from './components/pages/ManageCodesPage';
import ManageUsersPage from './components/pages/ManageUsersPage';
import ManageLinksPage from './components/pages/ManageLinksPage';
import NotFoundPage from './components/pages/NotFoundPage';


window.Link = Link;


export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomePage}/>

        {/*Examples*/}
        <Route path="admin" component={ManageCodesPage}/>
        <Route path="admin/codes" component={ManageCodesPage}/>
        <Route path="admin/users" component={ManageUsersPage}/>
        <Route path="admin/links" component={ManageLinksPage}/>
        <Route path="login" component={HomePage}/>
        <Route path="signup" component={HomePage}/>
        <Route path="404" component={NotFoundPage}/>
        <Redirect from="*" to="404"/>
    </Route>
);
