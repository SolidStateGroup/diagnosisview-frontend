import React, {Component, PropTypes} from 'react';
import DiagnosisStore from '../stores/diagnosis-store';

const TheComponent = class extends Component {
	displayName: 'TheComponent'

	constructor(props, context) {
		super(props, context);
		this.state = {
			isLoading: DiagnosisStore.isLoading,
			codes: DiagnosisStore.getCodes(),
			categories: DiagnosisStore.getCategories()
		};
	}

	componentDidMount() {
		ES6Component(this);
		this.listenTo(DiagnosisStore, 'change', () => {
			this.setState({
				isLoading: DiagnosisStore.isLoading,
				isSaving: DiagnosisStore.isSaving,
				codes: DiagnosisStore.getCodes(),
				categories: DiagnosisStore.getCategories(),
				error: DiagnosisStore.error,
			});
		});

		this.listenTo(DiagnosisStore, 'problem', () => {
			this.setState({
				isLoading: DiagnosisStore.isLoading,
				isSaving: DiagnosisStore.isSaving,
				error: DiagnosisStore.error
			})
		});
	}

	render() {
		var {isLoading, isSaving, codes, categories, error} = this.state
		return (
			this.props.children({
				isLoading,
				isSaving,
				codes,
				categories,
				error
			}, {

			})
		);
	}
};

TheComponent.propTypes = {};

module.exports = TheComponent;
