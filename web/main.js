import './project/polyfil';
import './project/libs';
import './project/api';
import './project/project-components';
import './styles/styles.scss';
import ToastMessages from './project/toast';
import { BrowserRouter as Router } from 'react-router-dom';
import routes from './routes';
window.Project = require('../common/project');
window.Utils = require('../common/utils/utils');
window.Constants = require('../common/constants');

window.openModal = require('./project/modals').openModal;
window.openConfirm = require('./project/modals').openConfirm;

import AccountStore from '../common/stores/account-store';

const rootElement = document.getElementById('app');

// Render the React application to the DOM
AsyncStorage.getItem("user", (err,res)=>{
    if (res){
        AppActions.setUser(JSON.parse(res));
    }

    setTimeout(() => {
        ReactDOM.render(
            <Router>{routes}</Router>,
            rootElement
        );
    },1)


});

//Setup for toast messages
ReactDOM.render(<ToastMessages />, document.getElementById('toast'));
