import React, {Component, PropTypes} from 'react';
import * as Animatable from 'react-native-animatable';

const TheComponent = class extends Component {
	displayName: 'TheComponent'

	constructor(props, context) {
		super(props)
		this.state = {};
	}

	render() {
		var content = (
			<View>
				<Row>
					{this.props.icon}
					<View
						style={[this.props.disabled && Styles.listItemDisabled, Styles.liContent, {backgroundColor: 'transparent'}]}>
						{this.props.children}
					</View>
				</Row>
			</View>
		);
		const animationProps = Object.assign(this.props.animationProps, {
			delay: this.props.delay + 10 + ((Number(this.props.index || 0)) * 20),
		})
		return (
			this.props.onPress ? (
				<Animatable.View
					style={this.props.style || Styles.listItem}
					{...this.props.animationProps}
				>
					{
						Platform.OS == "android" ? (
							<TouchableNativeFeedback
								onPress={this.props.disabled ? null : this.props.onPress}
								background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
								{content}
							</TouchableNativeFeedback>
						) : (
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={this.props.disabled ? null : this.props.onPress}>
								{content}
							</TouchableOpacity>
						)
					}
				</Animatable.View>
			) : (
				<Animatable.View
					{...this.props.animationProps}
					style={[this.props.style || Styles.listItem]}>{content}</Animatable.View>
			)
		);
	}
};
TheComponent.defaultProps = {
	onPress: null,
	text: null,
	delay: 0,
	animationProps: {
		animation: 'basicListEntrance',
		duration: 250,
		easing: 'ease-out-quart',
	},
	underlayColor: colour.inputBackground,
}
module.exports = TheComponent;
