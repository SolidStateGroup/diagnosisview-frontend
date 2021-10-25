import PropTypes from 'prop-types';
//Lodash
global._ = require('lodash');

//React Prop Types, todo: move to react-native-globals
window.Any = PropTypes.any;
window.OptionalArray = PropTypes.array;
window.OptionalBool = PropTypes.bool;
window.OptionalFunc = PropTypes.func;
window.OptionalNumber = PropTypes.number;
window.OptionalObject = PropTypes.object;
window.OptionalString = PropTypes.string;
window.OptionalNode = PropTypes.node;
window.OptionalElement = PropTypes.node;
window.oneOf = PropTypes.oneOf;
window.oneOfType = PropTypes.oneOfType;
window.RequiredArray = PropTypes.array.isRequired;
window.RequiredBool = PropTypes.bool.isRequired;
window.RequiredFunc = PropTypes.func.isRequired;
window.RequiredNumber = PropTypes.number.isRequired;
window.RequiredObject = PropTypes.object.isRequired;
window.RequiredString = PropTypes.string.isRequired;
window.RequiredNode = PropTypes.node.isRequired;
window.RequiredElement = PropTypes.node.isRequired;

// import Interactable from 'react-native-interactable';
// global.Interactable = Interactable;

import Animation from 'lottie-react-native';
global.Animation = Animation;

import Navigation from 'react-native-navigation';
global.Navigation = Navigation;

import * as Animatable from 'react-native-animatable';

Animatable.initializeRegistryWithDefinitions({
    basicListEntrance: {
        from: {opacity: 1, ['translateX']: 20},
        to: {opacity: 1, ['translateX']: 0},
    },
    basicListEntranceFade: {
        from: {opacity: 0, ['translateX']: 40},
        to: {opacity: 1, ['translateX']: 0},
    },
    fade: {
        from: {opacity: 0},
        to: {opacity: 1},
    },
});
