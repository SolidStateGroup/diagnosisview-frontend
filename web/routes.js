import React from 'react';
import { Route, Switch } from 'react-router-dom';

import App from './components/App'; //App Wrapper
import HomePage from './components/pages/HomePage';
import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage';
import ManageCodesPage from './components/pages/ManageCodesPage';
import ManageUsersPage from './components/pages/ManageUsersPage';
import InstitutionsPage from './components/pages/InstitutionsPage';
import ManageLinkTransformsPage from './components/pages/ManageLinkTransformsPage';
import TermsOfUsePage from './components/pages/TermsOfUsePage';
import ManageLinkLogosPage from './components/pages/ManageLinkLogosPage';
import DiagnosisDetailPage from './components/pages/DiagnosisDetailPage';
import NotFoundPage from './components/pages/NotFoundPage';
import DashboardPage from "./components/pages/DashboardPage";
import SearchPage from "./components/pages/SearchPage";
import DashboardAccountPage from "./components/pages/DashboardAccountPage";
import DashboardSearchPage from "./components/pages/DashboardSearchPage";
import DashboardHistoryPage from "./components/pages/DashboardHistoryPage";
import DashboardFavouritesPage from "./components/pages/DashboardFavouritesPage";
import DashboardFeedbackPage from "./components/pages/DashboardFeedbackPage";

export default (
    <App>
        <Switch>
            <Route path="/" exact component={HomePage}/>
            <Route path="/dashboard" exact component={DashboardPage}/>
            <Route path="/dashboard/account" exact component={DashboardAccountPage}/>
            <Route path="/dashboard/search" exact component={DashboardSearchPage}/>
            <Route path="/dashboard/history" exact component={DashboardHistoryPage}/>
            <Route path="/dashboard/favourites" exact component={DashboardFavouritesPage}/>
            <Route path="/dashboard/feedback" exact component={DashboardFeedbackPage}/>
            <Route path="/admin/codes" exact component={ManageCodesPage}/>
            <Route path="/admin/users" exact component={ManageUsersPage}/>
            <Route path="/admin/institutions" exact component={InstitutionsPage}/>
            <Route path="/admin/link-transforms" exact component={ManageLinkTransformsPage}/>
            <Route path="/admin/link-logos" exact component={ManageLinkLogosPage}/>
            <Route path="/admin/diagnosis" exact component={DiagnosisDetailPage}/>
            <Route path="/admin" component={ManageCodesPage}/>
            <Route path="/login" exact component={HomePage}/>
            <Route path="/signup" exact component={HomePage}/>
            <Route path="/search" exact component={SearchPage}/>
            <Route path="/terms-of-use" exact component={TermsOfUsePage}/>
            <Route path="/privacy-policy" exact component={PrivacyPolicyPage}/>
            <Route component={NotFoundPage}/>
        </Switch>
    </App>
);
