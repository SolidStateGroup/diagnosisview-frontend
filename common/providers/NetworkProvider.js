import NetworkStore from '../stores/network-store';

import React, {Component, PropTypes} from 'react';

const TheComponent = class extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			isConnected: NetworkStore.isConnected,
			isDBDown: NetworkStore.isDBDown
		};

		ES6Component(this);
	}

	componentWillMount() {
		this.listenTo(NetworkStore, 'change', () => {
			this.setState({
				isConnected: NetworkStore.isConnected,
				isDBDown: NetworkStore.isDBDown
			});
		})
	}

	render() {
		const {isConnected, isDBDown} = this.state;
		return this.props.children(isConnected, isDBDown);
	}
};

TheComponent.propTypes = {};
module.exports = TheComponent;
