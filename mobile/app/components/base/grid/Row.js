import React, {Component, PropTypes} from 'react';

const TheComponent = (props)=>(
	<View style={[Styles.row, props.space && {justifyContent: 'space-between'}, props.style]}>
		{props.children}
	</View>
);

TheComponent.displayName = "TheComponent";

TheComponent.propTypes = {
	children: OptionalObject
};

module.exports = TheComponent;
