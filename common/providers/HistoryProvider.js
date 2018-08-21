import React, {Component, PropTypes} from 'react';
import HistoryStore from '../stores/history-store';

const TheComponent = class extends Component {
	displayName: 'TheComponent'

	constructor(props, context) {
		super(props, context);
		this.state = {
			isLoading: HistoryStore.isLoading,
			history: HistoryStore.getHistory()
		};
	}

	componentDidMount() {
		ES6Component(this);
		this.listenTo(HistoryStore, 'change', () => {
			this.setState({
				isLoading: HistoryStore.isLoading,
				isSaving: HistoryStore.isSaving,
				history: HistoryStore.getHistory(),
				error: HistoryStore.error,
			});
		});

		this.listenTo(HistoryStore, 'loaded', () => {
			this.props.onLogin && this.props.onLogin();
		})

		this.listenTo(HistoryStore, 'saved', () => {
			this.props.onSave && this.props.onSave(HistoryStore.savedId);
		});

		this.listenTo(HistoryStore, 'problem', () => {
			this.setState({
				isLoading: HistoryStore.isLoading,
				isSaving: HistoryStore.isSaving,
				error: HistoryStore.error
			})
		});
	}

	render() {
		var {isLoading, isSaving, history, error} = this.state
		return (
			this.props.children({
				isLoading,
				isSaving,
				history,
				error
			}, {

			})
		);
	}
};

TheComponent.propTypes = {};

module.exports = TheComponent;
