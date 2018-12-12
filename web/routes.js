import React from 'react';
import { Route, Switch } from 'react-router-dom';

import App from './components/App'; //App Wrapper
import HomePage from './components/pages/HomePage';
import ManageCodesPage from './components/pages/ManageCodesPage';
import ManageUsersPage from './components/pages/ManageUsersPage';
import ManageLinksPage from './components/pages/ManageLinksPage';
import ManageLinkLogosPage from './components/pages/ManageLinkLogosPage';
import DiagnosisDetailPage from './components/pages/DiagnosisDetailPage';
import NotFoundPage from './components/pages/NotFoundPage';

export default (
    <App>
        <Switch>
            <Route path="/" exact component={HomePage}/>
            <Route path="/admin/codes" exact component={ManageCodesPage}/>
            <Route path="/admin/users" exact component={ManageUsersPage}/>
            <Route path="/admin/links" exact component={ManageLinksPage}/>
            <Route path="/admin/link-logos" exact component={ManageLinkLogosPage}/>
            <Route path="/admin/diagnosis" exact component={DiagnosisDetailPage}/>
            <Route path="/admin" component={ManageCodesPage}/>
            <Route path="/login" exact component={HomePage}/>
            <Route path="/signup" exact component={HomePage}/>
            <Route component={NotFoundPage}/>
        </Switch>
    </App>
);
