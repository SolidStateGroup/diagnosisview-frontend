import React, {Component, PropTypes} from 'react';
import SettingsStore from '../stores/settings-store';

const TheComponent = class extends Component {
	displayName: 'TheComponent'

	constructor(props, context) {
		super(props, context);
		this.state = {
			isLoading: SettingsStore.isLoading,
			settings: SettingsStore.getSettings()
		};
	}

	componentDidMount() {
		ES6Component(this);
		this.listenTo(SettingsStore, 'change', () => {
			this.setState({
				isLoading: SettingsStore.isLoading,
				isSaving: SettingsStore.isSaving,
				settings: SettingsStore.getSettings(),
				error: SettingsStore.error,
			});
		});

		this.listenTo(SettingsStore, 'loaded', () => {
			this.props.onLogin && this.props.onLogin();
		})

		this.listenTo(SettingsStore, 'saved', () => {
			this.props.onSave && this.props.onSave(SettingsStore.savedId);
		});

		this.listenTo(SettingsStore, 'problem', () => {
			this.setState({
				isLoading: SettingsStore.isLoading,
				isSaving: SettingsStore.isSaving,
				error: SettingsStore.error
			})
			this.props.onError && this.props.onError(SettingsStore.error);
		});
	}

	render() {
		var {isLoading, isSaving, settings, error} = this.state
		return (
			this.props.children({
				isLoading,
				isSaving,
				settings,
				error
			}, {

			})
		);
	}
};

TheComponent.propTypes = {};

module.exports = TheComponent;
