import React, {Component, PropTypes} from 'react';
import UsersStore from '../stores/users-store';

const TheComponent = class extends Component {
	displayName: 'TheComponent'

	constructor(props, context) {
		super(props, context);
		this.state = {
			isLoading: UsersStore.isLoading,
			users: UsersStore.getUsers()
		};
	}

	componentDidMount() {
		ES6Component(this);
		this.listenTo(UsersStore, 'change', () => {
			this.setState({
				isLoading: UsersStore.isLoading,
				isSaving: UsersStore.isSaving,
				users: UsersStore.getUsers(),
				error: UsersStore.error,
			});
		});

		this.listenTo(UsersStore, 'problem', () => {
			this.props.onError && this.props.onError(UsersStore.error);
			this.setState({
				isLoading: UsersStore.isLoading,
				isSaving: UsersStore.isSaving,
				error: UsersStore.error
			})
		});

		this.listenTo(UsersStore, 'saved', () => {
			this.setState({error: ''});
			this.props.onSave && this.props.onSave();
		})
	}

	createUser = (details) => {
		if (details.password !== details.repeatPassword) {
			this.setState({error: 'Passwords do not match'});
		}
		AppActions.createUser(details);
	}

	render() {
		var {isLoading, isSaving, users, error} = this.state
		return (
			this.props.children({
				isLoading,
				isSaving,
				users,
				error
			}, {
				createUser: this.createUser
			})
		);
	}
};

TheComponent.propTypes = {};

module.exports = TheComponent;
