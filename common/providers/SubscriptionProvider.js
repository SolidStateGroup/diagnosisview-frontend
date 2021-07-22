import React, {Component, PropTypes} from 'react';
import SubscriptionStore from '../stores/subscription-store';

const TheComponent = class extends Component {
	displayName: 'TheComponent'

	constructor(props, context) {
		super(props, context);
		this.state = {
			isLoading: SubscriptionStore.isLoading,
			subscription: SubscriptionStore.isSubscribed()
		};
	}

	componentDidMount() {
		ES6Component(this);
		this.listenTo(SubscriptionStore, 'change', () => {
			this.setState({
				isLoading: SubscriptionStore.isLoading,
				isSaving: SubscriptionStore.isSaving,
				subscription: SubscriptionStore.isSubscribed(),
				error: SubscriptionStore.error,
			});
		});

		this.listenTo(SubscriptionStore, 'loaded', () => {
			// todo?
		})

		this.listenTo(SubscriptionStore, 'problem', () => {
			this.setState({
				isLoading: SubscriptionStore.isLoading,
				isSaving: SubscriptionStore.isSaving,
				error: SubscriptionStore.error
			});
			this.props.onError && this.props.onError(SubscriptionStore.error);
		});
	}

	clearError = () => {
		SubscriptionStore.error = '';
		this.setState({
			error: ''
		});
	};

	render() {
		var {isLoading, subscription, error} = this.state
		return (
			this.props.children({
				isLoading,
				subscription,
				error
			}, {
				clearError: this.clearError
			})
		);
	}
};

TheComponent.propTypes = {};

module.exports = TheComponent;
