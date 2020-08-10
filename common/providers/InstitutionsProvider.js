import React, {Component, PropTypes} from 'react';
import InstitutionsStore from '../stores/institutions-store';

const TheComponent = class extends Component {
	displayName: 'TheComponent'

	constructor(props, context) {
		super(props, context);
		this.state = {
			isLoading: InstitutionsStore.isLoading,
			institutions: InstitutionsStore.getInstitutions()
		};
	}

	componentDidMount() {
		ES6Component(this);
		this.listenTo(InstitutionsStore, 'change', () => {
			this.setState({
				isLoading: InstitutionsStore.isLoading,
				isSaving: InstitutionsStore.isSaving,
				institutions: InstitutionsStore.getInstitutions(),
				error: InstitutionsStore.error,
			});
		});

		this.listenTo(InstitutionsStore, 'saved', () => {
			this.props.onSave && this.props.onSave(InstitutionsStore.savedId);
		});

		this.listenTo(InstitutionsStore, 'problem', () => {
			this.setState({
				isLoading: InstitutionsStore.isLoading,
				isSaving: InstitutionsStore.isSaving,
				error: InstitutionsStore.error
			})
			this.props.onError && this.props.onError(InstitutionsStore.error);
		});
	}

	render() {
		var {isLoading, isSaving, institutions, error} = this.state
		return (
			this.props.children({
				isLoading,
				isSaving,
				institutions,
				error
			}, {

			})
		);
	}
};

TheComponent.propTypes = {};

module.exports = TheComponent;
