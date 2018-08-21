import React, {Component, PropTypes} from 'react';

const TheComponent = (props)=>(
	<View style={[Styles.formGroup, props.style]}>
		{props.children}
	</View>
);

TheComponent.displayName = "TheComponent";

TheComponent.propTypes = {
	children: OptionalObject
};

module.exports = TheComponent;
