import React, {Component, PropTypes} from 'react';

const TheComponent = class extends Component {
	displayName: 'TheComponent'

	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

	render() {
		const {size} = this.props;
		return (
			<View style={[{
				width: size,
				height: size,
				borderRadius: size / 2
			}, Styles.notificationBubble, this.props.style]}>
				{typeof this.props.children == "string" ? (
					<Text style={Styles.notificationBubbleText}>{this.props.children}</Text>
				) : this.props.children}
			</View>
		);
	}
};

TheComponent.defaultProps = {
	size: 16
};
TheComponent.propTypes = {};

module.exports = TheComponent;
