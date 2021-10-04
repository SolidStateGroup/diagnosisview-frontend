import 'react-native-globals'; //Adds <View etc to global scope

global.Project = require('../../../common/project');

require('./polyfill');
require('./api');
require('../style/style_screen');
require('./base-components');
require('./project-components');
global.AjaxHandler = require('../../../common/ajax-handler');

import ION from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
global.FontAwesome = FontAwesome;
global.ION = ION;
global.MaterialIcon = MaterialIcon;

import Constants from '../../../common/constants';
import MobileConstants from '../project/constants';
import Utils from '../../../common/utils/utils';
import Format from '../../../common/utils/format';
global.Constants = Object.assign({}, Constants, MobileConstants);
global.Utils = Utils;
global.Format = Format;

//Flux dispatcher
import ES6Component from '../../../common/ES6Component';
import Dispatcher from '../../../common/dispatcher/dispatcher';
import AppActions from '../../../common/dispatcher/app-actions';
import Actions from '../../../common/dispatcher/action-constants';

global.Dispatcher = Dispatcher;
global.ES6Component = ES6Component;
global.AppActions = AppActions;
global.Actions = Actions;

import LinearGradient from 'react-native-linear-gradient';
global.LinearGradient = LinearGradient;

import * as RNIap from 'react-native-iap';
global.RNIap = RNIap;

import DeviceInfo from 'react-native-device-info';
global.DeviceInfo = DeviceInfo;
global.iapItemSkus = ['annual_account'];

global.moment = require('moment');

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
global.KeyboardAwareScrollView = KeyboardAwareScrollView;

import Hyperlink from 'react-native-hyperlink';
global.Hyperlink = Hyperlink;

import AutoHeightImage from 'react-native-auto-height-image';
global.AutoHeightImage = AutoHeightImage;

import { Dropdown } from 'react-native-material-dropdown';
global.Dropdown = Dropdown;

import CodeInput from 'react-native-confirmation-code-input';
global.CodeInput = CodeInput;

import ViewOverflow from 'react-native-view-overflow';
global.ViewOverflow = ViewOverflow;
