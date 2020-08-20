import React, {Component, PropTypes} from 'react';
import LinkLogoStore from '../stores/link-logo-store';

const TheComponent = class extends Component {
	displayName: 'TheComponent'

	constructor(props, context) {
		super(props, context);
		this.state = {
			isLoading: LinkLogoStore.isLoading,
			linkLogos: LinkLogoStore.getLogos()
		};
	}

	componentDidMount() {
		ES6Component(this);
		this.listenTo(LinkLogoStore, 'change', () => {
			this.setState({
				isLoading: LinkLogoStore.isLoading,
				isSaving: LinkLogoStore.isSaving,
				linkLogos: LinkLogoStore.getLogos(),
				error: LinkLogoStore.error,
			});
		});

		this.listenTo(LinkLogoStore, 'saved', () => {
			this.props.onSave && this.props.onSave(LinkLogoStore.savedId);
		});

		this.listenTo(LinkLogoStore, 'problem', () => {
			this.setState({
				isLoading: LinkLogoStore.isLoading,
				isSaving: LinkLogoStore.isSaving,
				error: LinkLogoStore.error
			})
			this.props.onError && this.props.onError(LinkLogoStore.error);
		});
	}

	render() {
		var {isLoading, isSaving, linkLogos, error} = this.state
		return (
			this.props.children({
				isLoading,
				isSaving,
				linkLogos,
				error
			}, {

			})
		);
	}
};

TheComponent.propTypes = {};

module.exports = TheComponent;
