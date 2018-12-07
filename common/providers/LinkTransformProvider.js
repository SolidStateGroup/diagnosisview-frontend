import React, {Component, PropTypes} from 'react';
import LinkTransformStore from '../stores/link-transform-store';

const TheComponent = class extends Component {
	displayName: 'TheComponent'

	constructor(props, context) {
		super(props, context);
		this.state = {
			isLoading: LinkTransformStore.isLoading,
			linkTransforms: LinkTransformStore.getTransforms()
		};
	}

	componentDidMount() {
		ES6Component(this);
		this.listenTo(LinkTransformStore, 'change', () => {
			this.setState({
				isLoading: LinkTransformStore.isLoading,
				isSaving: LinkTransformStore.isSaving,
				linkTransforms: LinkTransformStore.getTransforms(),
				error: LinkTransformStore.error,
			});
		});

		this.listenTo(LinkTransformStore, 'loaded', () => {
			this.props.onLogin && this.props.onLogin();
		})

		this.listenTo(LinkTransformStore, 'saved', () => {
			this.props.onSave && this.props.onSave(LinkTransformStore.savedId);
		});

		this.listenTo(LinkTransformStore, 'problem', () => {
			this.setState({
				isLoading: LinkTransformStore.isLoading,
				isSaving: LinkTransformStore.isSaving,
				error: LinkTransformStore.error
			})
			this.props.onError && this.props.onError(LinkTransformStore.error);
		});
	}

	render() {
		var {isLoading, isSaving, linkTransforms, error} = this.state
		return (
			this.props.children({
				isLoading,
				isSaving,
				linkTransforms,
				error
			}, {

			})
		);
	}
};

TheComponent.propTypes = {};

module.exports = TheComponent;
