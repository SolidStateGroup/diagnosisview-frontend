import React, {Component, PropTypes} from 'react';

const TheComponent = (props)=>(
	<View style={[Styles.divider, props.style]}/>
);

TheComponent.displayName = "TheComponent";

TheComponent.propTypes = {};

module.exports = TheComponent;
